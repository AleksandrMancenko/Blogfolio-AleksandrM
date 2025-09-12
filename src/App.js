// import logo from './logo.svg';
import React, { useState} from 'react';
import Button from './components/Button/Button';
import './App.css';

function App() {
  const [pDisabled, setPDisabled] = useState(false);
  const [sDisabled, setSDisabled] = useState(false);
  const [s2Disabled, setS2Disabled] = useState(false);
  return (
    <div style={{display: "grid", gap: "16px", padding: "20px" }}>
      <div style={{display: "flex", gap: "12px" }}>
        <Button 
          variant='primary'
          disabled={pDisabled}
          onClick={() => setPDisabled(true)}
          >
          Primary
        </Button>
                <Button 
          variant='secondary'
          disabled={sDisabled}
          onClick={() => setSDisabled(true)}
          >
          Secondary
        </Button>
        <Button 
          variant='secondary2'
          disabled={s2Disabled}
          onClick={() => setS2Disabled(true)}
          >
          Secondary2
        </Button>
      </div>
    </div>
  );
}

export default App;
