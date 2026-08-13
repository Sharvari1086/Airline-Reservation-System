import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container-custom py-12">
        <p>Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
        
        <div className="card">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">Full Name</div>
              <div className="text-lg font-medium">{user.name}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Email Address</div>
              <div className="text-lg font-medium">{user.email}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Phone Number</div>
              <div className="text-lg font-medium">{user.phone}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Account Type</div>
              <div className="text-lg font-medium capitalize">{user.role}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Member Since</div>
              <div className="text-lg font-medium">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;