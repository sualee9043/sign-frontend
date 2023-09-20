import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { createBrowserHistory } from "history";
import { useParams, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

import NavBar from "../components/NavBar.js";
import { Seat, EmptySeat } from "../components/Seat";
import Emoji from "../components/Emoji";
import Chatroom from "../components/classroom/Chatroom";
import ColorCircle from "../components/classroom/ColorCircle";

import { colors, emojis } from "../utils/classroomUtils";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useStompConnection } from "../utils/stompConnection";
import styles from "./Classroom.module.css";


const InitDataFetcher = ({ children }) => {
  const params = useParams();
  const roomId = parseInt(params.roomId);

  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [roomInfo, setRoomInfo] = useState(null);
  useEffect(() => {
    if (!currentUser) {
      axios
        .get("/member")
        .then((response) => setCurrentUser(response.data))
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    axios
      .get(`/classroom/${roomId}`)
      .then((response) => setRoomInfo(response.data))
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return currentUser && roomInfo ? (
    React.cloneElement(children, { currentUser, roomInfo })
  ) : (
    <CircularProgress />
  );
};

function Room({ currentUser, roomInfo }) {
  const params = useParams();
  const roomId = parseInt(params.roomId);
  
  const navigate = useNavigate();
  const history = createBrowserHistory();
  const column = roomInfo["capacity"] > 50 ? 10 : 5;
  const [visible, setVisible] = useState(false);
  const [seats, setSeats] = useState(new Array(roomInfo["capacity"]).fill(["empty", ""]));
  const [chat, setChat] = useState([]);
  const previousEmoji = useRef("");

  const room = {
    roomId: roomId,
    columnNum: column
  };

  const setState = {
    setSeats: setSeats,
    setChat: setChat
  };

  const  { seatNumRef, isConnected, actions } =
    useStompConnection(room, currentUser, setState);

  
  const {selectColor, changeSeat, sendMessage, selectEmoji, disconnect} = actions;
  
  const openChatroom = () => {
    setVisible((visible) => !visible);
  };

  useEffect(() => {
    if (isConnected === false) {
      navigate("/home");
    }
  }, [isConnected]);

  useEffect(() => {
    history.listen(() => {
      if (history.action === "POP") {
        disconnect();
      }
    });

  }, []);


  return isConnected !== null? (
    <div className={styles.wrapper}>
      <NavBar
        mode="classroom"
        roomId={roomId}
        leftButtonHandler={disconnect}
        roomName={roomInfo.roomName}
        rightButtonHandler={openChatroom}
      />
      <div className={styles.classroom}>
        <div className={styles.container}>
          <div className={styles.seats}>
            {seats.map((state, index) =>
              state[0] !== "empty" ? (
                <Seat
                  key={index}
                  size={column}
                  index={index}
                  color={state[0]}
                  emoji={state[1]}
                  mySeat={index === seatNumRef.current - 1}
                  setSeats={setSeats}
                />
              ) : (
                <EmptySeat key={index} size={column} changeSeat={() => changeSeat(index)} />
              )
            )}
          </div>
          <div className={styles["expression-wrapper"]}>
            <Swiper pagination={true} modules={[Pagination]}>
              <SwiperSlide>
                <div className={`${styles.colors} ${styles.expressions}`}>
                  {colors.map((color, index) => (
                    <ColorCircle key={index} color={color} selectColor={selectColor} />
                  ))}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className={styles.expressions}>
                  {emojis.map((emoji, index) => (
                    <Emoji
                      key={index}
                      emoji={emoji}
                      previousEmoji={previousEmoji}
                      selectEmoji={selectEmoji}
                    ></Emoji>
                  ))}
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <Chatroom
          visible={visible}
          chat={chat}
          stateRef={seatNumRef}
          sendMessage={sendMessage}
        ></Chatroom>
      </div>
    </div>
  ) : null;
}

const ClassRoom = () => {
  return (
    <InitDataFetcher>
      <Room />
    </InitDataFetcher>
  );
};

export default ClassRoom;
