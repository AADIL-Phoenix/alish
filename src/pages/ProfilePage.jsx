import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState({
    username: "Jane Austen",
    bio: "Passionate reader and writer. Love discussing classic literature and contemporary fiction.",
    location: "London, UK",
    joinedDate: "2024-01-15",
    profileImage: "https://example.com/path-to-profile-image.jpg", // Replace with actual image URL
    coverImage: "https://example.com/path-to-cover-image.jpg", // Replace with actual image URL
    stats: {
      followers: 1234,
      following: 567,
      booksRead: 89
    },
    currentlyReading: [
      {
        id: 1,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        coverImage: "https://example.com/book1.jpg" // Replace with actual image URL
      },
      // Add more books...
    ]
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-[300px]">
        <img
          src={profile.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000"; // Fallback image
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                  <img
                    src={profile.profileImage}
                    alt={profile.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=1000"; // Fallback image
                    }}
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-gray-600">
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-1" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-1" />
                    <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="mt-4 text-gray-600 max-w-2xl">{profile.bio}</p>
              </div>

              {/* Follow Button */}
              <div>
                <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Follow
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center p-4 rounded-lg bg-gray-50">
                <div className="text-2xl font-bold text-gray-900">{profile.stats.booksRead}</div>
                <div className="text-sm text-gray-500">Books Read</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-50">
                <div className="text-2xl font-bold text-gray-900">{profile.stats.followers}</div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-50">
                <div className="text-2xl font-bold text-gray-900">{profile.stats.following}</div>
                <div className="text-sm text-gray-500">Following</div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {['Currently Reading', 'Read', 'Want to Read'].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm
                    ${tab === 'Currently Reading' 
                      ? 'border-primary-500 text-primary-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Book Grid */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {profile.currentlyReading.map((book) => (
                <div key={book.id} className="group">
                  <div className="aspect-w-2 aspect-h-3 rounded-lg overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover object-center group-hover:opacity-75"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2000"; // Fallback image
                      }}
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggested Profiles */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Suggested Profiles</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((profile) => (
                <div key={profile} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={`https://i.pravatar.cc/150?img=${profile}`}
                        alt="Suggested profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Reader {profile}</h3>
                      <p className="text-sm text-gray-500">Book enthusiast</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-full">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 