import React from "react";
import styles from "./Circle.module.css";

function ColorCircle({ color, selectColor }) {
  return (
    <div
      className={`${styles.seat} ${styles[color]} ${styles.small} ${styles.color}`}
      onClick={() => {
        selectColor(color);
      }}
    ></div>
  );
}

export default ColorCircle;
