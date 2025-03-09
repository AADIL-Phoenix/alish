import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Link from 'next/link';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            setProfile(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  if (!user || !profile) {
    return <div className="text-center py-10">Please log in to view your profile</div>;
  }

  // Convert books object to array and filter based on active tab
  const booksArray = profile.books ? Object.entries(profile.books).map(([id, book]) => ({
    id,
    ...book
  })) : [];

  const filteredBooks = activeTab === 'all' 
    ? booksArray 
    : booksArray.filter(book => book.status === activeTab);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-2xl">{user.email?.charAt(0).toUpperCase() || '?'}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile.name || 'User'}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Your Books</h2>
        
        {/* Reading status tabs */}
        <div className="flex border-b mb-6">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          >
            All Books
          </button>
          <button 
            onClick={() => setActiveTab('want-to-read')}
            className={`px-4 py-2 ${activeTab === 'want-to-read' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          >
            Want to Read
          </button>
          <button 
            onClick={() => setActiveTab('currently-reading')}
            className={`px-4 py-2 ${activeTab === 'currently-reading' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          >
            Currently Reading
          </button>
          <button 
            onClick={() => setActiveTab('read')}
            className={`px-4 py-2 ${activeTab === 'read' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
          >
            Read
          </button>
        </div>
        
        {filteredBooks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {activeTab === 'all' 
              ? "You haven't added any books to your profile yet." 
              : `You don't have any books marked as "${activeTab.replace('-', ' ')}".`}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map(book => (
              <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition">
                <Link href={`/books/${book.id}`}>
                  <h3 className="font-semibold text-lg hover:text-blue-600">{book.title}</h3>
                </Link>
                <p className="text-gray-600">{book.author}</p>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    book.status === 'read' ? 'bg-purple-100 text-purple-800' :
                    book.status === 'currently-reading' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {book.status === 'want-to-read' ? 'Want to Read' :
                     book.status === 'currently-reading' ? 'Currently Reading' : 'Read'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Updated: {book.updatedAt?.toDate().toLocaleDateString() || 'Unknown'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 