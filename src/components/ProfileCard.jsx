import React from 'react';
import FollowButton from './FollowButton';
import { useAuth } from '../context/AuthContext';

const ProfileCard = ({ profile }) => {
  const { user } = useAuth();
  const isOwnProfile = user?._id === profile._id;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Cover Photo */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"></div>
      
      {/* Profile Content */}
      <div className="relative px-6 pb-6">
        {/* Profile Picture */}
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white">
            {profile.profile_picture ? (
              <img 
                src={profile.profile_picture} 
                alt={profile.username} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-4xl font-bold">
                  {profile.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
          <p className="mt-2 text-gray-600">{profile.bio || "No bio available"}</p>

          {/* Follow Button */}
          {!isOwnProfile && (
            <div className="mt-4">
              <FollowButton 
                userId={profile._id} 
                isFollowing={profile.isFollowing}
              />
            </div>
          )}

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900">
                {profile.followers_count || 0}
              </span>
              <span className="text-sm text-gray-500">Followers</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900">
                {profile.following_count || 0}
              </span>
              <span className="text-sm text-gray-500">Following</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-gray-900">
                {profile.books_count || 0}
              </span>
              <span className="text-sm text-gray-500">Books</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{profile.favorite_genre || "No favorite genre"}</span>
              </div>
              <div className="flex items-center justify-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard; 