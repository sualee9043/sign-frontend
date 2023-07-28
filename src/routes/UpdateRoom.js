import styles from "./RoomForm.module.css";
import axios from "axios";
import button_styles from "../components/Button.module.css";
import { roomNameSchema } from "../schemas/CreateRoomSchema";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import NavBar from "../components/NavBar";
import Button from "@mui/material/Button";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../utils/theme";

function UpdateRoom({}) {
  const [deleteClicked, setDeleteClicked] = useState(false);
  const location = useLocation();
  const roomInfo = location.state.roomInfo;

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      roomName: roomInfo.roomName,
    },
    validateOnMount: true,
    validationSchema: roomNameSchema,
  });

  const updateRoomName = async (values) => {
    if (roomInfo.roomName !== values.roomName) {
      try {
        await axios.put(`/classroom/${roomInfo.id}`, {
          roomName: values.roomName,
        });
        navigate("/home");
      } catch (error) {
        console.error("There has been an error", error);
      }
    }
  };

  const showConfirmMessage = () => {
    setDeleteClicked((clicked) => !clicked);
  };

  return (
    <div className={styles.container}>
      <NavBar mode="default" />
      <div className={styles.wrapper}>
        <ConfirmMessage
          roomId={roomInfo.id}
          visible={deleteClicked}
          setVisible={setDeleteClicked}
        />
        <form
          onSubmit={(e) => {
            formik.handleSubmit(e);
            updateRoomName(formik.values);
          }}
          autoComplete="off"
        >
          <p className={styles.label}>방 이름</p>
          {formik.touched.roomName && formik.errors.roomName ? (
            <div className={styles.errorMsg}>{formik.errors.roomName}</div>
          ) : null}
          <input
            className={styles.input}
            type="text"
            name="roomName"
            value={formik.values.roomName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          ></input>
          <p className={styles.label}>정원</p>
          <p className={styles.input}>{roomInfo.capacity}명</p>
          <ThemeProvider theme={theme}>
            <div className={styles["button-wrapper"]}>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={showConfirmMessage}
              >
                삭제
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                방 정보 수정
              </Button>
            </div>
          </ThemeProvider>
        </form>
      </div>
    </div>
  );
}

function ConfirmMessage({ roomId, visible, setVisible }) {
  const navigate = useNavigate();
  const cancel = () => {
    setVisible((visible) => !visible);
  };
  const deleteRoom = async () => {
    try {
      await axios.delete(`/classroom/${roomId}`);
      navigate("/home");
    } catch (error) {
      console.error("There has been an error", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={visible ? styles["message-container"] : styles.hidden}>
        <div>
          <p className={styles.message}>정말 삭제하시겠습니까?</p>
          <div className={styles["button-wrapper"]}>
            <Button variant="outlined" color="white" size="large" onClick={cancel}>
              취소
            </Button>
            <Button variant="contained" color="primary" size="large" onClick={deleteRoom}>
              삭제
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
export default UpdateRoom;
