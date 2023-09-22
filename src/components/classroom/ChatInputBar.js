import React, { useRef } from "react";

import styles from "./ChatInputBar.module.css";


function ChatInputBar({ sendMessage }) {
  const messageRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (messageRef.current.value !== "") {
      sendMessage(messageRef.current.value);
      messageRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className={styles.wrapper}>
        <input className={styles.input} ref={messageRef} />
        <button className={styles.button} type="submit">
          전송
        </button>
    </div>
    </form>
  );
}

export default ChatInputBar;
