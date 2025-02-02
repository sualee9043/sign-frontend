import { useState, useEffect, useContext } from "react";
import { authApiInstance } from "../utils/api";
import { Link, useNavigate  } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";

import LoginBar from "../components/LoginBar.js";
import { RoomCard } from "../components/RoomCard.js";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import theme from "../utils/theme";
import styles from "./Home.module.css";


function Home() {
  const navigate = useNavigate();
  const { currentUser } = useContext(CurrentUserContext);
  const [rooms, setRooms] = useState(null);
  
  useEffect(() => {
    if (currentUser === null) {
      navigate("/");
    }
    
    async function getRooms() {
      try {
        const response = await authApiInstance.get(`/member/${currentUser.id}/classrooms`,
        {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`
          }
        });
        const roomsJson = response.data;
        setRooms(roomsJson);
      } catch (error) {
        console.error("There has been an error login", error);
      }
    }
    getRooms();
  }, []);

  return (
    <div>
      <LoginBar />
      <div className={`${styles.right} ${styles["button-wrapper"]}`}>
        <ThemeProvider theme={theme}>
          <Link to="/createroom">
            <Button variant="contained" color="primary" size="large">
              방 생성
            </Button>
          </Link>
          <Link to="/enterroom">
            <Button variant="contained" color="primary" size="large">
              방 참여
            </Button>
          </Link>
        </ThemeProvider>
      </div>
      <div className="room-container">
        <h2 className={styles.left}>참여한 방</h2>
        <div className="room">
          {rooms ? (
            rooms.length > 0 ? (
              rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  id={room.id}
                  type="입장"
                  roomInfo={room}
                  roomName={room.roomName}
                  hostUsername={room.hostUsername}
                  hostEmail={room.hostEmail}
                />
              ))
            ) : (
              <p className={styles["center"]}>참여한 방이 없습니다.</p>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Home;
