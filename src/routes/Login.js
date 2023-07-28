import styles from "./Login.module.css";
import axios from "axios";
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
      console.log(response);
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
    <div>
      <div className={styles.wrapper}>
        <div className={styles.login}>
          <span className={styles.loginText}>Login</span>
          {errorMsg === "" ? null : <div className={styles.errorMsg}>{errorMsg}</div>}
          <div>
            <input
              className={styles.input}
              type="text"
              name="email"
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={handleOnKeyPress}
            />
            <button
              className={`${styles["login-button"]} ${styles["login-button-blue"]}`}
              onClick={handleClick}
            >
              Sign In
            </button>
            <br></br>
            <Link to="http://localhost:8080/oauth2/authorization/google">
              <button
                onClick={null}
                className={`${styles["login-button"]} ${styles["login-google"]}`}
              >
                Google 로그인
              </button>
            </Link>
            <Link to="http://localhost:8080/oauth2/authorization/kakao">
              <button className={`${styles["login-button"]} ${styles["login-kakao"]}`}>
                카카오 로그인
              </button>
            </Link>

            <div>
              <Link to="/signup">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
