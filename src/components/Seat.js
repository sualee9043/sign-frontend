import React, { useEffect } from "react";
import Circle from "./classroom/Circle.js";

export function Seat({ size, index, color, emoji, mySeat, setSeats }) {
  useEffect(() => {
    if (emoji !== "") {
      const timeout = setTimeout(() => {
        setSeats((oldSeats) => {
          let newSeats = [...oldSeats];
          newSeats[index][1] = "";
          console.log("drawEmoji | seats", newSeats);
          return newSeats;
        });
      }, 60000);

      return () => clearTimeout(timeout);
    }
  }, [emoji]);

  return <Circle size={size} state={color} emoji={emoji} mySeat={mySeat} />;
}

export function EmptySeat({ size, changeSeat }) {
  return <Circle size={size} state="empty" emoji="" handler={changeSeat} />;
}
