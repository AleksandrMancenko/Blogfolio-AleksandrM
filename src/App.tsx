import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { SignIn, Success, AllPosts, SelectedPost, Search, SignUp } from "./pages";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<AllPosts />} />
        <Route path="/search" element={<Search />} />
        <Route path="/posts/:id" element={<SelectedPost />} />
        
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/success" element={<Success />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
