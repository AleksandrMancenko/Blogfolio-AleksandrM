import { useEffect } from 'react';
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
        // Редирект на страницу успешной активации после небольшой задержки
        setTimeout(() => {
          navigate('/activate-success');
        }, 2000);
      } catch (error) {
        console.error('Activation failed:', error);
        // Ошибка обрабатывается в Redux
        // Через 3 секунды показываем сообщение об ошибке
        setTimeout(() => {
          alert('Activation failed. Please check your link or try again.');
        }, 3000);
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

  return (
    <LoadingOverlay isLoading={true} message="Activating your account...">
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

