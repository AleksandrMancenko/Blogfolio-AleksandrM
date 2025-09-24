// src/App.tsx
import React, { useState } from 'react';
import { UserTitle, Button, Title, Hamburger, OverlayMenu, Input, Textarea, Tabs} from './components/common';
import { PostCardWide, PostCardVertical, PostCardCompact, type Post } from "./components/common"
import './App.css';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pressed, setPressed] = useState({
    primary: false,
    secondary: false,
    secondary2: false,
  });

  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const emailError = mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) ? 'Error text' : '';

  const [text, setText] = useState('');

  const [tab,setTab] = useState('all');
  const items = [
    {value: "all", label: "All"},
    {value: "fav", label: "My favorites"},
    {value: "pop", label: "Popular"}
  ]

  const postWithImg: Post = {
    id: 1,
    image: "https://picsum.photos/seed/space/800/450",
    text: "Astronauts prep for new solar arrays on nearly seven-hour spacewalk.",
    date: "April 20, 2021",
    lesson_num: 38,
    title: "Astronauts prep for new solar arrays",
    author: 1,
  };
  return (
    <div style={{ padding: 20 }}>
      <UserTitle
        userName="Artem Malkin"
        rightSlot={
          <Hamburger pressed={menuOpen} onToggle={() => setMenuOpen((v) => !v)} size={56} />
        }
      />

      <OverlayMenu open={menuOpen} onClose={() => setMenuOpen(false)}>
        <a href="#">Dashboard</a>
        <a href="#">Orders</a>
        <a href="#">Account</a>
      </OverlayMenu>
      <div style={{ height: 16 }} />

      <Title>Sign In</Title>

      <div style={{ height: 16 }} />

      <div style={{ display: 'flex', gap: 16 }}>
        <Button variant="primary" pressed={pressed.primary} onClick={() => setPressed((s) => ({ ...s, primary: !s.primary }))}>Primary</Button>
        <Button variant="secondary" pressed={pressed.secondary} onClick={() => setPressed((s) => ({ ...s, secondary: !s.secondary }))}>Secondary</Button>
        <Button variant="secondary2" pressed={pressed.secondary2} onClick={() => setPressed((s) => ({ ...s, secondary2: !s.secondary2 }))}>Secondary 2</Button>
      </div>

      <div style={{display: 'grid', gap: 12, maxWidth: 420 }}>
        <Input label='Title' placeholder='Placeholder' value={name} onChange={setName} autoFocus />
        <Input type='email' label='Title' placeholder='Email' value={mail} onChange={setMail} errorText={emailError} />
        <Input type='password' label='Title' placeholder='Password' value={password} onChange={setPassword} required  />
        <Input label='Title' value='Text' onChange={() => {}} disabled />
      </div>
      
      <div style={{maxWidth: 720}}>
        <Textarea id="post-text" label="Text" placeholder="Add your text" value={text} onChange={setText} />
      </div>
      
      <div style={{maxWidth: 720}}>
        <Tabs items={items} value={tab} onChange={setTab} />
        <div style={{height: 24}} />
        <div>Current tab: <b>{tab}</b></div>
      </div>

      <div className="container">
        <div style={{height: 24}} />
        <PostCardWide post={postWithImg} />
        <div style={{height: 16}} />
        <div style={{display: "grid", gap: 16, gridTemplateColumns: "repeat(3, 1fr)", alignItems: 'start' }}>
          <PostCardVertical post={postWithImg} />
          <PostCardCompact post={postWithImg} />
        </div>
      </div>
    </div>
  );
}
