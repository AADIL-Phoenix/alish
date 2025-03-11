import React from 'react';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

const SuggestedProfiles = ({ profiles }) => {
  if (!profiles.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No suggested profiles available
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {profiles.map((profile) => (
        <div 
          key={profile._id} 
          className="py-4 first:pt-0 last:pb-0"
        >
          <div className="flex items-center justify-between">
            <Link 
              to={`/profile/${profile._id}`} 
              className="flex items-center flex-1 min-w-0"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {profile.profile_picture ? (
                  <img 
                    src={profile.profile_picture} 
                    alt={profile.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100">
                    <span className="text-blue-600 font-bold">
                      {profile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-4 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {profile.username}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {profile.bio || 'No bio available'}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {profile.followers_count} followers
                </div>
              </div>
            </Link>
            <div className="ml-4 flex-shrink-0">
              <FollowButton 
                userId={profile._id} 
                isFollowing={profile.isFollowing}
                compact
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestedProfiles; 