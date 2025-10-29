import { Link } from 'react-router-dom';
import styles from './ActivateSuccess.module.css';

export default function ActivateSuccess() {
  return (
    <section className={styles.screen}>
      <div className={styles.wrap}>
        <div className={styles.content}>
          <div className={styles.icon}>✓</div>
          <h1 className={styles.title}>Confirmation Success</h1>
          <p className={styles.message}>
            Your email has been successfully confirmed! You can now sign in to your account.
          </p>
        </div>

        <div className={styles.actions}>
          <Link to="/signin" className={styles.button}>
            Sign In
          </Link>
          <Link to="/" className={styles.link}>
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

