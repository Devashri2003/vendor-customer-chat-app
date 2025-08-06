const ChatWindow = ({ messages, currentUser }) => {
  return (
    <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'scroll', marginBottom: 10 }}>
      {messages.map((msg, i) => (
        <div key={i} style={{ padding: 5, backgroundColor: msg.user === currentUser ? '#d1f0d1' : '#f2f2f2' }}>
          <strong>{msg.user}:</strong> {msg.text} <span style={{ float: 'right' }}>{msg.time}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;