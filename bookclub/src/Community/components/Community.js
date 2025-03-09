import React, { useState, useRef } from 'react';
import { Search, Plus, Users, MessageSquare, Hash, Bell, User, Settings, ChevronRight, Send, Image, Smile, Paperclip, BarChart2, Reply, X, Upload, Info, Calendar } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import "./styles/Community.css";

const Community = () => {
  // State variables
  const [activeTab, setActiveTab] = useState('chats');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const fileInputRef = useRef(null);
  
  // Add messages state
  const [chatMessages, setChatMessages] = useState({
    'Sarah Johnson': [
      { 
        id: 1, 
        text: 'Would you like to join our book club?', 
        sender: 'Sarah Johnson', 
        time: '9:15 AM',
        reactions: []
      }
    ],
    'Priya Sharma': [
      { 
        id: 1, 
        text: 'I really enjoyed that recommendation!', 
        sender: 'Priya Sharma', 
        time: 'Yesterday',
        reactions: []
      }
    ],
    'Mystery Lovers Book Club': [
      { 
        id: 1, 
        text: 'Has anyone read "The Silent Patient"?', 
        sender: 'Mark Davies', 
        time: '10:30 AM',
        reactions: []
      }
    ],
    'Sci-Fi Enthusiasts': [
      { 
        id: 1, 
        text: 'The next meeting is on Friday!', 
        sender: 'Admin', 
        time: 'Yesterday',
        reactions: []
      }
    ]
  });

  // Add groups state
  const [groups, setGroups] = useState({
    chats: [
      {
        id: 1,
        name: "Book Club Reading Group",
        description: "Weekly book discussions and reading sessions",
        members: [
          { id: 1, name: "Sarah Johnson", role: "admin" },
          { id: 2, name: "You", role: "member", active: true },
        ],
        image: null
      }
    ],
    communities: [
      {
        id: 2,
        name: "Mystery Lovers Book Club",
        description: "A community for mystery book enthusiasts",
        members: [
          { id: 1, name: "Mark Davies", role: "admin" },
          { id: 3, name: "You", role: "member", active: true },
        ],
        image: null
      }
    ]
  });

  // Add the handleUpdateGroup function
  const handleUpdateGroup = (updatedGroup) => {
    setGroups(prev => ({
      chats: prev.chats.map(g => g.id === updatedGroup.id ? updatedGroup : g),
      communities: prev.communities.map(g => g.id === updatedGroup.id ? updatedGroup : g)
    }));
  };

  // Handle chat selection
  const handleChatClick = (chatName) => {
    setSelectedChat(chatName);
    setShowEmojiPicker(false);
  };

  // Handle message send
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() && !replyingTo) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
      replyTo: replyingTo
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }));

    setMessage('');
    setReplyingTo(null);
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMessage = {
          id: Date.now(),
          type: 'image',
          url: e.target.result,
          sender: 'You',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: []
        };
        setChatMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), newMessage]
        }));
      };
      reader.readAsDataURL(file);
      } else {
      const newMessage = {
        id: Date.now(),
        type: 'file',
        fileName: file.name,
        fileSize: file.size,
        sender: 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: []
      };
      setChatMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), newMessage]
      }));
    }
  };

  const handleReaction = (messageId, emoji) => {
    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: prev[selectedChat].map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.filter(r => r.emoji !== emoji)
            };
          }
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, user: 'You' }]
          };
        }
        return msg;
      })
    }));
  };

  const handleCreatePoll = (question, options) => {
    const newPoll = {
      id: Date.now(),
      type: 'poll',
      question,
      options: options.map(opt => ({ text: opt, votes: [] })),
      sender: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newPoll]
    }));
    setShowPollModal(false);
  };

  const handleVote = (messageId, optionIndex) => {
    setChatMessages(prev => ({
      ...prev,
      [selectedChat]: prev[selectedChat].map(msg => {
        if (msg.id === messageId && msg.type === 'poll') {
          const updatedOptions = [...msg.options];
          // Remove vote from other options
          updatedOptions.forEach(opt => {
            opt.votes = opt.votes.filter(voter => voter !== 'You');
          });
          // Add vote to selected option
          updatedOptions[optionIndex].votes.push('You');
          return { ...msg, options: updatedOptions };
        }
        return msg;
      })
    }));
  };

  const handleLeaveGroup = (groupId) => {
    setGroups(prev => ({
      chats: prev.chats.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            members: g.members.map(m => 
              m.name === "You" ? { ...m, active: false } : m
            )
          };
        }
        return g;
      }),
      communities: prev.communities.map(g => {
        if (g.id === groupId) {
          return {
            ...g,
            members: g.members.map(m => 
              m.name === "You" ? { ...m, active: false } : m
            )
          };
        }
        return g;
      })
    }));
  };

  const handleDeleteGroup = (groupId) => {
    setGroups(prev => ({
      chats: prev.chats.filter(g => g.id !== groupId),
      communities: prev.communities.filter(g => g.id !== groupId)
    }));
    setSelectedChat(null);
  };

  // Get current group
  const getCurrentGroup = () => {
    return [...groups.chats, ...groups.communities]
      .find(g => g.name === selectedChat);
  };

  return (
    <div className="community-container">
      <div className="sidebar">
        <div className="nav-tabs">
          <div 
            className={`nav-tab ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </div>
          <div 
            className={`nav-tab ${activeTab === 'communities' ? 'active' : ''}`}
            onClick={() => setActiveTab('communities')}
          >
            Communities
          </div>
        </div>

        <div className="new-group">+ New Group</div>
        
        <div className="search-box">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search..." 
          />
              </div>

        <div className="list-container">
          {groups[activeTab === 'chats' ? 'chats' : 'communities'].map((group) => (
            <div 
              key={group.id} 
              className={`list-item ${selectedChat === group.name ? 'active' : ''}`}
              onClick={() => handleChatClick(group.name)}
            >
              <div className="list-item-avatar">
                {group.image ? (
                  <img src={group.image} alt={group.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {group.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="list-item-name">{group.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {!selectedChat ? (
          <div className="welcome-screen">
            <h1>Welcome to Book Club Chat</h1>
            <p>Select a chat to start messaging</p>
          </div>
        ) : (
          <>
            <ChatHeader 
              selectedChat={selectedChat}
              onShowDetails={() => setShowGroupDetails(true)}
              groups={groups}
            />
            <div className="messages-container">
              {chatMessages[selectedChat]?.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
                  {msg.replyTo && (
                    <div className="reply-to">
                      <span className="reply-sender">{msg.replyTo.sender}</span>
                      <span className="reply-text">{msg.replyTo.text}</span>
                    </div>
                  )}

                  <div className="message-bubble">
                    {msg.type === 'image' && (
                      <img src={msg.url} alt="Shared" className="message-image" />
                    )}

                    {msg.type === 'file' && (
                      <div className="file-attachment">
                        <Paperclip size={16} />
                        <span className="file-name">{msg.fileName}</span>
                        <span className="file-size">
                          ({(msg.fileSize / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    )}

                    {msg.type === 'poll' && (
                      <PollMessage
                        poll={msg}
                        onVote={handleVote}
                      />
                    )}

                    {msg.text && <div className="message-text">{msg.text}</div>}
                    <div className="message-info">
                      <span className="message-sender">{msg.sender}</span>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>

                  <div className="message-actions">
                    <button 
                      className="action-button"
                      onClick={() => setReplyingTo(msg)}
                    >
                      <Reply size={16} />
                    </button>
                    <div className="reaction-buttons">
                      {['👍', '❤️', '😄', '😮', '😢', '👏'].map(emoji => (
                        <button
                          key={emoji}
                          className={`reaction-button ${msg.reactions.some(r => r.emoji === emoji) ? 'active' : ''}`}
                          onClick={() => handleReaction(msg.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
              </div>
                  </div>

                  {msg.reactions.length > 0 && (
                    <div className="message-reactions">
                      {msg.reactions.map((reaction, index) => (
                        <span key={index} className="reaction">
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {replyingTo && (
              <div className="reply-container">
                <div className="reply-preview">
                  <span>Replying to {replyingTo.sender}</span>
                  <p>{replyingTo.text}</p>
                </div>
                <button 
                  className="cancel-reply"
                  onClick={() => setReplyingTo(null)}
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {getCurrentGroup()?.members.find(m => m.name === "You")?.active ? (
              <form className="input-container" onSubmit={handleSendMessage}>
                <div className="input-actions">
                  <button 
                    type="button" 
                    className="action-button"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <button 
                    type="button" 
                    className="action-button"
                    onClick={() => setShowPollModal(true)}
                  >
                    <BarChart2 size={20} />
                  </button>
                  <button 
                    type="button" 
                    className="action-button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile size={20} />
                </button>
              </div>

                <input
                  type="text"
                  className="message-input" 
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" className="send-button">
                  <Send size={20} />
                </button>
              </form>
            ) : (
              <div className="left-group-message">
                You can no longer send messages to this group
              </div>
            )}

            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="dark"
                />
                  </div>
            )}

            {/* Overlay when panel is open */}
            <div className="panel-overlay" onClick={() => setShowGroupDetails(false)} />
          </>
                      )}
                    </div>

      {/* Group Details Panel */}
      {showGroupDetails && selectedChat && (
        <div className="group-details-panel">
          <GroupDetailsPanel
            group={getCurrentGroup()}
            onClose={() => setShowGroupDetails(false)}
            onUpdateGroup={handleUpdateGroup}
            onLeaveGroup={handleLeaveGroup}
            onDeleteGroup={handleDeleteGroup}
          />
        </div>
      )}

      {showPollModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PollCreator
              onSubmit={handleCreatePoll}
              onClose={() => setShowPollModal(false)}
            />
                  </div>
                </div>
      )}

      {showCreateModal && (
        <CreateGroupModal
          type={activeTab === 'chats' ? 'Group' : 'Community'}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(newGroup) => {
            setGroups(prev => ({
              ...prev,
              [activeTab === 'chats' ? 'chats' : 'communities']: [...(prev[activeTab === 'chats' ? 'chats' : 'communities'] || []), newGroup]
            }));
            // Update chatMessages state to include the new group
            setChatMessages(prev => ({
              ...prev,
              [newGroup.name]: []
            }));
          }}
        />
      )}

      {showDetails && selectedGroupDetails && (
        <div className="details-panel">
          <GroupDetails
            group={selectedGroupDetails}
            onClose={() => setShowDetails(false)}
            type={activeTab === 'chats' ? 'Group' : 'Community'}
          />
        </div>
      )}
    </div>
  );
};

const ChatHeader = ({ selectedChat, onShowDetails, groups }) => {
  const currentGroup = [...groups.chats, ...groups.communities]
    .find(g => g.name === selectedChat);
  
  const userMember = currentGroup?.members.find(m => m.name === "You");
  const isActive = userMember?.active;

  return (
    <div className="chat-header">
      <div 
        className="chat-header-content" 
        onClick={isActive ? onShowDetails : null}
        style={{ cursor: isActive ? 'pointer' : 'default' }}
      >
        <div className="chat-header-avatar">
          {currentGroup?.image ? (
            <img src={currentGroup.image} alt={currentGroup.name} />
          ) : (
            <div className="avatar-placeholder">
              {currentGroup?.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="chat-header-info">
          <h2>{selectedChat}</h2>
          <span className="member-count">
            {currentGroup?.members.length} members
            {!isActive && " • Left Group"}
          </span>
        </div>
      </div>
                  </div>
  );
};

const GroupDetailsPanel = ({ group, onClose, onUpdateGroup, onLeaveGroup, onDeleteGroup }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGroup, setEditedGroup] = useState(group);
  const fileInputRef = useRef(null);

  const userMember = group.members.find(m => m.name === "You");
  const isAdmin = userMember?.role === "admin";

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedGroup(prev => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setEditedGroup(prev => ({ ...prev, image: null }));
  };

  const handleSaveChanges = () => {
    onUpdateGroup(editedGroup);
    setIsEditing(false);
  };

  const handleLeaveGroup = () => {
    if (window.confirm('Are you sure you want to leave this group?')) {
      onLeaveGroup(group.id);
      onClose();
    }
  };

  const handleDeleteGroup = () => {
    if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      onDeleteGroup(group.id);
      onClose();
    }
  };

  return (
    <div className="group-details-panel">
      <div className="panel-header">
        <h2>Group Info</h2>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
                </div>

      <div className="panel-content">
        <div className="group-image-section">
          <div className="group-image">
            {editedGroup.image ? (
              <img src={editedGroup.image} alt={editedGroup.name} />
            ) : (
              <div className="image-placeholder">
                {editedGroup.name.charAt(0)}
              </div>
            )}
            {isEditing && (
              <div className="image-actions">
                <button onClick={() => fileInputRef.current.click()}>
                  Change Photo
                </button>
                {editedGroup.image && (
                  <button onClick={handleRemoveImage}>
                    Remove Photo
                  </button>
                )}
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
            </div>

        <div className="group-info-section">
          {isEditing ? (
            <input
              type="text"
              value={editedGroup.name}
              onChange={(e) => setEditedGroup(prev => ({ ...prev, name: e.target.value }))}
              className="edit-input"
            />
          ) : (
            <h3>{group.name}</h3>
          )}

          {isEditing ? (
            <textarea
              value={editedGroup.description}
              onChange={(e) => setEditedGroup(prev => ({ ...prev, description: e.target.value }))}
              className="edit-input"
              rows={3}
            />
          ) : (
            <p className="description">{group.description}</p>
          )}
                      </div>

        <div className="members-section">
          <div className="section-header">
            <h3>Members</h3>
            {group.members.find(m => m.role === 'admin')?.name === 'You' && (
              <button className="add-member-button">
                Add Member
              </button>
            )}
                    </div>
          <div className="members-list">
            {group.members.map(member => (
              <div key={member.id} className="member-item">
                <div className="member-avatar">
                  {member.name.charAt(0)}
                  </div>
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-role">{member.role}</span>
                      </div>
                    </div>
            ))}
                      </div>
                    </div>

        <div className="group-actions">
          {isAdmin ? (
            <>
              {isEditing ? (
                <>
                  <button className="cancel-button" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="save-button" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button className="edit-button" onClick={() => setIsEditing(true)}>
                    Edit Group
                  </button>
                  <button className="delete-button" onClick={handleDeleteGroup}>
                    Delete Group
                  </button>
                </>
              )}
            </>
          ) : (
            <button className="leave-button" onClick={handleLeaveGroup}>
              Leave Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PollCreator = ({ onSubmit, onClose }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }
    if (options.filter(opt => opt.trim()).length < 2) {
      setError('Please enter at least 2 options');
      return;
    }
    onSubmit(question, options.filter(opt => opt.trim()));
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="poll-creator">
      <div className="poll-creator-header">
        <h3>Create a Poll</h3>
        <button onClick={onClose} className="close-button">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="poll-input-group">
          <label>Question</label>
          <input
            type="text"
            placeholder="Ask your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="poll-input question-input"
          />
            </div>

        <div className="poll-options-container">
          <label>Options</label>
          {options.map((option, index) => (
            <div key={index} className="poll-option-input">
                <input
                  type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                className="poll-input"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="remove-option-button"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
            </div>

        {options.length < 6 && (
          <button
            type="button"
            onClick={addOption}
            className="add-option-button"
          >
            + Add Option
          </button>
        )}

        {error && <div className="poll-error">{error}</div>}

        <div className="poll-creator-footer">
          <button type="button" onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button type="submit" className="create-button">
            Create Poll
          </button>
        </div>
      </form>
    </div>
  );
};

const PollMessage = ({ poll, onVote }) => {
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);

  return (
    <div className="poll-container">
      <div className="poll-question">
        <h4>{poll.question}</h4>
        <span className="total-votes">{totalVotes} votes</span>
      </div>

      <div className="poll-options">
        {poll.options.map((option, index) => {
          const percentage = totalVotes ? (option.votes.length / totalVotes) * 100 : 0;
          const hasVoted = option.votes.includes('You');
          
          return (
            <div key={index} className="poll-option">
              <button
                onClick={() => onVote(poll.id, index)}
                className={`poll-vote-button ${hasVoted ? 'voted' : ''}`}
                disabled={poll.options.some(opt => opt.votes.includes('You'))}
              >
                <div className="poll-option-content">
                  <span className="option-text">{option.text}</span>
                  <span className="vote-percentage">{Math.round(percentage)}%</span>
                </div>
                <div 
                  className="vote-progress-bar"
                  style={{ width: `${percentage}%` }}
                />
              </button>
              {hasVoted && <span className="your-vote">Your vote</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CreateGroupModal = ({ onClose, onSubmit, type }) => {
  const [groupData, setGroupData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setGroupData(prev => ({ ...prev, image: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupData.name.trim()) {
      setError('Please enter a name');
      return;
    }
    onSubmit({
      ...groupData,
      id: Date.now(),
      members: 1
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="create-group-modal">
        <div className="modal-header">
          <h3>Create New {type}</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="group-image-upload">
            <div 
              className="image-preview"
              onClick={() => fileInputRef.current.click()}
            >
              {groupData.image ? (
                <img src={groupData.image} alt="Group" />
              ) : (
                <div className="upload-placeholder">
                  <Upload size={24} />
                  <span>Upload Image</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>

          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              placeholder={`${type} name`}
              value={groupData.name}
              onChange={(e) => setGroupData(prev => ({ ...prev, name: e.target.value }))}
              className="group-input"
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              placeholder={`Describe your ${type.toLowerCase()}`}
              value={groupData.description}
              onChange={(e) => setGroupData(prev => ({ ...prev, description: e.target.value }))}
              className="group-input"
              rows={3}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-button">
              Create {type}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GroupDetails = ({ group, onClose, type }) => {
  return (
    <div className="group-details">
      <div className="details-header">
        <button className="back-button" onClick={onClose}>
          <ChevronRight size={24} />
        </button>
        <h2>{group.name}</h2>
        {group.members.find(m => m.role === "admin")?.name === "You" && (
          <button className="settings-button">
            <Settings size={20} />
          </button>
        )}
      </div>

      <div className="details-content">
        <div className="group-avatar">
          {group.image ? (
            <img src={group.image} alt={group.name} />
          ) : (
            <div className="avatar-placeholder">
              {group.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="group-info">
          <h3>About {type}</h3>
          <p className="description">{group.description}</p>
          <div className="info-item">
            <Users size={16} />
            <span>{group.members.length} members</span>
          </div>
          <div className="info-item">
            <Calendar size={16} />
            <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="members-section">
          <h3>Members</h3>
          <div className="members-list">
            {group.members.map(member => (
              <div key={member.id} className="member-item">
                <div className="member-avatar">
                  {member.name.charAt(0)}
                </div>
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-role">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;