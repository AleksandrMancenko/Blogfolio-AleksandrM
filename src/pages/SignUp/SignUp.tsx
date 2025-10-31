import { useState, FormEvent, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerNewUser, selectAuthLoading, selectAuthError } from '../../features/auth/authSlice';
import styles from './SignUp.module.css';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');

  const [emailErr, setEmailErr] = useState<string | undefined>();
  const [passErr, setPassErr] = useState<string | undefined>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const canSubmit = useMemo(() => {
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const okPass = pass.length >= 6 && pass === pass2;
    return name.trim().length > 0 && okEmail && okPass;
  }, [name, email, pass, pass2]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let ok = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailErr('Invalid email');
      ok = false;
    } else setEmailErr(undefined);

    if (pass.length < 6 || pass !== pass2) {
      setPassErr('Passwords must match (min 6 chars)');
      ok = false;
    } else setPassErr(undefined);

    if (!ok) return;

    try {
      await dispatch(registerNewUser({ email, username: name, password: pass })).unwrap();
      // После успешной регистрации переходим на страницу подтверждения
      navigate('/registration-confirmation');
    } catch (error) {
      // Ошибка уже обработана в Redux
      console.error('Registration failed:', error);
    }
  };

  return (
    <LoadingOverlay isLoading={isLoading} message="Registering...">
      <section className={styles.screen}>
        <div className={styles.wrap}>
          <Link to="/" className={styles.back}>
            Back to home
          </Link>
          <h1 className={styles.title}>Sign Up</h1>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <Input
              id="su-name"
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Your name"
              required
              autoComplete="name"
            />
            <Input
              id="su-email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Your email"
              required
              errorText={emailErr}
              autoComplete="email"
            />
            <Input
              id="su-pass"
              label="Password"
              type="password"
              value={pass}
              onChange={setPass}
              placeholder="Your password"
              required
              autoComplete="new-password"
            />
            <Input
              id="su-pass2"
              label="Confirm password"
              type="password"
              value={pass2}
              onChange={setPass2}
              placeholder="Confirm password"
              required
              errorText={passErr}
              autoComplete="new-password"
            />

            <div className={styles.submit}>
              <Button type="submit" variant="primary" disabled={!canSubmit || isLoading}>
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </div>

            <div className={styles.note}>
              Already have an account? <Link to="/signin">Sign In</Link>
            </div>
          </form>
        </div>
      </section>
    </LoadingOverlay>
  );
}
