import styles from "./Message.module.css";

function Message({ myMessage, data }) {
  return myMessage ? (
    <div className={`${styles.msgWrapper} ${styles.right}`}>
      <span className={styles.sentTime}>{data.sentTime}</span>
      <li className={styles.message}>{data.content}</li>
    </div>
  ) : (
    <div className={`${styles.msgWrapper} ${styles.left}`}>
      <span className={styles.sender}>{data.seatNum}번 좌석</span>
      <li className={styles.message}>
        <span>{data.content}</span>
      </li>
      <span className={styles.sentTime}>{data.sentTime}</span>
    </div>
  );
}

export default Message;
