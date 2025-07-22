import styles from "./Loader.module.css";

interface LoaderProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "white" | "gray";
  text?: string;
}

export default function Loader({
  size = "medium",
  color = "primary",
  text,
}: LoaderProps) {
  return (
    <div className={styles.loaderContainer}>
      <div className={`${styles.spinner} ${styles[size]} ${styles[color]}`}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
      {text && <span className={styles.text}>{text}</span>}
    </div>
  );
}
