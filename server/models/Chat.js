import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: String,
  text: String,
  time: String
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;