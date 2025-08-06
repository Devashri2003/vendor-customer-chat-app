/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App*/

/*import FeedbackForm from './components/feedbackForm';
import FeedbackList from './components/FeedbackList';

function App() {
  return (
    <>
      <h1>Feedback Box</h1>
      <FeedbackForm />
      <FeedbackList />
    </>
  );
}

export default App;*/
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';

const socket = io('http://localhost:5000');

const App = () => {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('chatMessage');
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/messages')
      .then(res => res.json())
      .then(data => setMessages(data));
  }, []);

  const joinChat = () => {
    if (username && role) {
      socket.emit('joinRoom', { username, role });
      setJoined(true);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {!joined ? (
        <div>
          <input placeholder="Name" onChange={(e) => setUsername(e.target.value)} />
          <select onChange={(e) => setRole(e.target.value)}>
            <option value="">Role</option>
            <option value="Vendor">Vendor</option>
            <option value="Customer">Customer</option>
          </select>
          <button onClick={joinChat}>Join</button>
        </div>
      ) : (
        <>
          <ChatWindow messages={messages} currentUser={username} />
          <MessageInput socket={socket} username={username} role={role} />
        </>
      )}
    </div>
  );
};

export default App;

