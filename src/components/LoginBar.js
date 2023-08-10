import { useContext } from "react";
import { Link } from "react-router-dom";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import styles from "./LoginBar.module.css";


function LoginBar() {
  const { currentUser } = useContext(CurrentUserContext);

  return (
    <div className={styles.loginbar}>
      {currentUser ? (
        <span className={styles["user-bar"]}>
          <span>{currentUser.username}</span>
          <Link to="/mypage">
            <div
              className={`${styles["profile-img"]} `}
              style={
                currentUser.picture
                  ? { backgroundImage: `url("${currentUser.picture}")` }
                  : { backgroundImage: `url("logo512.png")` }
              }
            ></div>
          </Link>
        </span>
      ) : (
        <Link to="/login">
          <span>Log in</span>
        </Link>
      )}
    </div>
  );
}

export default LoginBar;
