import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { useAppDispatch } from '../../store/hooks';
import { activateAccount } from '../../features/auth/authSlice';
import styles from './Activate.module.css';

export default function Activate() {
  const params = useParams<{ uid: string; token: string }>();
  const { uid, token } = params;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!uid || !token) {
      console.log('Missing uid or token:', { uid, token });
      return;
    }

    console.log('Activating account with:', { uid, token });

    const activate = async () => {
      try {
        await dispatch(activateAccount({ uid, token })).unwrap();
        console.log('Activation successful, redirecting...');
        setIsLoading(false);
        // Редирект на страницу успешной активации после небольшой задержки
        setTimeout(() => {
          navigate('/activate-success');
        }, 2000);
      } catch (error: any) {
        console.error('Activation failed:', error);
        setIsLoading(false);
        // Извлекаем сообщение об ошибке
        let errorMessage = 'Activation failed. Please check your link or try again.';
        try {
          if (error.message && typeof error.message === 'string' && error.message.includes('Stale token')) {
            errorMessage = 'This activation link has expired. Please register again.';
          } else if (error.payload) {
            const payload = error.payload;
            if (typeof payload === 'string' && payload.includes('Stale token')) {
              errorMessage = 'This activation link has expired. Please register again.';
            } else {
              errorMessage = payload;
            }
          }
        } catch {}
        setError(errorMessage);
      }
    };

    activate();
  }, [uid, token, dispatch, navigate]);

  if (!uid || !token) {
    return (
      <section className={styles.screen}>
        <div className={styles.wrap}>
          <div className={styles.error}>
            <h1 className={styles.title}>Invalid Activation Link</h1>
            <p className={styles.message}>
              The activation link is invalid or incomplete.
            </p>
            <Link to="/" className={styles.link}>
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.screen}>
        <div className={styles.wrap}>
          <div className={styles.error}>
            <h1 className={styles.title}>Activation Failed</h1>
            <p className={styles.message}>
              {error}
            </p>
            <div className={styles.actions}>
              <Link to="/signup" className={styles.link}>
                Register Again
              </Link>
              <Link to="/" className={styles.link}>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <LoadingOverlay isLoading={isLoading} message="Activating your account...">
      <section className={styles.screen}>
        <div className={styles.wrap}>
          <div className={styles.content}>
            <h1 className={styles.title}>Activating Account</h1>
            <p className={styles.message}>
              Please wait while we activate your account...
            </p>
          </div>
        </div>
      </section>
    </LoadingOverlay>
  );
}

