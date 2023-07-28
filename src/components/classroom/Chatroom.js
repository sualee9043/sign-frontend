import styles from "./Chatroom.module.css";
import ChatMessages from "./ChatMessages";
import ChatInputBar from "./ChatInputBar";

function Chatroom({ visible, chat, stateRef, sendMessage }) {
  return (
    <div className={visible ? styles.chatroom : styles.hidden}>
      <ChatMessages chat={chat} stateRef={stateRef} />
      <ChatInputBar sendMessage={sendMessage} />
    </div>
  );
}

export default Chatroom;
