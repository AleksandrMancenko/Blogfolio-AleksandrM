import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import styles from './SignIn.module.css';

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [emailErr, setEmailErr] = useState<string | undefined>(undefined);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // простая валидация для примера
    if (!email.trim()) {
      setEmailErr('Required');
      return;
    }
    setEmailErr(undefined);
    navigate('/success');
  };

  return (
    <section className={styles.screen}>
      <div className={styles.wrap}>
        <Link to="/" className={styles.back}>
          Back to home
        </Link>
        <h1 className={styles.title}>Sign In</h1>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <Input
            id="signin-email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Your email"
            required
            errorText={emailErr}
          />

          <Input
            id="signin-pass"
            label="Password"
            type="password"
            value={pass}
            onChange={setPass}
            placeholder="Your password"
            required
          />

          {/* Ссылка слева под полями */}
          <div className={styles.row}>
            <a href="#" className={styles.linkMuted}>
              Forgot password?
            </a>
          </div>

          {/* Кнопка на всю ширину */}
          <div className={styles.submit}>
            <Button type="submit" variant="primary">
              Sign In
            </Button>
          </div>

          <div className={styles.note}>
            Don’t have an account?{' '}
            <Link to="/signup" className={styles.link}>
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
