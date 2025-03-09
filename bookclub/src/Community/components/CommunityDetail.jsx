import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context';
import { 
  getCommunityById, 
  getCommunityMessages, 
  postCommunityMessage,
  joinCommunity,
  leaveCommunity
} from '../../services/communityService';
import { formatDistanceToNow } from 'date-fns';

const CommunityDetail = () => {
  const router = useRouter();
  const { communityId } = router.query;
  const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isMember, setIsMember] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (communityId && user) {
      fetchCommunityData();
    }
  }, [communityId, user]);

  const fetchCommunityData = async () => {
    setLoading(true);
    try {
      const communityData = await getCommunityById(communityId);
      setCommunity(communityData);
      
      // Check if user is a member
      setIsMember(communityData.members.includes(user.uid));
      
      // Fetch messages if user is a member
      if (communityData.members.includes(user.uid)) {
        const communityMessages = await getCommunityMessages(communityId);
        setMessages(communityMessages);
      }
    } catch (error) {
      console.error('Error fetching community data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !isMember) return;
    
    try {
      await postCommunityMessage(communityId, user.uid, { text: newMessage });
      setNewMessage('');
      
      // Refresh messages
      const updatedMessages = await getCommunityMessages(communityId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleJoinCommunity = async () => {
    try {
      await joinCommunity(user.uid, communityId);
      setIsMember(true);
      fetchCommunityData(); // Refresh data
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeaveCommunity = async () => {
    try {
      await leaveCommunity(user.uid, communityId);
      setIsMember(false);
      setMessages([]); // Clear messages
      fetchCommunityData(); // Refresh data
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading community...</p>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Community not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          {community.imageUrl ? (
            <img
              src={community.imageUrl}
              alt={community.name}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold">
                {community.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold">{community.name}</h1>
            <p className="text-sm text-gray-500">
              {community.members.length} members
            </p>
          </div>
        </div>
        
        {isMember ? (
          <button
            onClick={handleLeaveCommunity}
            className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
          >
            Leave
          </button>
        ) : (
          <button
            onClick={handleJoinCommunity}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Join
          </button>
        )}
      </div>
      
      {isMember ? (
        <>
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No messages yet. Be the first to post!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${
                        message.senderId === user.uid
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      {message.senderId !== user.uid && (
                        <p className="text-xs font-semibold mb-1">
                          {message.senderName || 'Anonymous'}
                        </p>
                      )}
                      <p>{message.text}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CommunityDetail;
