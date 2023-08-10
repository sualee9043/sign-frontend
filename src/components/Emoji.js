import styles from "./Emoji.module.css";

export default function Emoji({ emoji, previousEmoji, selectEmoji }) {
  return (
    <span
      className={styles.emoji}
      onClick={() => {
        if (emoji === previousEmoji.current) {
          selectEmoji("");
          previousEmoji.current = "";
        } else {
          selectEmoji(emoji);
          previousEmoji.current = emoji;
        }
      }}
    >
      {emoji}
    </span>
  );
}
