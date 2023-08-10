import styles from "./Login.module.css";
import axios from "axios";
import Logo from "../logo_big.svg";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setMessage] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(CurrentUserContext);

  const handleClick = async () => {
    try {
      const response = await axios.post("/member/login", {
        email: email,
        password: password,
      });
      const headers = response.headers;
      axios.defaults.headers.common["Access-Token"] = headers["access-token"];
      console.log(
        'axios.defaults.headers.common["Access-Token"]',
        axios.defaults.headers.common["Access-Token"]
      );
      getUser().then(() => {
        navigate("/home");
      });
    } catch (error) {
      setMessage(error.response.data);
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get("/member");
      const userInfo = response.data;
      setCurrentUser(userInfo);
    } catch (error) {
      console.error("There has been an error getUser", error);
    }
  };

  const handleOnKeyPress = (event) => {
    if (event.key === "Enter") handleClick();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.login}>
        <img className={styles.logo} src={Logo} alt="logo" />
        {errorMsg === "" ? null : <div className={styles.errorMsg}>{errorMsg}</div>}
        <div className={styles["login-form"]}>
          <div className={styles["input-wrapper"]}>
            <input
              className={styles.input}
              type="text"
              name="email"
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className={styles["input-wrapper"]}>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={handleOnKeyPress}
            />
          </div>
          <button
            className={`${styles["login-button"]} ${styles["login-button-blue"]}`}
            onClick={handleClick}
          >
            로그인
          </button>
          <br></br>

          <button onClick={null} className={`${styles["login-button"]} ${styles["login-google"]}`}>
            <a
              href={`${process.env.REACT_APP_OAUTH_LOGIN_URL}/google`}
              className={styles["login-google"]}
            >
              Google 로그인
            </a>
          </button>

          <button className={`${styles["login-button"]} ${styles["login-kakao"]}`}>
            <a
              href={`${process.env.REACT_APP_OAUTH_LOGIN_URL}/kakao`}
              className={styles["login-kakao"]}
            >
              카카오 로그인
            </a>
          </button>

          <div className={styles.signup}>
            <Link to="/signup">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
