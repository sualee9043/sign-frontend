import { useState, useRef } from "react";
import { authApiInstance } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

import NavBar from "../components/NavBar.js";

import { validationSchema } from "../schemas/CreateRoomSchema";
import button_styles from "../components/Button.module.css";
import styles from "./RoomForm.module.css";


function CreateRoom() {
  const [name, setName] = useState("");
  const hasChange = useRef(false);
  const validationResult = useRef(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      capacity: "",
    },
    validateOnMount: true,
    validationSchema: validationSchema(hasChange, validationResult),
    validateOnChange: false,
    validateOnBlur: true,
  });

  const createRoom = async (values) => {
    try {
      await authApiInstance.post("/classrooms", values);
      navigate("/home");
    } catch (error) {
      console.error("There has been an error login");
    }
  };

  const onBlur = (e) => {
    hasChange.current = formik.values.name !== name;
    formik.handleBlur(e);
    setName(formik.values.email);
  };

  return (
    <div className={styles.container}>
      <NavBar mode="default" />
      <div className={styles.wrapper}>
        <form
          onSubmit={(e) => {
            formik.handleSubmit(e);
            createRoom(formik.values);
          }}
          autoComplete="off"
        >
          <p className={styles.label}>방 이름</p>
          {formik.touched.name && formik.errors.name ? (
            <div className={styles.errorMsg}>{formik.errors.name}</div>
          ) : null}
          <input
            className={styles.input}
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={onBlur}
          ></input>
          <p className={styles.label}>입장 코드</p>
          {formik.touched.code && formik.errors.code ? (
            <div className={styles.errorMsg}>{formik.errors.code}</div>
          ) : null}
          <input
            className={styles.input}
            type="text"
            name="code"
            value={formik.values.code}
            onChange={formik.handleChange}
            onBlur={onBlur}
          ></input>
          <p className={styles.label}>정원</p>
          {formik.touched.capacity && formik.errors.capacity ? (
            <div className={styles.errorMsg}>{formik.errors.capacity}</div>
          ) : null}
          <input
            className={styles.input}
            type="text"
            name="capacity"
            value={formik.values.capacity}
            onChange={formik.handleChange}
            onBlur={onBlur}
          ></input>
          <p>
            <button
              className={`${button_styles.btn} ${button_styles.room}`}
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              방 생성
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default CreateRoom;
