import { useContext, useEffect, useRef } from "react";

import Message from "./Message";

import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { EVENT } from "../../utils/classroomUtils";
import styles from "./ChatMessages.module.css";


function ChatMessages({ chat, stateRef }) {
  const { currentUser } = useContext(CurrentUserContext);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  return (
    <ul className={styles.msgContainer} ref={scrollRef}>
      {chat.map((data, index) => {
        switch (data.type) {
          case EVENT.ENTER:
            return (
              <div key={index} className={styles.announcWrapper}>
                {data.sender === currentUser.username ? (
                  <div>
                    {index !== 0 ? <hr></hr> : null}
                    <span>{data.row}번째 줄 대화방</span>
                    <br></br>
                  </div>
                ) : null}
                <span className={styles.announcement}>{data.seatNum}번 좌석님이 들어왔습니다.</span>
              </div>
            );
          case EVENT.EXIT:
            return (
              <div key={index} className={styles.announcWrapper}>
                <span className={styles.announcement}>{data.seatNum}번 좌석님이 나갔습니다.</span>
              </div>
            );
          case EVENT.TALK:
            return stateRef.current === data.seatNum ? (
              <Message key={index} myMessage={true} data={data}></Message>
            ) : (
              <Message key={index} myMessage={false} data={data}></Message>
            );
          default:
            return null;
        }
      })}
    </ul>
  );
}

export default ChatMessages;
