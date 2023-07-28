import styles from "./Login.module.css";
import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { validationSchema } from "../schemas/SignupSchema";
import Button from "@mui/material/Button";
import theme from "../utils/theme";
import { ThemeProvider } from "@mui/material/styles";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const hasChange = useRef(false);
  const validationResult = useRef(true);
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      password2: "",
    },
    validationSchema: validationSchema(hasChange, validationResult),
    validateOnMount: true,
    validateOnChange: false,
    validateOnBlur: true,
  });

  const handleClick = async (values) => {
    try {
      await axios.post("/members", values);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        const data = error.response.data;
        formik.setErrors(data.errors);
      }
    }
  };

  const onBlur = (e) => {
    hasChange.current = formik.values.email !== email;
    formik.handleBlur(e);
    setEmail(formik.values.email);
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.login}>
          <span className={styles.loginText}>Sign up</span>
          <form
            onSubmit={(e) => {
              formik.handleSubmit(e);
              handleClick(formik.values);
            }}
            autoComplete="off"
          >
            {formik.touched.username && formik.errors.username ? (
              <p className={styles["input-error"]}>{formik.errors.username}</p>
            ) : null}
            <input
              className={styles.input}
              type="text"
              name="username"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={onBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className={styles["input-error"]}>{formik.errors.email}</p>
            ) : null}
            <input
              className={styles.input}
              type="text"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={onBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className={styles["input-error"]}>{formik.errors.password}</p>
            ) : null}
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={onBlur}
            />
            {formik.touched.password2 && formik.errors.password2 ? (
              <p className={styles["input-error"]}>{formik.errors.password2}</p>
            ) : null}
            <input
              className={styles.input}
              type="password"
              name="password2"
              placeholder="Password Confirmation"
              value={formik.values.password2}
              onChange={formik.handleChange}
              onBlur={onBlur}
            />
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Sign up
              </Button>
            </ThemeProvider>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
