import { Link } from 'react-router-dom';
import styles from './RegistrationConfirmation.module.css';

export default function RegistrationConfirmation() {
  return (
    <section className={styles.screen}>
      <div className={styles.wrap}>
        <Link to="/" className={styles.back}>
          Back to home
        </Link>

        <div className={styles.content}>
          <h1 className={styles.title}>Registration Confirmation</h1>
          <p className={styles.message}>
            We sent a confirmation email to your email address. Please check your inbox and follow
            the link to confirm your registration.
          </p>
          <p className={styles.note}>
            Didn't receive the email? Check your spam folder or try again.
          </p>
        </div>

        <div className={styles.actions}>
          <Link to="/signin" className={styles.link}>
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
