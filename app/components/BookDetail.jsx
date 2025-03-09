import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Link from 'next/link';

const BookDetail = ({ book }) => {
  const [readingStatus, setReadingStatus] = useState(null);
  const [showSample, setShowSample] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch user's reading status for this book if user is logged in
    const fetchReadingStatus = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists() && userDoc.data().books) {
          const bookStatus = userDoc.data().books[book.id];
          if (bookStatus) {
            setReadingStatus(bookStatus.status);
          }
        }
      }
    };
    
    fetchReadingStatus();
  }, [user, book.id]);

  const updateReadingStatus = async (status) => {
    if (!user) {
      alert('Please log in to track your reading');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      let userData = userDoc.exists() ? userDoc.data() : {};
      
      // Initialize books object if it doesn't exist
      if (!userData.books) {
        userData.books = {};
      }
      
      // Update the status for this book
      userData.books[book.id] = {
        ...userData.books[book.id],
        title: book.title,
        author: book.author,
        status: status,
        updatedAt: new Date()
      };
      
      await updateDoc(userRef, { books: userData.books });
      setReadingStatus(status);
      alert(`Book marked as "${status}"`);
    } catch (error) {
      console.error('Error updating reading status:', error);
      alert('Failed to update reading status');
    }
  };

  const toggleSample = () => {
    setShowSample(!showSample);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* ... existing book details ... */}
      
      {/* Purchase link */}
      <div className="mt-6">
        <a 
          href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.author)}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Buy on Amazon
        </a>
      </div>
      
      {/* Reading status buttons */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Track your reading:</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => updateReadingStatus('want-to-read')}
            className={`px-3 py-1 rounded ${readingStatus === 'want-to-read' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}
          >
            Want to Read
          </button>
          <button 
            onClick={() => updateReadingStatus('currently-reading')}
            className={`px-3 py-1 rounded ${readingStatus === 'currently-reading' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}
          >
            Currently Reading
          </button>
          <button 
            onClick={() => updateReadingStatus('read')}
            className={`px-3 py-1 rounded ${readingStatus === 'read' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'}`}
          >
            Read
          </button>
        </div>
      </div>
      
      {/* Sample chapters */}
      <div className="mt-6">
        <button 
          onClick={toggleSample}
          className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
        >
          {showSample ? 'Hide Sample' : 'View Sample Chapters'}
        </button>
        
        {showSample && (
          <div className="mt-4 p-4 border border-gray-300 rounded">
            <h3 className="text-xl font-bold mb-2">Sample Chapters</h3>
            <p className="text-sm text-gray-500 mb-4">This is a preview of the first few chapters. Purchase the full book to continue reading.</p>
            
            <div className="prose max-w-none">
              <h4>Chapter 1: {book.title ? book.title.split(' ')[0] : 'Introduction'}</h4>
              <p>
                {book.description || 'Sample text for the first chapter would appear here. This is just a preview of the book content.'}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              
              <h4 className="mt-4">Chapter 2: The Journey Begins</h4>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              
              <div className="mt-6 p-4 bg-gray-100 rounded text-center">
                <p className="font-semibold">Want to continue reading?</p>
                <a 
                  href={`https://www.amazon.com/s?k=${encodeURIComponent(book.title + ' ' + book.author)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Purchase Full Book
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail; 