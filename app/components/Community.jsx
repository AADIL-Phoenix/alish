import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getPublicCommunities, 
  getUserCommunities,
  getPreviousGroupChats,
  searchCommunities,
  createCommunityOrGroup,
  joinCommunityOrGroup
} from '../services/communityService';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const Community = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('myCommunities');
  const [communities, setCommunities] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    type: 'community', // 'community' or 'group'
    isPublic: true,
    tags: []
  });

  useEffect(() => {
    if (user) {
      fetchCommunities();
      fetchGroupChats();
    }
  }, [user]);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const userCommunities = await getUserCommunities(user.uid);
      setCommunities(userCommunities);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupChats = async () => {
    try {
      const groups = await getPreviousGroupChats(user.uid);
      setGroupChats(groups);
    } catch (error) {
      console.error('Error fetching group chats:', error);
    }
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    setLoading(true);
    
    try {
      if (tab === 'myCommunities') {
        const userCommunities = await getUserCommunities(user.uid);
        setCommunities(userCommunities);
      } else if (tab === 'discover') {
        const publicCommunities = await getPublicCommunities();
        setCommunities(publicCommunities);
      }
    } catch (error) {
      console.error('Error fetching data for tab:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchCommunities(searchTerm);
      setCommunities(results);
    } catch (error) {
      console.error('Error searching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      const groupId = await createCommunityOrGroup(user.uid, newGroup);
      setShowCreateModal(false);
      setNewGroup({
        name: '',
        description: '',
        type: 'community',
        isPublic: true,
        tags: []
      });
      
      // Refresh the communities/groups list
      if (newGroup.type === 'community') {
        fetchCommunities();
      } else {
        fetchGroupChats();
      }
      
      alert(`${newGroup.type === 'community' ? 'Community' : 'Group'} created successfully!`);
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create. Please try again.');
    }
  };

  const handleJoinCommunity = async (communityId) => {
    if (!user) return;
    
    try {
      await joinCommunityOrGroup(user.uid, communityId, 'community');
      alert('Successfully joined the community!');
      
      // Refresh the communities list
      fetchCommunities();
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Failed to join community. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Communities</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
        >
          Join or Create Group
        </button>
      </div>
      
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'myCommunities' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          onClick={() => handleTabChange('myCommunities')}
        >
          My Communities
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'discover' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          onClick={() => handleTabChange('discover')}
        >
          Discover
        </button>
      </div>
      
      <div className="p-3 border-b">
        <div className="flex">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 text-sm"
          >
            Search
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Previous Group Chats Section */}
        <div className="p-3 border-b">
          <h3 className="text-md font-semibold mb-2">Previous Group Chats</h3>
          {groupChats.length === 0 ? (
            <p className="text-gray-500 text-sm">No group chats yet</p>
          ) : (
            <div className="space-y-2">
              {groupChats.map((group) => (
                <Link 
                  key={group.id} 
                  href={`/group/${group.id}`}
                  className="flex items-center p-2 border rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    {group.imageUrl ? (
                      <img src={group.imageUrl} alt={group.name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <span className="text-gray-600 font-semibold">
                        {group.name?.charAt(0).toUpperCase() || 'G'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate text-sm">{group.name}</h3>
                      {group.lastMessageTime && (
                        <span className="text-xs text-gray-500 ml-1">
                          {formatDistanceToNow(new Date(group.lastMessageTime), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {group.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                  {group.unreadCount > 0 && (
                    <div className="ml-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                      {group.unreadCount}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        {/* Communities Section */}
        <div className="p-3">
          <h3 className="text-md font-semibold mb-2">
            {activeTab === 'myCommunities' ? 'My Communities' : 'Discover Communities'}
          </h3>
          
          {loading ? (
            <div className="flex justify-center items-center py-6">
              <p className="text-sm text-gray-500">Loading communities...</p>
            </div>
          ) : communities.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">
                {activeTab === 'myCommunities'
                  ? "You haven't joined any communities yet."
                  : "No communities found."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {communities.map((community) => (
                <div key={community.id} className="border rounded-lg p-3 hover:shadow-sm transition">
                  <div className="flex items-center mb-2">
                    {community.imageUrl ? (
                      <img
                        src={community.imageUrl}
                        alt={community.name}
                        className="w-10 h-10 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-blue-600 font-bold">
                          {community.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-sm">{community.name}</h3>
                      <p className="text-xs text-gray-500">
                        {community.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-700 mb-2 line-clamp-2">
                    {community.description || 'No description available.'}
                  </p>
                  
                  {community.tags && community.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {community.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-1">
                    <Link href={`/community/${community.id}`}>
                      <span className="text-blue-600 hover:underline text-xs">View Community</span>
                    </Link>
                    
                    {activeTab === 'discover' && 
                     (!community.members?.includes(user?.uid)) && (
                      <button
                        onClick={() => handleJoinCommunity(community.id)}
                        className="bg-blue-600 text-white px-2 py-1 text-xs rounded hover:bg-blue-700"
                      >
                        Join
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Create/Join Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Join or Create Group</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Join Existing Group/Community</h3>
              <p className="text-sm text-gray-600 mb-2">
                Search for communities in the search bar above or browse the Discover tab.
              </p>
            </div>
            
            <div className="border-t pt-4 mb-4">
              <h3 className="font-semibold mb-2">Create New Group/Community</h3>
              <form onSubmit={handleCreateGroup}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="groupType"
                        value="group"
                        checked={newGroup.type === 'group'}
                        onChange={() => setNewGroup({...newGroup, type: 'group'})}
                        className="mr-2"
                      />
                      <span>Group Chat</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="groupType"
                        value="community"
                        checked={newGroup.type === 'community'}
                        onChange={() => setNewGroup({...newGroup, type: 'community'})}
                        className="mr-2"
                      />
                      <span>Community</span>
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newGroup.type === 'community' ? 'Community' : 'Group'} Name
                  </label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>
                
                {newGroup.type === 'community' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="books, fiction, fantasy"
                        onChange={(e) => setNewGroup({
                          ...newGroup, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                        })}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newGroup.isPublic}
                          onChange={(e) => setNewGroup({...newGroup, isPublic: e.target.checked})}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Make community public</span>
                      </label>
                    </div>
                  </>
                )}
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community; 