import { connectToDatabase } from '../db/mongodb';
import Community from '../models/Community';
import User from '../models/User';
import mongoose from 'mongoose';

// Create a new community/group
export const createCommunityOrGroup = async (userId, groupData) => {
  try {
    await connectToDatabase();
    
    // Create a new community document
    const newCommunity = new Community({
      name: groupData.name,
      description: groupData.description || '',
      createdBy: userId,
      members: [userId],
      admins: [userId],
      isPublic: groupData.type === 'community' ? (groupData.isPublic || true) : false,
      tags: groupData.type === 'community' ? (groupData.tags || []) : [],
      imageUrl: groupData.imageUrl || null,
      type: groupData.type || 'community',
      lastActivity: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedCommunity = await newCommunity.save();
    
    // Add this community to user's communities/groups
    const user = await User.findOne({ uid: userId });
    if (user) {
      if (groupData.type === 'community') {
        if (!user.communities) user.communities = [];
        user.communities.push(savedCommunity._id.toString());
      } else {
        if (!user.groups) user.groups = [];
        user.groups.push(savedCommunity._id.toString());
      }
      await user.save();
    }
    
    return savedCommunity._id.toString();
  } catch (error) {
    console.error('Error creating community/group:', error);
    throw error;
  }
};

// Get community details
export const getCommunityById = async (communityId) => {
  try {
    await connectToDatabase();
    
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
    
    return {
      id: community._id.toString(),
      name: community.name,
      description: community.description,
      createdBy: community.createdBy,
      members: community.members,
      admins: community.admins,
      isPublic: community.isPublic,
      tags: community.tags,
      imageUrl: community.imageUrl,
      type: community.type || 'community',
      lastActivity: community.lastActivity,
      createdAt: community.createdAt,
      updatedAt: community.updatedAt
    };
  } catch (error) {
    console.error('Error fetching community:', error);
    throw error;
  }
};

// Join a community or group
export const joinCommunityOrGroup = async (userId, communityId, type = 'community') => {
  try {
    await connectToDatabase();
    
    // Add user to community members
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
    
    if (!community.members.includes(userId)) {
      community.members.push(userId);
      community.updatedAt = new Date();
      await community.save();
    }
    
    // Add community to user's communities/groups
    const user = await User.findOne({ uid: userId });
    if (user) {
      const fieldToUpdate = type === 'community' ? 'communities' : 'groups';
      if (!user[fieldToUpdate]) user[fieldToUpdate] = [];
      
      if (!user[fieldToUpdate].includes(communityId)) {
        user[fieldToUpdate].push(communityId);
        await user.save();
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error joining community/group:', error);
    throw error;
  }
};

// Leave a community or group
export const leaveCommunity = async (userId, communityId) => {
  try {
    await connectToDatabase();
    
    // Remove user from community members
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
    
    community.members = community.members.filter(id => id !== userId);
    
    // If user is an admin, remove from admins as well
    if (community.admins.includes(userId)) {
      community.admins = community.admins.filter(id => id !== userId);
    }
    
    community.updatedAt = new Date();
    await community.save();
    
    // Remove community from user's communities/groups
    const user = await User.findOne({ uid: userId });
    if (user) {
      const type = community.type || 'community';
      const fieldToUpdate = type === 'community' ? 'communities' : 'groups';
      
      if (user[fieldToUpdate]) {
        user[fieldToUpdate] = user[fieldToUpdate].filter(id => id !== communityId);
        await user.save();
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error leaving community:', error);
    throw error;
  }
};

// Get public communities
export const getPublicCommunities = async (limit = 20) => {
  try {
    await connectToDatabase();
    
    const communities = await Community.find({ 
      isPublic: true,
      type: 'community'
    })
    .sort({ createdAt: -1 })
    .limit(limit);
    
    return communities.map(community => ({
      id: community._id.toString(),
      name: community.name,
      description: community.description,
      members: community.members,
      tags: community.tags,
      imageUrl: community.imageUrl,
      lastActivity: community.lastActivity,
      createdAt: community.createdAt
    }));
  } catch (error) {
    console.error('Error fetching public communities:', error);
    throw error;
  }
};

// Get user's communities
export const getUserCommunities = async (userId) => {
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ uid: userId });
    if (!user || !user.communities || user.communities.length === 0) {
      return [];
    }
    
    const communities = await Community.find({
      _id: { $in: user.communities },
      type: 'community'
    });
    
    return communities.map(community => ({
      id: community._id.toString(),
      name: community.name,
      description: community.description,
      members: community.members,
      tags: community.tags,
      imageUrl: community.imageUrl,
      lastActivity: community.lastActivity,
      createdAt: community.createdAt
    }));
  } catch (error) {
    console.error('Error fetching user communities:', error);
    throw error;
  }
};

// Get user's group chats
export const getPreviousGroupChats = async (userId) => {
  try {
    await connectToDatabase();
    
    const user = await User.findOne({ uid: userId });
    if (!user || !user.groups || user.groups.length === 0) {
      return [];
    }
    
    const groups = await Community.find({
      _id: { $in: user.groups },
      type: 'group'
    }).sort({ lastActivity: -1 });
    
    return groups.map(group => ({
      id: group._id.toString(),
      name: group.name,
      description: group.description,
      members: group.members,
      imageUrl: group.imageUrl,
      lastMessage: group.lastMessage || null,
      lastMessageTime: group.lastActivity,
      unreadCount: 0 // You'll need to implement unread count tracking
    }));
  } catch (error) {
    console.error('Error fetching group chats:', error);
    throw error;
  }
};

// Search communities
export const searchCommunities = async (searchTerm) => {
  try {
    await connectToDatabase();
    
    const communities = await Community.find({
      $and: [
        { isPublic: true },
        { type: 'community' },
        {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } }
          ]
        }
      ]
    }).limit(20);
    
    return communities.map(community => ({
      id: community._id.toString(),
      name: community.name,
      description: community.description,
      members: community.members,
      tags: community.tags,
      imageUrl: community.imageUrl,
      lastActivity: community.lastActivity,
      createdAt: community.createdAt
    }));
  } catch (error) {
    console.error('Error searching communities:', error);
    throw error;
  }
};

// Create a Message model for community messages
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

// Post a message to a community
export const postCommunityMessage = async (communityId, userId, message) => {
  try {
    await connectToDatabase();
    
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
    
    // Check if user is a member
    if (!community.members.includes(userId)) {
      throw new Error('User is not a member of this community');
    }
    
    // Get user name if available
    let senderName = 'User';
    const user = await User.findOne({ uid: userId });
    if (user && user.name) {
      senderName = user.name;
    }
    
    // Initialize messages array if it doesn't exist
    if (!community.messages) {
      community.messages = [];
    }
    
    // Add new message
    const newMessage = {
      senderId: userId,
      senderName,
      text: message.text,
      timestamp: new Date(),
      attachments: message.attachments || []
    };
    
    community.messages.push(newMessage);
    community.lastMessage = message.text;
    community.lastActivity = new Date();
    community.updatedAt = new Date();
    
    await community.save();
    
    return newMessage;
  } catch (error) {
    console.error('Error posting community message:', error);
    throw error;
  }
};

// Get messages for a community
export const getCommunityMessages = async (communityId, limit = 50) => {
  try {
    await connectToDatabase();
    
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error('Community not found');
    }
    
    if (!community.messages) {
      return [];
    }
    
    // Get the most recent messages up to the limit
    const messages = community.messages
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
    console.error('Error fetching community messages:', error);
    throw error;
  }
};

