import { useContext, useEffect, useRef } from "react";

import Message from "./Message";

import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { EVENT } from "../../utils/classroomUtils";
import styles from "./ChatMessages.module.css";


function ChatMessages({ chat }) {
  const { currentUser } = useContext(CurrentUserContext);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  return (
    <ul className={styles["message-container"]} ref={scrollRef}>
      {chat.map((data, index) => {
        switch (data.type) {
          case EVENT.ENTER:
            return <EnterMessage key={index} data={data} currentUser={currentUser} index={index}></EnterMessage>; 
          case EVENT.EXIT:
            return <ExitMessage key={index} data={data} index={index}></ExitMessage>;
          case EVENT.TALK:
            return <TalkMessage key={index} data={data} isMyMessage={currentUser.id === data.sender}></TalkMessage>; 
          default:
            return null;
        }
      })}
    </ul>
  );
}

export default ChatMessages;

function EnterMessage({data, currentUser, index}) {
  
  return (
    <div className={styles["announcement-wrapper"]}>
      {data.sender === currentUser.id ? (
        <div className={styles["chatroom-name"]}>
          {index !== 0 ? <hr></hr> : null}
          <span>{data.row}번째 줄 대화방</span>
          <br></br>
        </div>
      ) : null}
      <span className={styles.announcement}>{data.seatNum}번 좌석님이 들어왔습니다.</span>
    </div>
  );
}

function ExitMessage({data, index}) {
  return (
    <div key={index} className={styles["announcement-wrapper"]}>
      <span className={styles.announcement}>{data.seatNum}번 좌석님이 나갔습니다.</span>
    </div>
  );
}

function TalkMessage({data, isMyMessage}) {
  return <Message myMessage={isMyMessage} data={data}></Message>
}