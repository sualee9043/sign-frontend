import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "./RoomForm.module.css";
import { SearchRoomCard } from "../components/RoomCard";
import NavBar from "../components/NavBar.js";
import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

import Button from "@mui/material/Button";
import theme from "../utils/theme";
import { ThemeProvider } from "@mui/material/styles";

function EnterRoom() {
  const { currentUser } = useContext(CurrentUserContext);
  const [roomCode, setRoomcode] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [foundRoom, setFoundRoom] = useState(null);

  const findRoomByRoomcode = async () => {
    try {
      const response = await axios.get(`/classrooms`, { params: { code: roomCode } });
      const result = response.data;
      setErrorMessage(null);
      setFoundRoom(result);
    } catch (error) {
      setFoundRoom(null);
      if (error.response && error.response.status === 404) {
        const result = error.response.data;
        setErrorMessage(result["message"]);
      }
    }
  };

  const enterRoom = async () => {
    try {
      await axios.put(`/member/${currentUser.id}/classroom/${foundRoom["id"]}`);
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(error.response.data["message"]);
      } else {
        console.log(error.response);
      }
    }
  };

  return (
    <div className={styles.container}>
      <NavBar mode="default" />
      <div className={styles.wrapper}>
        <p className={styles.label}>입장 코드</p>
        <input
          type="text"
          className={styles.input}
          onChange={(event) => setRoomcode(event.target.value)}
        ></input>
        <ThemeProvider theme={theme}>
          <Button variant="contained" color="primary" size="large" onClick={findRoomByRoomcode}>
            방 찾기
          </Button>
        </ThemeProvider>
        <br></br>
        {foundRoom ? <SearchRoomCard roomInfo={foundRoom} handleJoinClick={enterRoom} /> : null}
        {errorMessage !== "" ? <div className={styles.errorMsg}>{errorMessage}</div> : null}
      </div>
    </div>
  );
}

export default EnterRoom;
