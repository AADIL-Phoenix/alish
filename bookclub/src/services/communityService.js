import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  query, 
  //where, 
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Create a new community
export const createCommunity = async (userId, communityData) => {
  try {
    const communityRef = doc(collection(db, 'communities'));
    const communityId = communityRef.id;
    
    await setDoc(communityRef, {
      id: communityId,
      name: communityData.name,
      description: communityData.description,
      createdBy: userId,
      members: [userId],
      admins: [userId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isPublic: communityData.isPublic || true,
      tags: communityData.tags || [],
      imageUrl: communityData.imageUrl || null
    });
    
    // Add this community to user's communities list
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      communities: arrayUnion(communityId)
    });
    
    return communityId;
  } catch (error) {
    console.error('Error creating community:', error);
    throw error;
  }
};

// Get community details
export const getCommunityById = async (communityId) => {
  try {
    const communityRef = doc(db, 'communities', communityId);
    const communitySnap = await getDoc(communityRef);
    
    if (communitySnap.exists()) {
      return { id: communitySnap.id, ...communitySnap.data() };
    } else {
      throw new Error('Community not found');
    }
  } catch (error) {
    console.error('Error fetching community:', error);
    throw error;
  }
};

// Join a community
export const joinCommunity = async (userId, communityId) => {
  try {
    // Add user to community members
    const communityRef = doc(db, 'communities', communityId);
    await updateDoc(communityRef, {
      members: arrayUnion(userId),
      updatedAt: serverTimestamp()
    });
    
    // Add community to user's communities
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      communities: arrayUnion(communityId)
    });
    
    return true;
  } catch (error) {
    console.error('Error joining community:', error);
    throw error;
  }
};

// Leave a community
export const leaveCommunity = async (userId, communityId) => {
  try {
    const communityRef = doc(db, 'communities', communityId);
    const communitySnap = await getDoc(communityRef);
    
    if (communitySnap.exists()) {
      const communityData = communitySnap.data();
      const updatedMembers = communityData.members.filter(id => id !== userId);
      
      await updateDoc(communityRef, {
        members: updatedMembers,
        updatedAt: serverTimestamp()
      });
      
      // If user is an admin, remove from admins as well
      if (communityData.admins.includes(userId)) {
        const updatedAdmins = communityData.admins.filter(id => id !== userId);
        await updateDoc(communityRef, {
          admins: updatedAdmins
        });
      }
      
      // Remove community from user's communities
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const updatedCommunities = userData.communities ? 
          userData.communities.filter(id => id !== communityId) : [];
        
        await updateDoc(userRef, {
          communities: updatedCommunities
        });
      }
      
      return true;
    } else {
      throw new Error('Community not found');
    }
  } catch (error) {
    console.error('Error leaving community:', error);
    throw error;
  }
};

// Post a message to a community
export const postCommunityMessage = async (communityId, userId, message) => {
  try {
    const messageRef = doc(collection(db, 'communities', communityId, 'messages'));
    
    await setDoc(messageRef, {
      id: messageRef.id,
      text: message.text,
      senderId: userId,
      timestamp: serverTimestamp(),
      attachments: message.attachments || []
    });
    
    // Update the community's lastActivity
    const communityRef = doc(db, 'communities', communityId);
    await updateDoc(communityRef, {
      lastActivity: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return messageRef.id;
  } catch (error) {
    console.error('Error posting community message:', error);
    throw error;
  }
};

// Get messages for a community
export const getCommunityMessages = async (communityId, limitCount = 50) => {
  try {
    const messagesQuery = query(
      collection(db, 'communities', communityId, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(messagesQuery);
    const messages = [];
    
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    return messages.reverse(); // Return in chronological order
  } catch (error) {
    console.error('Error fetching community messages:', error);
    throw error;
  }
};
