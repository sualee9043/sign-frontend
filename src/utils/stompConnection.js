import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { over } from "stompjs";
import SockJS from "sockjs-client";

import { EVENT, getCurrentTime } from "./classroomUtils";


export const useStompConnection = (room, currentUser, setState) => {
  const [stompClient, setStompClient] = useState(null);
  const [roomSubscription, setRoomSubscription] = useState(null);
  const [chatSubscription, setChatSubscription] = useState(null);
  const [_, setQueueSubscription] = useState(null);
  const [isConnected, setIsConnected] = useState(null);

  const navigate = useNavigate();
  const seatNumRef = useRef();
  const rowRef = useRef();

  const {roomId, columnNum} = room;
  const {setSeats, setChat} = setState;

  useEffect(()=> {
    const Sock = new SockJS(process.env.REACT_APP_WEB_SOCKET_URL);
    const client = over(Sock);
    client.heartbeat.outgoing = 20000;
    client.heartbeat.incoming = 0;
    client.debug = () => {};
    setStompClient(client);
    
  }, []);


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
        const roomSub = stompClient.subscribe(`/topic/classroom/${roomId}`, onMessageReceived);
        setRoomSubscription(roomSub);
        const queueSub = stompClient.subscribe(
          `/queue/temp/classroom/${roomId}/member/${currentUser.id}`,
          onQueueMessageReceived
        );
        setQueueSubscription(queueSub);
        
      };
      
      stompClient.connect(
        {
          "roomId": roomId,
          "Access-Token": axios.defaults.headers.common["Access-Token"]
        },
        onConnected,
        (error) => {
          console.error(error);
          navigate("/home");
        }
      );  
    }
  }, [stompClient]);

  const onQueueMessageReceived = (received) => {
    const classroomInfo = JSON.parse(received.body);
    seatNumRef.current = classroomInfo.seatNum;
    rowRef.current = parseInt(classroomInfo.seatNum / columnNum) + 1;
    
    setSeats((oldSeats) => {
      let newSeats = [...oldSeats];
      for (let seatNum in classroomInfo.classRoomStates) {
        newSeats[seatNum - 1] = classroomInfo.classRoomStates[seatNum];
      }
      return newSeats;
    });
    
    stompClient.send(
      `/topic/classroom/${roomId}`,
      {},
      JSON.stringify({
        type: EVENT.ENTER,
        seatNum: seatNumRef.current,
        content: null,
      })
    );

    setChatSubscription(() => {
      const subscription = stompClient.subscribe(
        `/topic/classroom/${roomId}/chat/${rowRef.current}`,
        onChatMessageReceived
      );

      stompClient.send(
        `/topic/classroom/${roomId}/chat/${rowRef.current}`,
        {},
        JSON.stringify({
          type: EVENT.ENTER,
          seatNum: seatNumRef.current,
          row: rowRef.current,
          sender: currentUser.id
        })
      );
      return subscription;
    });
    setQueueSubscription((subscription) => {
      subscription.unsubscribe();
      return null;
    })
  }

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
          const newSeatNum = parseInt(parsedMsg.message);
          const prevSeatNum = parsedMsg.seatNum
          
          setSeats((oldSeats) => {
            let newSeats = [...oldSeats];
            newSeats[newSeatNum - 1] = oldSeats[prevSeatNum - 1];
            newSeats[prevSeatNum - 1] = ["empty", ""];
            return newSeats;
          });
          const mySeatNum = seatNumRef.current;

          if (prevSeatNum === mySeatNum) {
            const prevRow = rowRef.current;
            const newRow = parseInt(newSeatNum / columnNum) + 1;
            if (newRow !== prevRow) { 
              stompClient.send(
                `/topic/classroom/${roomId}/chat/${rowRef.current}`,
                {},
                JSON.stringify({
                  type: EVENT.EXIT,
                  seatNum: mySeatNum,
                  sender: currentUser.id
                })
              );
              setChatSubscription((prevSubscription) => {
                prevSubscription.unsubscribe();
                const subscription = stompClient.subscribe(
                  `/topic/classroom/${roomId}/chat/${newRow}`,
                  onChatMessageReceived
                );
                stompClient.send(
                  `/topic/classroom/${roomId}/chat/${newRow}`,
                  {},
                  JSON.stringify({
                    type: EVENT.ENTER,
                    seatNum: newSeatNum,
                    row: newRow,
                    sender: currentUser.id
                  })
                );
                
                return subscription;
              });
            } else { 
              setChat((chat) => {
                chat.forEach((message) => {
                  if (message.seatNum === mySeatNum) {
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
      default:
        console.error("Unexpected message.");
    }
  };

  const onChatMessageReceived = (received) => {
    const parsedMsg = JSON.parse(received.body);
    setChat((chat) => [...chat, parsedMsg]);
  };

  const selectColor = useCallback(
    (color) => {
      stompClient.send(
        `/topic/classroom/${roomId}`,
        {},
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
        {},
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
        {},
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
        {},
        JSON.stringify({
          type: EVENT.TALK,
          seatNum: seatNumRef.current,
          sender: currentUser.id,
          content: message,
          sentTime: getCurrentTime()
        })
      );
    },
    [stompClient, seatNumRef, rowRef]
  );
  
  const disconnect = useCallback(() => {
    if (stompClient !== null) {
      roomSubscription.unsubscribe();
      chatSubscription.unsubscribe();
      stompClient.send(
        `/topic/classroom/${roomId}`,
        {},
        JSON.stringify({
          type: EVENT.EXIT,
          seatNum: seatNumRef.current,
          content: null,
        })
      );
      stompClient.disconnect();
    }
  }, [stompClient, seatNumRef, roomSubscription, chatSubscription]);
 
  const actions = {
    selectColor,
    changeSeat,
    sendMessage,
    selectEmoji,
    disconnect,
  }


  return { seatNumRef, isConnected, actions };
};
