import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdQuestionAnswer } from "react-icons/md";

import styles from "./NavBar.module.css";


function NavBar({ mode, roomName, leftButtonHandler, rightButtonHandler }) {
  const navigate = useNavigate();
  return (
    <div className={styles.navBar}>
      <div className={styles.left}>
        <span
          onClick={() => {
            if (mode !== "default") {
              leftButtonHandler();
            }
            navigate("/home");
          }}
        >
          <MdArrowBack size="40" />
        </span>
      </div>
      {mode === "classroom" ? <span>{roomName}</span> : null}
      <div className={styles.right}>
        {mode == "classroom" ? (
          <span onClick={rightButtonHandler}>
            <MdQuestionAnswer size="40" />
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default NavBar;
