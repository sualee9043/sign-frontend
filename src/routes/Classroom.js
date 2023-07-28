import { createBrowserHistory } from "history";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "./Classroom.module.css";
import NavBar from "../components/NavBar.js";
import { Seat, EmptySeat } from "../components/Seat";
import ColorCircle from "../components/classroom/ColorCircle";
import Emoji from "../components/Emoji";
import Chatroom from "../components/classroom/Chatroom";

import CircularProgress from "@mui/material/CircularProgress";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { colors, emojis } from "../utils/classroomUtils";
import { useParams } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useStompConnection } from "../utils/stompConnection";

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
  const history = createBrowserHistory();
  const [visible, setVisible] = useState(false);
  const column = roomInfo["capacity"] > 50 ? 10 : 5;
  const [seats, setSeats] = useState(new Array(roomInfo["capacity"]).fill(["empty", ""]));
  const [chat, setChat] = useState([]);

  const { seatNumRef, selectColor, changeSeat, sendMessage, selectEmoji, disconnect } =
    useStompConnection(roomId, column, currentUser, setSeats, setChat);
  const openChatroom = () => {
    setVisible((visible) => !visible);
  };

  useEffect(() => {
    history.listen(() => {
      if (history.action === "POP") {
        disconnect();
      }
    });
  }, [disconnect]);

  return (
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
            <Swiper>
              <SwiperSlide>
                <div className={styles.colors}>
                  {colors.map((color, index) => (
                    <ColorCircle key={index} color={color} selectColor={selectColor} />
                  ))}
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div>
                  {emojis.map((emoji, index) => (
                    <Emoji key={index} emoji={emoji} selectEmoji={selectEmoji}></Emoji>
                  ))}
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
      <Chatroom
        visible={visible}
        chat={chat}
        stateRef={seatNumRef}
        sendMessage={sendMessage}
      ></Chatroom>
    </div>
  );
}

const ClassRoom = () => {
  return (
    <InitDataFetcher>
      <Room />
    </InitDataFetcher>
  );
};

export default ClassRoom;
