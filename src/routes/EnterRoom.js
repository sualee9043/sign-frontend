import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authApiInstance } from "../utils/api";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../utils/theme";

import { SearchRoomCard } from "../components/RoomCard";
import NavBar from "../components/NavBar.js";
import Button from "@mui/material/Button";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import styles from "./RoomForm.module.css";


function EnterRoom() {
  const { currentUser } = useContext(CurrentUserContext);
  const [roomCode, setRoomcode] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [foundRoom, setFoundRoom] = useState(null);

  const findRoomByRoomcode = async () => {
    try {
      const response = await authApiInstance.get(`/classrooms`, 
      { params: { code: roomCode } },
      {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      });
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
      await authApiInstance.put(`/member/${currentUser.id}/classroom/${foundRoom["id"]}`,
      {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`
        }
      });
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setErrorMessage(error.response.data["message"]);
      } else {
        console.error(error.response);
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
