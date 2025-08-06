import { useState } from 'react';

const MessageInput = ({ socket, username, role }) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('chatMessage', {
        user: `${username} (${role})`,
        text: message
      });
      setMessage('');
    }
  };

  return (
    <div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;
