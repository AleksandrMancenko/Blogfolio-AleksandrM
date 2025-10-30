import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  signIn,
  signOut,
  verifyToken,
  refreshToken,
  registerUser,
  activateUser,
  getUserProfile,
} from '../../api/authService';
import { addNotification } from '../notifications/notificationSlice';

export type User = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
};

// Async thunk для входа в систему
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await signIn(credentials);
      dispatch(
        addNotification({
          type: 'success',
          title: 'Welcome back!',
          message: 'You have successfully signed in',
          duration: 3000,
        }),
      );
      // Загружаем профиль пользователя после успешного входа
      try {
        await dispatch(fetchUserProfile()).unwrap();
      } catch {
        // Если загрузка профиля не удалась, не прерываем процесс входа
        console.warn('Failed to fetch user profile after login');
      }
      return response;
    } catch (error: any) {
      dispatch(
        addNotification({
          type: 'error',
          title: 'Sign In Failed',
          message: error.message || 'Invalid email or password',
          duration: 5000,
        }),
      );
      return rejectWithValue(error.message || 'Login failed');
    }
  },
);

// Async thunk для проверки токена
export const verifyUserToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }
      await verifyToken(token);
      return token;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token verification failed');
    }
  },
);

// Async thunk для обновления токена
export const refreshUserToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const newToken = await refreshToken();
      return newToken;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  },
);

// Async thunk для регистрации пользователя
export const registerNewUser = createAsyncThunk(
  'auth/register',
  async (
    data: { email: string; username: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const response = await registerUser(data);
      dispatch(
        addNotification({
          type: 'success',
          title: 'Registration Successful',
          message: 'Please check your email to confirm your account.',
          duration: 5000,
        }),
      );
      return response;
    } catch (error: any) {
      let errorMessage = 'Registration failed';
      try {
        // Пытаемся распарсить JSON ошибки
        const errorData =
          typeof error.message === 'string' && error.message.startsWith('{')
            ? JSON.parse(error.message)
            : typeof error.message === 'string' && error.message.includes('{')
              ? JSON.parse(error.message)
              : error.message;

        if (typeof errorData === 'object' && errorData !== null) {
          // Форматируем ошибки валидации
          const errors = Object.entries(errorData).map(([field, messages]: [string, any]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(', ')}`;
            }
            return `${field}: ${messages}`;
          });
          errorMessage = errors.join('; ');
        } else {
          errorMessage = String(errorData);
        }
      } catch {
        errorMessage = error.message || 'Registration failed';
      }

      dispatch(
        addNotification({
          type: 'error',
          title: 'Registration Failed',
          message: errorMessage,
          duration: 5000,
        }),
      );
      return rejectWithValue(errorMessage);
    }
  },
);

// Async thunk для активации пользователя
export const activateAccount = createAsyncThunk(
  'auth/activate',
  async (data: { uid: string; token: string }, { dispatch, rejectWithValue }) => {
    try {
      const response = await activateUser(data.uid, data.token);
      dispatch(
        addNotification({
          type: 'success',
          title: 'Account Activated',
          message: 'Your account has been successfully activated!',
          duration: 5000,
        }),
      );
      return response;
    } catch (error: any) {
      dispatch(
        addNotification({
          type: 'error',
          title: 'Activation Failed',
          message: error.message || 'Invalid activation link',
          duration: 5000,
        }),
      );
      return rejectWithValue(error.message || 'Activation failed');
    }
  },
);

// Async thunk для получения профиля пользователя
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state, action: PayloadAction<{ showNotification?: boolean }>) => {
      signOut();
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;

      // Показываем уведомление о выходе, если не указано иное
      if (action.payload?.showNotification !== false) {
        // Уведомление будет показано в компоненте, который вызывает logout
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Verify token cases
      .addCase(verifyUserToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyUserToken.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
      })
      .addCase(verifyUserToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload as string;
      })
      // Refresh token cases
      .addCase(refreshUserToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload as string;
      })
      // Register cases
      .addCase(registerNewUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerNewUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerNewUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Activate cases
      .addCase(activateAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(activateAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;

export default authSlice.reducer;
