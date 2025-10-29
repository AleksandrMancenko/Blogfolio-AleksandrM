import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { verifyUserToken, selectIsAuthenticated } from '../../features/auth/authSlice';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    // Проверяем токен при загрузке приложения
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthenticated) {
      dispatch(verifyUserToken());
    }
  }, [dispatch, isAuthenticated]);

  return null; // Этот компонент не рендерит ничего
}
