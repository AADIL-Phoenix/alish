import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* App header */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">BookClub</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center p-3 rounded-md ${
                activeTab === 'chat' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              Chats
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('community')}
              className={`w-full flex items-center p-3 rounded-md ${
                activeTab === 'community' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Communities
            </button>
          </li>
          <li>
            <Link href="/books" className="w-full flex items-center p-3 rounded-md hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Books
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* User profile */}
      {user && (
        <div className="p-4 border-t">
          <Link href="/profile" className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-10 h-10 rounded-full" />
              ) : (
                <span className="text-gray-600 font-semibold">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.displayName || user.email}</p>
              <p className="text-xs text-gray-500 truncate">View Profile</p>
            </div>
          </Link>
          <button
            onClick={logout}
            className="mt-3 w-full text-sm text-gray-600 hover:text-red-600 text-left"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 