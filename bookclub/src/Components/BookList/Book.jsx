import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import BookPreview from '../BookPreview/BookPreview';
import './BookList.css';

const Book = ({ id, cover_img, title, author, published, rating = 0 }) => {
  const [imgError, setImgError] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className="book-card-wrapper">
        <div 
          className={`book-card ${isHovered ? 'hovered' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setShowPreview(true)}
        >
          <div className="book-card-image">
            <img 
              src={imgError ? '/images/cover_not_found.jpg' : cover_img}
              alt={title}
              onError={() => setImgError(true)}
            />
            <div className="book-card-overlay">
              <button className="preview-btn">Preview Book</button>
            </div>
          </div>
          
          <div className="book-card-content">
            <h3 className="book-card-title">{title}</h3>
            <p className="book-card-author">by {author}</p>
            
            <div className="book-card-details">
              <div className="book-card-rating">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < Math.floor(rating) ? 'star-filled' : 'star-empty'}
                  />
                ))}
              </div>
              <p className="book-card-published">Published: {published}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Book Preview Modal */}
      {showPreview && (
        <div className="modal-overlay">
          <div className="modal-content">
            <BookPreview 
              bookId={id}
              bookTitle={title}
              onClose={() => setShowPreview(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Book;