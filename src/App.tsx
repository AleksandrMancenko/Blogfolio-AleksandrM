import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import { SignIn, Success, AllPosts, SelectedPost, Search, SignUp, CreatePost } from './pages';
import RegistrationConfirmation from './pages/RegistrationConfirmation';
import Activate from './pages/Activate';
import ActivateSuccess from './pages/ActivateSuccess';
import ProtectedRoute from './components/common/ProtectedRoute';
import AuthInitializer from './components/common/AuthInitializer';
import NotificationContainer from './components/common/NotificationContainer';

export default function App() {
  // Редирект с studapi.teachmeskills.by/activate на localhost:3000/activate
  useEffect(() => {
    if (window.location.href.includes('studapi.teachmeskills.by/activate/')) {
      const url = window.location.href
        .replace('https://studapi.teachmeskills.by', '')
        .replace('//', '/');
      window.location.href = `http://localhost:3000${url}`;
    }
  }, []);

  return (
    <>
      <AuthInitializer />
      <NotificationContainer />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<AllPosts />} />
          <Route path="/favorites" element={<AllPosts />} />
          <Route path="/search" element={<Search />} />
          <Route path="/posts/:id" element={<SelectedPost />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/registration-confirmation" element={<RegistrationConfirmation />} />
          <Route path="/activate/:uid/:token" element={<Activate />} />
          <Route path="/activate-success" element={<ActivateSuccess />} />
          <Route path="/success" element={<Success />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
