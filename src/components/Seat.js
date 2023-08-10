import React, { useEffect } from "react";
import Circle from "./classroom/Circle.js";

export function Seat({ size, index, color, emoji, mySeat, setSeats }) {
  return <Circle size={size} state={color} emoji={emoji} mySeat={mySeat} />;
}

export function EmptySeat({ size, changeSeat }) {
  return <Circle size={size} state="empty" emoji="" handler={changeSeat} />;
}
