import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPreviousPersonalChats, searchUsers } from '../services/chatService';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const Chat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (user) {
      fetchPreviousChats();
    }
  }, [user]);

  const fetchPreviousChats = async () => {
    setLoading(true);
    try {
      const personalChats = await getPreviousPersonalChats(user.uid);
      setChats(personalChats);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchUsers(searchTerm);
      // Filter out current user from results
      const filteredResults = results.filter(result => result.id !== user.uid);
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold mb-3">Personal Chats</h2>
        <div className="flex">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Search Results</h2>
            {searchResults.length === 0 ? (
              <p className="text-gray-500">No users found</p>
            ) : (
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <Link 
                    key={result.id} 
                    href={`/chat/${result.id}`}
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      {result.photoURL ? (
                        <img src={result.photoURL} alt={result.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <span className="text-gray-600 font-semibold">
                          {result.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{result.name || 'User'}</h3>
                      <p className="text-sm text-gray-500">{result.email}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchTerm('');
                setSearchResults([]);
              }}
              className="mt-4 text-blue-600 hover:underline"
            >
              Back to chats
            </button>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading chats...</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full p-4">
            <p className="text-gray-500 mb-4">No chats yet. Start a conversation!</p>
            <p className="text-gray-500 text-sm">
              Search for users above to begin chatting.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {chats.map((chat) => (
              <Link 
                key={chat.id} 
                href={`/chat/${chat.otherUser}`}
                className="flex items-center p-4 hover:bg-gray-50"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-gray-600 font-semibold">
                    {chat.otherUserName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">{chat.otherUserName}</h3>
                    {chat.lastMessageTime && (
                      <span className="text-xs text-gray-500 ml-2">
                        {formatDistanceToNow(new Date(chat.lastMessageTime.toDate()), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage || 'Start a conversation'}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="ml-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat; 