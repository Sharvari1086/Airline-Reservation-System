import React from 'react';
import { useAuth } from '../context/AuthContext';
import Landing from './Landing';
import UserHome from './UserHome';
import LoadingSpinner from '../components/LoadingSpinner';

const HomeRouter = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated && !isAdmin) {
    return <UserHome />;
  }

  return <Landing />;
};

export default HomeRouter;