import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { SignIn, Success, AllPosts, SelectedPost, Search, SignUp, CreatePost } from './pages';
import ProtectedRoute from './components/common/ProtectedRoute';
import AuthInitializer from './components/common/AuthInitializer';
import NotificationContainer from './components/common/NotificationContainer';

export default function App() {
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
          <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/success" element={<Success />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
