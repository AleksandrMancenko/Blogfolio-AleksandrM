// src/App.tsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { SignIn, Success, AllPosts, SelectedPost } from "./pages";

export default function App() {
  return (
 <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<AllPosts />} />
        <Route path="/posts/:id" element={<SelectedPost />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/success" element={<Success />} />
      </Route>

      <Route path="*" element={<div style={{ padding: 24 }}>Not found</div>} />
    </Routes>
    );
}
