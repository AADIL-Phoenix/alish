import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  attachments: [String]
});

const ChatSchema = new mongoose.Schema({
  participants: {
    type: [String],
    required: true
  },
  participantNames: {
    type: Map,
    of: String
  },
  type: {
    type: String,
    enum: ['personal', 'group'],
    default: 'personal'
  },
  name: String, // For group chats
  messages: [MessageSchema],
  lastMessage: String,
  lastMessageTime: Date,
  unreadCount: {
    type: Map,
    of: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema); 