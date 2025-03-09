import React, { useState, useEffect } from 'react';
import { FaTimes, FaHeart, FaBookmark, FaStar, FaChevronDown } from "react-icons/fa";
import "./BookPreview.css";

const BookPreview = ({ bookId, bookTitle, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('preview');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [expandDescription, setExpandDescription] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
        const data = await response.json();
        setBookData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setIsLoading(false);
      }
    };

    fetchBookDetails();
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [bookId]);

  if (isLoading) {
    return (
      <div className="book-preview-overlay">
        <div className="book-preview-container">
          <div className="preview-loader">
            <div className="loader-spinner"></div>
            <div className="loader-text">Loading book details...</div>
          </div>
        </div>
      </div>
    );
  }

  const {
    title = bookTitle,
    authors = [],
    averageRating = 0,
    ratingsCount = 0,
    imageLinks = {},
    categories = [],
    publisher = 'Not available',
    publishedDate = 'Not available',
    pageCount = 'Not available',
    description = 'No description available',
    language = 'Not specified',
    industryIdentifiers = []
  } = bookData?.volumeInfo || {};

  const isbn = industryIdentifiers.find(id => id.type === 'ISBN_13')?.identifier || 
               industryIdentifiers.find(id => id.type === 'ISBN_10')?.identifier || 
               'Not available';

  return (
    <div className="book-preview-container">
      <button className="close-preview-btn" onClick={onClose}>
        <FaTimes />
      </button>

      <div className="preview-header">
        <div className="header-main">
          <h1 className="book-title">{title}</h1>
          <p className="book-author">by {authors.join(', ') || 'Unknown Author'}</p>
          <div className="rating-container">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i}
                  className={i < Math.floor(averageRating) ? 'star-filled' : 'star-empty'} 
                />
              ))}
            </div>
            <span className="rating-count">({ratingsCount} reviews)</span>
          </div>
        </div>
        <button 
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="preview-content">
        <div className="preview-left">
          <div className="book-cover-container">
            <img 
              src={imageLinks.thumbnail || '/images/cover_not_found.jpg'} 
              alt={title}
              className="book-cover"
            />
          </div>
          <div className="action-buttons">
            <button className="action-btn wishlist">
              <FaHeart /> Add to Wishlist
            </button>
            <button className="action-btn reading-list">
              <FaBookmark /> Add to Reading List
            </button>
          </div>
        </div>

        <div className="preview-right">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              About
            </button>
            <button 
              className={`tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'preview' ? (
              <div className="preview-tab">
                <h3>About this book</h3>
                <div className={`book-description ${expandDescription ? 'expanded' : ''}`}>
                  <p>{description}</p>
                </div>
                {description.length > 300 && (
                  <button 
                    className="expand-button"
                    onClick={() => setExpandDescription(!expandDescription)}
                  >
                    {expandDescription ? 'Show less' : 'Show more'} <FaChevronDown className={expandDescription ? 'rotate' : ''} />
                  </button>
                )}
              </div>
            ) : (
              <div className="details-tab">
                <div className="book-details">
                  <div className="detail-item">
                    <span className="detail-label">Genre:</span>
                    <span className="detail-value">{categories.join(', ') || 'Not specified'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Publisher:</span>
                    <span className="detail-value">{publisher}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Published Date:</span>
                    <span className="detail-value">{publishedDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Pages:</span>
                    <span className="detail-value">{pageCount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Language:</span>
                    <span className="detail-value">{language.toUpperCase()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">ISBN:</span>
                    <span className="detail-value">{isbn}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPreview;