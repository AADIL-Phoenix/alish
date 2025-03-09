import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/UserProfile.css'; // Import the CSS file

const ProfileCard = ({ user, onProfileUpdate }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Sample user data - replace with actual data from your backend
  const defaultUser = {
    name: "Jane Austen",
    username: "janeausten",
    profilePhoto: "/api/placeholder/150/150",
    bio: "Avid reader, book collector, and aspiring writer.",
    website: "www.bookclub.com",
    followers: 843,
    following: 231,
    favoriteGenre: ["Classic Literature", "Historical Fiction", "Romance"],
    favoriteBooks: ["Pride and Prejudice", "Jane Eyre", "The Great Gatsby"],
    readingStatus: {
      read: ["To Kill a Mockingbird", "1984", "Little Women", "The Hobbit"],
      currentlyReading: ["The Seven Husbands of Evelyn Hugo"],
      toRead: ["The Midnight Library", "Pachinko", "The Song of Achilles"]
    }
  };

  // Use provided user data or fall back to default
  const [userData, setUserData] = useState(user || defaultUser);
  
  // State for managing active tab in reading status
  const [activeTab, setActiveTab] = useState('read');
  
  // State for edit profile modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // State for form data in edit modal
  const [formData, setFormData] = useState({
    name: userData.name,
    username: userData.username,
    bio: userData.bio,
    website: userData.website,
    favoriteGenre: userData.favoriteGenre.join(', ')
  });
  
  // State for profile image preview
  const [imagePreview, setImagePreview] = useState(userData.profilePhoto);
  
  // Function to generate a consistent color based on book title
  const generateBookColor = (title) => {
    // Simple hash function to generate a number from a string
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate hue (0-360), high saturation and lightness
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 35%)`;
  };
  
  // Function to generate a gradient for book covers
  const getBookCoverStyle = (title) => {
    try {
      const baseColor = generateBookColor(title);
      // Extract the hue value safely with a fallback
      const matches = baseColor.match(/hsl\((\d+)/);
      const h = matches && matches[1] ? parseInt(matches[1]) : Math.floor(Math.random() * 360);
      const secondHue = (h + 40) % 360;
      
      return {
        background: `linear-gradient(135deg, hsl(${h}, 70%, 35%) 0%, hsl(${secondHue}, 70%, 25%) 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      };
    } catch (error) {
      // Fallback to a default gradient if there's any error
      return {
        background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      };
    }
  };
  
  // Add animation effect when tab changes
  const [animateGrid, setAnimateGrid] = useState(false);
  
  useEffect(() => {
    setAnimateGrid(true);
    const timer = setTimeout(() => setAnimateGrid(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Function to handle book clicks
  const handleBookClick = async (bookTitle) => {
    try {
      // First, search for the book using Google Books API
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookTitle)}`
      );
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        // Get the first book's ID
        const bookId = data.items[0].id;
        // Navigate to the book details page
        navigate(`/book/${bookId}`);
      } else {
        console.log('Book not found');
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error('Error searching for book:', error);
    }
  };

  // Function to handle edit profile button click
  const handleEditProfileClick = () => {
    setIsEditModalOpen(true);
    setFormData({
      name: userData.name,
      username: userData.username,
      bio: userData.bio,
      website: userData.website,
      favoriteGenre: userData.favoriteGenre.join(', ')
    });
    setImagePreview(userData.profilePhoto);
  };
  
  // Function to handle input changes in edit modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Function to handle profile photo upload
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // In a real application, you would upload this file to your server
      // and get back a URL to store in your user data
    }
  };
  
  // Function to trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // Function to save profile changes
  const saveProfileChanges = () => {
    // Split the comma-separated genre string into an array
    const genreArray = formData.favoriteGenre
      .split(',')
      .map(genre => genre.trim())
      .filter(genre => genre.length > 0);
    
    // Update user data
    const updatedUserData = {
      ...userData,
      name: formData.name,
      username: formData.username,
      bio: formData.bio,
      website: formData.website,
      favoriteGenre: genreArray,
      profilePhoto: imagePreview // In a real app, this would be the URL from your server
    };
    
    setUserData(updatedUserData);
    
    // If a callback for profile updates was provided, call it
    if (onProfileUpdate) {
      onProfileUpdate(updatedUserData);
    }
    
    // Close the modal
    setIsEditModalOpen(false);
  };

  // Function to render book cards
  const renderBookCard = (book, status) => (
    <div 
      key={book} 
      className="book-card"
      onClick={() => handleBookClick(book)}
      style={{ cursor: 'pointer' }}
    >
      <div className="book-cover" style={getBookCoverStyle(book)}>
        <div className="book-spine"></div>
        <div className="book-title-cover">{book.split(' ').slice(0, 2).join(' ')}</div>
      </div>
      <div className="book-info">
        <h3>{book}</h3>
        <span className={`status-badge ${status}`}>
          {status === 'reading' ? 'Currently Reading' : status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <div className="profile-background"></div>
      <div className="instagram-profile">
        {/* Profile Header */}
        <div className="profile-header">
          {/* Profile Photo */}
          <div className="profile-photo-container">
            <img 
              src={userData.profilePhoto || "/default-avatar.png"} 
              alt="profile" 
              className="profile-photo"
            />
          </div>

          {/* Name and Bio */}
          <div className="profile-info">
            <h2 className="username">{userData.name}</h2>
            <p className="bio">{userData.bio}</p>
            <div className="genre-tags">
              {userData.favoriteGenre.map((genre, index) => (
                <span key={index} className="genre-tag">#{genre.replace(/\s+/g, '')}</span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{userData.readingStatus.read.length}</span>
              <span className="stat-label">read</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userData.followers}</span>
              <span className="stat-label">followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{userData.following}</span>
              <span className="stat-label">following</span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="profile-actions">
            <button 
              className="edit-profile-btn"
              onClick={handleEditProfileClick}
            >
              Edit profile
            </button>
          </div>
        </div>

        {/* Scrollable Content Wrapper */}
        <div className="profile-content-wrapper">
          {/* Reading Tabs */}
          <div className="reading-tabs">
            <div className={`tab ${activeTab === 'read' ? 'active' : ''}`}
                 onClick={() => setActiveTab('read')}>
              READ
            </div>
            <div className={`tab ${activeTab === 'reading' ? 'active' : ''}`}
                 onClick={() => setActiveTab('reading')}>
              READING
            </div>
            <div className={`tab ${activeTab === 'toRead' ? 'active' : ''}`}
                 onClick={() => setActiveTab('toRead')}>
              TO READ
            </div>
          </div>

          {/* Books Grid */}
          <div className="books-grid">
            {activeTab === 'read' && (
              userData.readingStatus.read.map(book => renderBookCard(book, 'read'))
            )}

            {activeTab === 'reading' && (
              userData.readingStatus.currentlyReading.map(book => renderBookCard(book, 'reading'))
            )}

            {activeTab === 'toRead' && (
              userData.readingStatus.toRead.map(book => renderBookCard(book, 'to-read'))
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="edit-profile-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button 
                className="close-button"
                onClick={() => setIsEditModalOpen(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              {/* Profile Photo Upload */}
              <div className="photo-upload-section">
                <div className="profile-photo-preview">
                  <img 
                    src={imagePreview || "/default-avatar.png"} 
                    alt="Profile preview" 
                    className="profile-preview-img"
                  />
                  <div 
                    className="change-photo-overlay"
                    onClick={triggerFileInput}
                  >
                    <span>Change Photo</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleProfilePhotoChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              
              {/* Form Fields */}
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea 
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input 
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="favoriteGenre">Favorite Genres (comma-separated)</label>
                <input 
                  type="text"
                  id="favoriteGenre"
                  name="favoriteGenre"
                  value={formData.favoriteGenre}
                  onChange={handleInputChange}
                  placeholder="Classic Literature, Historical Fiction, etc."
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="save-button"
                onClick={saveProfileChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;