import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { over } from "stompjs";
import SockJS from "sockjs-client";

import { EVENT } from "./classroomUtils";


export const useStompConnection = (roomId, columnNum, currentUser, setSeats, setChat) => {
  const [stompClient, setStompClient] = useState(null);
  const [roomSubscription, setRoomSubscription] = useState(null);
  const [chatSubscription, setChatSubsription] = useState(null);

  const navigate = useNavigate();
  const seatNumRef = useRef();
  const rowRef = useRef();

  const onChatMessageReceived = (received) => {
    const parsedMsg = JSON.parse(received.body);
    setChat((chat) => {
      return [...chat, parsedMsg];
    });
  };

  useEffect(() => {
    const Sock = new SockJS(process.env.REACT_APP_WEB_SOCKET_URL);
    const client = over(Sock);
    // client.debug = () => {};
    setStompClient(client);
  }, [roomId, currentUser]);

  useEffect(() => {
    if (stompClient) {
      const onConnected = () => {
        setRoomSubscription(stompClient.subscribe(`/topic/classroom/${roomId}`, onMessageReceived));
        const queueSub = stompClient.subscribe(
          `/queue/temp/classroom/${roomId}/user/${currentUser.email}`,
          (received) => {
            const classroomInfo = JSON.parse(received.body);
            seatNumRef.current = classroomInfo.seatNum;
            rowRef.current = parseInt(classroomInfo.seatNum / columnNum) + 1;
            setChatSubsription((_) => {
              const subscription = stompClient.subscribe(
                `/topic/classroom/${roomId}/chat/${rowRef.current}`,
                onChatMessageReceived
              );
              stompClient.send(
                `/app/classroom/${roomId}/chat/${rowRef.current}`,
                {},
                JSON.stringify({
                  type: EVENT.ENTER,
                  seatNum: seatNumRef.current,
                  row: rowRef.current,
                  content: null,
                })
              );
              return subscription;
            });
            setSeats((oldSeats) => {
              let newSeats = [...oldSeats];
              for (let seatNum in classroomInfo.classRoomStates) {
                newSeats[seatNum - 1] = classroomInfo.classRoomStates[seatNum];
              }
              return newSeats;
            });

            queueSub.unsubscribe();
          }
        );

        stompClient.send(
          `/app/classroomInfo/${roomId}`,
          {},
          JSON.stringify({
            sender: currentUser.email,
          })
        );
      };

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
              seatNumRef.current = parseInt(parsedMsg.message);
              rowRef.current = parseInt(seatNumRef.current / columnNum) + 1;
            }
            break;
          default:
            console.error("Unexpected message.");
        }
      };

      const color = (seatNum, receivedColor) => {
        setSeats((oldSeats) => {
          let newSeats = [...oldSeats];
          newSeats[seatNum - 1][0] = receivedColor;
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

      stompClient.connect(
        { roomId: roomId, "Access-Token": axios.defaults.headers.common["Access-Token"] },
        onConnected,
        (error) => {
          console.error(error);
          navigate("/home");
        }
      );
    }
  }, [stompClient]);

  const selectColor = useCallback(
    (color) => {
      stompClient.send(
        `/app/classroom/${roomId}`,
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
        `/app/classroom/${roomId}`,
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
      const prevSeatNum = seatNumRef.current;
      const newRow = parseInt(seatNum / columnNum) + 1;
      stompClient.send(
        `/app/classroom/${roomId}`,
        {},
        JSON.stringify({
          type: EVENT.CHANGE_SEAT,
          roomId: roomId,
          message: seatNum + 1,
          seatNum: seatNumRef.current,
        })
      );
      if (newRow !== rowRef.current) {
        stompClient.send(
          `/app/classroom/${roomId}/chat/${rowRef.current}`,
          {},
          JSON.stringify({
            type: EVENT.EXIT,
            seatNum: seatNumRef.current,
            content: null,
          })
        );
        setChat([]);
        chatSubscription.unsubscribe();
        rowRef.current = newRow;
        setChatSubsription((_) => {
          const subscription = stompClient.subscribe(
            `/topic/classroom/${roomId}/chat/${rowRef.current}`,
            onChatMessageReceived
          );
          stompClient.send(
            `/app/classroom/${roomId}/chat/${rowRef.current}`,
            {},
            JSON.stringify({
              type: EVENT.ENTER,
              seatNum: seatNum,
              row: rowRef.current,
              content: null,
            })
          );
          return subscription;
        });
      } else {
        setChat((chat) => {
          chat.forEach((message) => {
            if (message.seatNum === prevSeatNum) {
              message.seatNum = seatNum;
            }
          });
          return chat;
        });
      }
    },
    [stompClient, seatNumRef, chatSubscription]
  );

  const sendMessage = useCallback(
    (message) => {
      stompClient.send(
        `/app/classroom/${roomId}/chat/${rowRef.current}`,
        {},
        JSON.stringify({
          type: EVENT.TALK,
          seatNum: seatNumRef.current,
          content: message,
        })
      );
    },
    [stompClient, seatNumRef]
  );

  const disconnect = useCallback(() => {
    if (stompClient !== null) {
      stompClient.disconnect();
    }
  }, [stompClient]);

  return { seatNumRef, selectColor, changeSeat, sendMessage, selectEmoji, disconnect };
};
