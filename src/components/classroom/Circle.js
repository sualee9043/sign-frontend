import { useEffect } from "react";
import styles from "./Circle.module.css";

function Circle({ size, state = "empty", emoji, mySeat = false, handler = null }) {
  return (
    <div className={`${styles.seat} ${styles[state]} ${styles[`size-${size}`]}`} onClick={handler}>
      {mySeat ? <span className={`${styles.float} ${styles.I}`}>I</span> : null}
      <span className={`${styles.float} ${styles.emoji}`}>{emoji}</span>
    </div>
  );
}

export default Circle;
