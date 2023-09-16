import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useIdleTimer } from 'react-idle-timer'

import { EVENT } from "./classroomUtils";


export const useStompConnection = (room, currentUser, setState) => {
  const [stomp, setStomp] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  
  const [roomSubscription, setRoomSubscription] = useState(null);
  const [chatSubscription, setChatSubsription] = useState(null);
  const [queueSubscription, setQueueSubscription] = useState(null);
  const [isConnected, setIsConnected] = useState(null);

  const navigate = useNavigate();
  const seatNumRef = useRef();
  const rowRef = useRef();
  // const [row, setRow] = useState(null);  
  const {roomId, columnNum} = room;
  const {setSeats, setChat} = setState;

  const tokenHeader = { 
    "roomId": roomId, 
    "Access-Token": axios.defaults.headers.common["Access-Token"],
  };

  useEffect(()=> {
    window.addEventListener("unload", disconnect);
    return () => {
      window.removeEventListener("unload", disconnect);
    }
  }, []);

  useEffect(() => {
    const Sock = new SockJS(process.env.REACT_APP_WEB_SOCKET_URL);
    const client = over(Sock);
    // client.debug = () => {};
    setStompClient(client);
  }, [currentUser]);

  const onChatMessageReceived = (received) => {
    const parsedMsg = JSON.parse(received.body);
    setChat((chat) => {
      return [...chat, parsedMsg];
    });
  };
  
  const color = (seatNum, receivedColor) => {
    setSeats((oldSeats) => {
      let newSeats = [...oldSeats];
      newSeats[seatNum - 1] = [receivedColor, oldSeats[seatNum - 1][1]];
      return newSeats;
    });
  };

  const drawEmoji = (seatNum, receivedEmoji) => {
    setSeats((oldSeats) => {
      let newSeats = [...oldSeats];
      newSeats[seatNum - 1][1] = receivedEmoji;
      return newSeats;
    });
  };

  useEffect(() => {
    if (stompClient) {
      const onConnected = () => {
        setIsConnected(true);
        const roomSub = stompClient.subscribe(`/topic/classroom/${roomId}`, onMessageReceived, tokenHeader);
        setRoomSubscription(roomSub);
        // const queueSubscription = stompClient.subscribe(
        const queueSub = stompClient.subscribe(
          `/queue/temp/classroom/${roomId}/member/${currentUser.id}`,
          (received) => {
            const classroomInfo = JSON.parse(received.body);
            seatNumRef.current = classroomInfo.seatNum;
            // const newRow = parseInt(classroomInfo.seatNum / columnNum) + 1; 
            // setRow(newRow);  
            rowRef.current = parseInt(classroomInfo.seatNum / columnNum) + 1;
            setSeats((oldSeats) => {
              let newSeats = [...oldSeats];
              for (let seatNum in classroomInfo.classRoomStates) {
                newSeats[seatNum - 1] = classroomInfo.classRoomStates[seatNum];
              }
              return newSeats;
            });
          },
          tokenHeader
        );
        setQueueSubscription(queueSub);
        
      };
      
      stompClient.connect(
        tokenHeader,
        onConnected,
        (error) => {
          console.error(error);
          navigate("/home");
        }
      );  
    }
  }, [stompClient]);

  useEffect(() => {
    if (queueSubscription) {
      setChatSubsription((_) => {
        const subscription = stompClient.subscribe(
          `/topic/classroom/${roomId}/chat/${rowRef.current}`,
          onChatMessageReceived,
          tokenHeader
        );
        stompClient.send(
          `/topic/classroom/${roomId}/chat/${rowRef.current}`,
          tokenHeader,
          JSON.stringify({
            type: EVENT.ENTER,
            seatNum: seatNumRef.current,
            row: rowRef.current,
            content: null,
          })
        );
        return subscription;
      });

      stompClient.send(
        `/topic/classroom/${roomId}`,
        tokenHeader,
        JSON.stringify({
          type: EVENT.ENTER,
          seatNum: seatNumRef.current,
          content: null,
        })
      );
    }
  }, [queueSubscription]);


  const onMessageReceived = (received) => {
    const parsedMsg = JSON.parse(received.body);
    switch (parsedMsg.type) {
      case EVENT.ENTER:
        color(parsedMsg.seatNum, "unselected");
        break;
      case EVENT.COLOR:
        color(parsedMsg.seatNum, parsedMsg.message);
        break;
      case EVENT.DRAW_EMOJI:
        drawEmoji(parsedMsg.seatNum, parsedMsg.message);
        break;
      case EVENT.EXIT:
        color(parsedMsg.seatNum, "empty");
        break;
        case EVENT.CHANGE_SEAT:
          setSeats((oldSeats) => {
            let newSeats = [...oldSeats];
            newSeats[parseInt(parsedMsg.message) - 1] = oldSeats[parsedMsg.seatNum - 1];
            newSeats[parsedMsg.seatNum - 1] = ["empty", ""];
            return newSeats;
          });
          if (parsedMsg.seatNum === seatNumRef.current) {
            const prevSeatNum = seatNumRef.current;
            const newSeatNum = parseInt(parsedMsg.message);
            const prevRow = rowRef.current;
            const newRow = parseInt(newSeatNum / columnNum) + 1;

            if (newRow !== prevRow) { // 다른 줄
              stompClient.send(
                `/topic/classroom/${roomId}/chat/${rowRef.current}`,
                tokenHeader,
                JSON.stringify({
                  type: EVENT.EXIT,
                  seatNum: prevSeatNum,
                  content: null,
                })
              );
              setChat([]);
              chatSubscription.unsubscribe();
              
              setChatSubsription((_) => {
                const subscription = stompClient.subscribe(
                  `/topic/classroom/${roomId}/chat/${newRow}`,
                  onChatMessageReceived,
                  tokenHeader
                );
                stompClient.send(
                  `/topic/classroom/${roomId}/chat/${newRow}`,
                  tokenHeader,
                  JSON.stringify({
                    type: EVENT.ENTER,
                    seatNum: newSeatNum,
                    row: newRow,
                    content: null,
                  })
                );
                
                return subscription;
              });
            } else { // 같은 줄
              setChat((chat) => {
                chat.forEach((message) => {
                  if (message.seatNum === prevSeatNum) {
                    message.seatNum = newSeatNum;
                  }
                });
                return chat;
              });
            }
            rowRef.current = newRow;
            seatNumRef.current = newSeatNum;
          }
          break;
      case EVENT.CHECK:
        console.log("check");
        break;
      default:
        console.error("Unexpected message.");
    }
  };

  const check = useCallback(
    () => {
    // stompClient.send(
    //   `/topic/classroom/${roomId}`,
    //   tokenHeader,
    //   JSON.stringify({
    //     type: EVENT.CHECK,
    //     roomId: roomId
    //   })
    // );
  }, [stompClient]);
  
  const { isIdle } = useIdleTimer({
    onIdle: check,
    timeout: 3_000
  });
  
  const selectColor = useCallback(
    (color) => {
      stompClient.send(
        `/topic/classroom/${roomId}`,
        tokenHeader,
        JSON.stringify({
          type: EVENT.COLOR,
          roomId: roomId,
          message: color,
          seatNum: seatNumRef.current,
        })
      );
    },
    [stompClient, seatNumRef]
  );

  const selectEmoji = useCallback(
    (emoji) => {
      stompClient.send(
        `/topic/classroom/${roomId}`,
        tokenHeader,
        JSON.stringify({
          type: EVENT.DRAW_EMOJI,
          roomId: roomId,
          message: emoji,
          seatNum: seatNumRef.current,
        })
      );
    },
    [stompClient, seatNumRef]
  );

  const changeSeat = useCallback(
    (seatNum) => {
      
      stompClient.send(
        `/topic/classroom/${roomId}`,
        tokenHeader,
        JSON.stringify({
          type: EVENT.CHANGE_SEAT,
          roomId: roomId,
          message: seatNum + 1,
          seatNum: seatNumRef.current,
        })
      );
      
    },
    [stompClient, seatNumRef, chatSubscription]
  );

  const sendMessage = useCallback(
    (message) => {
      stompClient.send(
        `/topic/classroom/${roomId}/chat/${rowRef.current}`,
        tokenHeader,
        JSON.stringify({
          type: EVENT.TALK,
          seatNum: seatNumRef.current,
          content: message,
        })
      );
    },
    [stompClient, seatNumRef, rowRef.current]
  );

  const disconnect = useCallback(() => {
    if (stompClient !== null) {
      stompClient.send(
        `/topic/classroom/${roomId}`,
        tokenHeader,
        JSON.stringify({
          type: EVENT.EXIT,
          seatNum: seatNumRef.current,
          content: null,
        })
      );
      stompClient.disconnect();
    }
  }, [stompClient, seatNumRef]);
 
  const actions = {
    selectColor,
    changeSeat,
    sendMessage,
    selectEmoji,
    disconnect,
  }

  
  return { seatNumRef, isConnected, actions };
};
