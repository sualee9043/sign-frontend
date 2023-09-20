export const EVENT = {
  ENTER: "ENTER",
  EXIT: "EXIT",
  COLOR: "COLOR",
  DRAW_EMOJI: "DRAW_EMOJI",
  TALK: "TALK",
  CHANGE_SEAT: "CHANGE_SEAT",
  CHECK: "CHECK"
};

export const colors = ["blue-1", "blue-2", "blue-3", "blue-4", "blue-5"];
export const emojis = ["😢", "🤔", "😯", "🙂", "😀"];

export const columnNum = 5;

export const getCurrentTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const ampm = currentHour < 12 ? '오전' : '오후';
  let formattedHour = currentHour % 12;
  formattedHour = formattedHour === 0 ? 12 : formattedHour;
  const formattedTime = `${ampm} ${formattedHour < 10 ? '0' : ''}${formattedHour}:${currentMinute < 10 ? '0' : ''}${currentMinute}`;
  return formattedTime;
}
