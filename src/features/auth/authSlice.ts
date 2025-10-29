import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { signIn, signOut, verifyToken, refreshToken } from '../../api/authService';
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
      dispatch(addNotification({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully signed in',
        duration: 3000,
      }));
      return response;
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        title: 'Sign In Failed',
        message: error.message || 'Invalid email or password',
        duration: 5000,
      }));
      return rejectWithValue(error.message || 'Login failed');
    }
  }
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
  }
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
  }
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
