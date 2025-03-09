import React, { useState } from 'react';
import "./styles/CreateProfile.css";
const CreateProfile = () => {
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    profilePhoto: null,
    favoriteGenres: [''],
    favoriteBooks: [''],
    readBooks: [''],
    currentlyReading: [''],
    toReadBooks: ['']
  });
  
  // State for photo preview
  const [photoPreview, setPhotoPreview] = useState(null);
  
  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle photo upload
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, profilePhoto: file });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle list inputs (genres, books)
  const handleListChange = (e, index, listName) => {
    const newList = [...formData[listName]];
    newList[index] = e.target.value;
    setFormData({ ...formData, [listName]: newList });
  };
  
  // Add new item to a list
  const addListItem = (listName) => {
    setFormData({
      ...formData,
      [listName]: [...formData[listName], '']
    });
  };
  
  // Remove item from a list
  const removeListItem = (index, listName) => {
    const newList = [...formData[listName]];
    newList.splice(index, 1);
    setFormData({ ...formData, [listName]: newList });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty entries
    const cleanedData = {
      ...formData,
      favoriteGenres: formData.favoriteGenres.filter(item => item.trim() !== ''),
      favoriteBooks: formData.favoriteBooks.filter(item => item.trim() !== ''),
      readBooks: formData.readBooks.filter(item => item.trim() !== ''),
      currentlyReading: formData.currentlyReading.filter(item => item.trim() !== ''),
      toReadBooks: formData.toReadBooks.filter(item => item.trim() !== '')
    };
    
    // Here you would typically send the data to your backend API
    console.log('Submitting profile data:', cleanedData);
    
    // Navigate to profile page or home page after submission
    // navigate('/profile');
    alert('Profile created successfully!');
  };

  return (
    <div className="create-profile-container">
      <h1 className="form-title">Create Your Book Lover Profile</h1>
      <p className="form-subtitle">Tell us about yourself and your reading preferences</p>
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h2 className="section-title">Basic Information</h2>
          
          <div className="photo-upload-container">
            <div className="photo-preview">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile preview" />
              ) : (
                <div className="photo-placeholder">
                  <i className="photo-icon">📷</i>
                </div>
              )}
            </div>
            <label className="upload-button">
              Upload Profile Photo
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoChange} 
                className="hidden-input"
              />
            </label>
          </div>
          
          <div className="form-group">
            <label>Display Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Your name (as shown on your profile)"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder="Choose a unique username (no spaces)"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              placeholder="Tell other readers about yourself..."
              rows="4"
            />
          </div>
        </div>
        
        <div className="form-section">
          <h2 className="section-title">Reading Preferences</h2>
          
          <div className="list-input-container">
            <label>Favorite Genres</label>
            {formData.favoriteGenres.map((genre, index) => (
              <div key={`genre-${index}`} className="list-input-row">
                <input 
                  type="text" 
                  value={genre} 
                  onChange={(e) => handleListChange(e, index, 'favoriteGenres')} 
                  placeholder="E.g., Mystery, Science Fiction, Romance..."
                />
                {formData.favoriteGenres.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-button" 
                    onClick={() => removeListItem(index, 'favoriteGenres')}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-button" 
              onClick={() => addListItem('favoriteGenres')}
            >
              + Add Another Genre
            </button>
          </div>
          
          <div className="list-input-container">
            <label>Favorite Books</label>
            {formData.favoriteBooks.map((book, index) => (
              <div key={`favbook-${index}`} className="list-input-row">
                <input 
                  type="text" 
                  value={book} 
                  onChange={(e) => handleListChange(e, index, 'favoriteBooks')} 
                  placeholder="Title of one of your favorite books"
                />
                {formData.favoriteBooks.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-button" 
                    onClick={() => removeListItem(index, 'favoriteBooks')}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-button" 
              onClick={() => addListItem('favoriteBooks')}
            >
              + Add Another Book
            </button>
          </div>
        </div>
        
        <div className="form-section">
          <h2 className="section-title">Reading Status</h2>
          
          <div className="list-input-container">
            <label>Books You've Read</label>
            {formData.readBooks.map((book, index) => (
              <div key={`read-${index}`} className="list-input-row">
                <input 
                  type="text" 
                  value={book} 
                  onChange={(e) => handleListChange(e, index, 'readBooks')} 
                  placeholder="Title of a book you've read"
                />
                {formData.readBooks.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-button" 
                    onClick={() => removeListItem(index, 'readBooks')}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-button" 
              onClick={() => addListItem('readBooks')}
            >
              + Add Book
            </button>
          </div>
          
          <div className="list-input-container">
            <label>Currently Reading</label>
            {formData.currentlyReading.map((book, index) => (
              <div key={`current-${index}`} className="list-input-row">
                <input 
                  type="text" 
                  value={book} 
                  onChange={(e) => handleListChange(e, index, 'currentlyReading')} 
                  placeholder="Title of a book you're currently reading"
                />
                {formData.currentlyReading.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-button" 
                    onClick={() => removeListItem(index, 'currentlyReading')}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-button" 
              onClick={() => addListItem('currentlyReading')}
            >
              + Add Book
            </button>
          </div>
          
          <div className="list-input-container">
            <label>Want to Read</label>
            {formData.toReadBooks.map((book, index) => (
              <div key={`toread-${index}`} className="list-input-row">
                <input 
                  type="text" 
                  value={book} 
                  onChange={(e) => handleListChange(e, index, 'toReadBooks')} 
                  placeholder="Title of a book you want to read"
                />
                {formData.toReadBooks.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-button" 
                    onClick={() => removeListItem(index, 'toReadBooks')}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="add-button" 
              onClick={() => addListItem('toReadBooks')}
            >
              + Add Book
            </button>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button">Cancel</button>
          <button type="submit" className="submit-button">Create Profile</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfile;