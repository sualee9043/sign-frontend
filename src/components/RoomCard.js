import styles from "./RoomCard.module.css";
import NavLinkButton from "./NavLinkButton";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import theme from "../utils/theme";
import { ThemeProvider } from "@mui/material/styles";

import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function RoomCard({ roomInfo }) {
  const { currentUser } = useContext(CurrentUserContext);
  const isHost = roomInfo.hostEmail === currentUser.email;

  return isHost ? <HostRoomCard roomInfo={roomInfo} /> : <EnterRoomCard roomInfo={roomInfo} />;
}

function RoomCardLayout({ roomInfo, buttons }) {
  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <div className={styles.roomInfo}>
          <div className={styles.roomName}>{roomInfo.roomName}</div>
          <div className={styles.host}>
            {roomInfo.hostUsername} · {roomInfo.capacity}명
          </div>
        </div>
        {buttons}
      </div>
    </div>
  );
}

export function HostRoomCard({ roomInfo }) {
  return (
    <RoomCardLayout
      buttons={<HostRoomCardButtons roomInfo={roomInfo} />}
      roomInfo={roomInfo}
    ></RoomCardLayout>
  );
}

export function EnterRoomCard({ roomInfo }) {
  return (
    <RoomCardLayout
      buttons={<EnterRoomCardButtons roomInfo={roomInfo} />}
      roomInfo={roomInfo}
    ></RoomCardLayout>
  );
}

function HostRoomCardButtons({ roomInfo }) {
  return (
    <div className={styles.buttons}>
      <ThemeProvider theme={theme}>
        <Link to={`/updateroom`} state={{ roomInfo: roomInfo }}>
          <Button variant="contained" color="setting" size="large">
            설정
          </Button>
        </Link>
        <br></br>
        <Link to={`/classroom/${roomInfo.id}`}>
          <Button variant="contained" color="yellow" size="large">
            입장
          </Button>
        </Link>
      </ThemeProvider>
    </div>
  );
}

function EnterRoomCardButtons({ roomInfo }) {
  return (
    <div className={styles.buttons}>
      <br></br>
      <NavLinkButton
        path={`classroom/${roomInfo.id}`}
        text="입장"
        type="enter"
        roomId={roomInfo.id}
      />
    </div>
  );
}

function SearchRoomCardButtons({ handleJoinClick }) {
  return (
    <div className={styles.buttons}>
      <br></br>
      <ThemeProvider theme={theme}>
        <Button variant="contained" color="primary" size="large" onClick={handleJoinClick}>
          참여
        </Button>
      </ThemeProvider>
    </div>
  );
}

export function SearchRoomCard({ roomInfo, handleJoinClick }) {
  return (
    <RoomCardLayout
      buttons={<SearchRoomCardButtons handleJoinClick={handleJoinClick} />}
      roomInfo={roomInfo}
    ></RoomCardLayout>
  );
}
