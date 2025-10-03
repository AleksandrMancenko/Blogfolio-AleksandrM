import { Link } from "react-router-dom";
import styles from "./Success.module.css";

export default function Success() {
  return (
    <section className={styles.screen}>
      <div className={styles.wrap}>
        <Link to="/" className={styles.back}>Back to home</Link>
        <h1 className={styles.title}>Success</h1>

        <div className={styles.panel}>
          <p className={styles.noteTitle}>Email confirmed.</p>
          <p className={styles.noteText}>Your registration is now completed</p>

          <div className={styles.actions}>
            <Link to="/" className={styles.btn}>Go to home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
