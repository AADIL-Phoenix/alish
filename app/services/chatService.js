import { connectToDatabase } from '../db/mongodb';
import User from '../models/User';
import Chat from '../models/Chat';

// Search users by name or email
export const searchUsers = async (searchTerm) => {
  try {
    await connectToDatabase();
    
    const users = await User.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]
    }).limit(20);
    
    return users.map(user => ({
      id: user.uid,
      name: user.name || 'User',
      email: user.email,
      photoURL: user.photoURL || null
    }));
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Get previous personal chats for a user
export const getPreviousPersonalChats = async (userId) => {
  try {
    await connectToDatabase();
    
    const chats = await Chat.find({
      participants: userId,
      type: 'personal'
    }).sort({ lastMessageTime: -1 });
    
    return await Promise.all(chats.map(async (chat) => {
      // Find the other participant
      const otherUserId = chat.participants.find(id => id !== userId);
      
      // Get other user's name
      let otherUserName = 'User';
      if (otherUserId) {
        const otherUser = await User.findOne({ uid: otherUserId });
        if (otherUser) {
          otherUserName = otherUser.name || otherUser.email || 'User';
        }
      }
      
      return {
        id: chat._id.toString(),
        type: 'personal',
        otherUser: otherUserId,
        otherUserName,
        lastMessage: chat.lastMessage,
        lastMessageTime: chat.lastMessageTime,
        unreadCount: chat.unreadCount?.[userId] || 0
      };
    }));
  } catch (error) {
    console.error('Error fetching personal chats:', error);
    throw error;
  }
};

// Create or get a personal chat between two users
export const createOrGetPersonalChat = async (userId1, userId2) => {
  try {
    await connectToDatabase();
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      type: 'personal',
      participants: { $all: [userId1, userId2], $size: 2 }
    });
    
    if (!chat) {
      // Get user names
      const user1 = await User.findOne({ uid: userId1 });
      const user2 = await User.findOne({ uid: userId2 });
      
      const participantNames = {};
      if (user1) participantNames[userId1] = user1.name || user1.email || 'User';
      if (user2) participantNames[userId2] = user2.name || user2.email || 'User';
      
      // Create new chat
      chat = new Chat({
        type: 'personal',
        participants: [userId1, userId2],
        participantNames,
        messages: [],
        lastMessage: null,
        lastMessageTime: new Date(),
        unreadCount: { [userId1]: 0, [userId2]: 0 },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      await chat.save();
    }
    
    return {
      id: chat._id.toString(),
      participants: chat.participants,
      messages: chat.messages || []
    };
  } catch (error) {
    console.error('Error creating/getting personal chat:', error);
    throw error;
  }
};

// Send a message in a personal chat
export const sendPersonalChatMessage = async (chatId, senderId, message) => {
  try {
    await connectToDatabase();
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }
    
    // Check if sender is a participant
    if (!chat.participants.includes(senderId)) {
      throw new Error('User is not a participant in this chat');
    }
    
    // Get sender name
    let senderName = 'User';
    const sender = await User.findOne({ uid: senderId });
    if (sender) {
      senderName = sender.name || sender.email || 'User';
    }
    
    // Create new message
    const newMessage = {
      senderId,
      senderName,
      text: message.text,
      timestamp: new Date(),
      attachments: message.attachments || []
    };
    
    // Add message to chat
    if (!chat.messages) chat.messages = [];
    chat.messages.push(newMessage);
    
    // Update last message info
    chat.lastMessage = message.text;
    chat.lastMessageTime = new Date();
    chat.updatedAt = new Date();
    
    // Increment unread count for other participants
    chat.participants.forEach(participantId => {
      if (participantId !== senderId) {
        if (!chat.unreadCount) chat.unreadCount = {};
        chat.unreadCount[participantId] = (chat.unreadCount[participantId] || 0) + 1;
      }
    });
    
    await chat.save();
    
    return {
      id: newMessage._id.toString(),
      ...newMessage
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Get messages for a personal chat
export const getPersonalChatMessages = async (chatId, limit = 50) => {
  try {
    await connectToDatabase();
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }
    
    if (!chat.messages) {
      return [];
    }
    
    // Get the most recent messages up to the limit
    const messages = chat.messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
      .reverse();
    
    return messages.map(msg => ({
      id: msg._id.toString(),
      senderId: msg.senderId,
      senderName: msg.senderName,
      text: msg.text,
      timestamp: msg.timestamp,
      attachments: msg.attachments
    }));
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (chatId, userId) => {
  try {
    await connectToDatabase();
    
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new Error('Chat not found');
    }
    
    // Check if user is a participant
    if (!chat.participants.includes(userId)) {
      throw new Error('User is not a participant in this chat');
    }
    
    // Reset unread count for this user
    if (chat.unreadCount && chat.unreadCount[userId]) {
      chat.unreadCount[userId] = 0;
      await chat.save();
    }
    
    return true;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
}; 