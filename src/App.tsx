// src/App.tsx
import React, { useState } from 'react';
import { UserTitle, Button, Title, Hamburger, OverlayMenu } from './components/common';
import './App.css';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pressed, setPressed] = useState({
    primary: false,
    secondary: false,
    secondary2: false,
  });
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
        <Button
          variant="primary"
          pressed={pressed.primary}
          onClick={() => setPressed((s) => ({ ...s, primary: !s.primary }))}
        >
          Primary
        </Button>
        <Button
          variant="secondary"
          pressed={pressed.secondary}
          onClick={() => setPressed((s) => ({ ...s, secondary: !s.secondary }))}
        >
          Secondary
        </Button>
        <Button
          variant="secondary2"
          pressed={pressed.secondary2}
          onClick={() => setPressed((s) => ({ ...s, secondary2: !s.secondary2 }))}
        >
          Secondary 2
        </Button>
      </div>
    </div>
  );
}
