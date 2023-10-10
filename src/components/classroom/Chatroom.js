import ChatMessages from "./ChatMessages";
import ChatInputBar from "./ChatInputBar";

import styles from "./Chatroom.module.css";


function Chatroom({ visible, chat, sendMessage }) {
  return (
    <div className={visible ? styles.chatroom : styles.hidden}>
      <ChatMessages chat={chat} />
      <ChatInputBar sendMessage={sendMessage} />
    </div>
  );
}

export default Chatroom;
