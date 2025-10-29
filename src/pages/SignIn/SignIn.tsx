import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import styles from './SignIn.module.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearError, selectAuthLoading, selectAuthError } from '../../features/auth/authSlice';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [emailErr, setEmailErr] = useState<string | undefined>(undefined);

  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  // Получаем путь, с которого пользователь пришел
  const from = (location.state as any)?.from?.pathname || '/';

  // Очищаем ошибки при размонтировании компонента
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!email.trim()) {
      setEmailErr('Required');
      return;
    }
    if (!pass.trim()) {
      return;
    }
    
    setEmailErr(undefined);

    try {
      await dispatch(loginUser({ email, password: pass })).unwrap();
      // После успешного входа перенаправляем на исходную страницу или главную
      navigate(from, { replace: true });
    } catch (error) {
      // Ошибка уже обработана в Redux
      console.error('Login failed:', error);
    }
  };

  return (
    <LoadingOverlay isLoading={isLoading} message="Signing in...">
      <section className={styles.screen}>
        <div className={styles.wrap}>
          <Link to="/" className={styles.back}>
            Back to home
          </Link>
          <h1 className={styles.title}>Sign In</h1>

          <form className={styles.form} onSubmit={onSubmit} noValidate>
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <Input
              id="signin-email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Your email"
              required
              errorText={emailErr}
              disabled={isLoading}
            />

            <Input
              id="signin-pass"
              label="Password"
              type="password"
              value={pass}
              onChange={setPass}
              placeholder="Your password"
              required
              disabled={isLoading}
            />

            {/* Ссылка слева под полями */}
            <div className={styles.row}>
              <a href="#" className={styles.linkMuted}>
                Forgot password?
              </a>
            </div>

            {/* Кнопка на всю ширину */}
            <div className={styles.submit}>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>

            <div className={styles.note}>
              Don't have an account?{' '}
              <Link to="/signup" className={styles.link}>
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </section>
    </LoadingOverlay>
  );
}
