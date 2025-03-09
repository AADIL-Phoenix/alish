import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  senderName: String,
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

const CommunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  createdBy: {
    type: String,
    required: true
  },
  members: [String],
  admins: [String],
  isPublic: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    enum: ['community', 'group'],
    default: 'community'
  },
  tags: [String],
  imageUrl: String,
  messages: [MessageSchema],
  lastMessage: String,
  lastActivity: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Community || mongoose.model('Community', CommunitySchema); 