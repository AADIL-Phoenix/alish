import React from 'react';
import FollowButton from './FollowButton';
import { useAuth } from '../context/AuthContext';

const ProfileStats = ({ profile }) => {
  const { user } = useAuth();
  const isOwnProfile = user?._id === profile?._id;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{profile?.username}</h1>
        <p className="text-gray-500 mt-1">{profile?.location}</p>
        
        {!isOwnProfile && (
          <div className="mt-4">
            <FollowButton 
              userId={profile?._id} 
              isFollowing={profile?.isFollowing}
            />
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 pt-6">
        <button className="text-center hover:bg-gray-50 rounded-lg p-2 transition-colors">
          <span className="block text-2xl font-bold text-gray-900">
            {profile?.followers_count || 0}
          </span>
          <span className="text-sm text-gray-500">Followers</span>
        </button>
        <button className="text-center hover:bg-gray-50 rounded-lg p-2 transition-colors">
          <span className="block text-2xl font-bold text-gray-900">
            {profile?.following_count || 0}
          </span>
          <span className="text-sm text-gray-500">Following</span>
        </button>
        <button className="text-center hover:bg-gray-50 rounded-lg p-2 transition-colors">
          <span className="block text-2xl font-bold text-gray-900">
            {profile?.books_count || 0}
          </span>
          <span className="text-sm text-gray-500">Books</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileStats; 