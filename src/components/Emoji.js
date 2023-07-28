import styles from "./Emoji.module.css";

export default function Emoji({ emoji, selectEmoji }) {
  return (
    <span
      className={styles.emoji}
      onClick={() => {
        selectEmoji(emoji);
      }}
    >
      {emoji}
    </span>
  );
}
