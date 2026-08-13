import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary-600 shadow-lg">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-white text-2xl font-bold flex items-center">
            ✈️ AeroLink
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-primary-100 transition-colors">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="text-white hover:text-primary-100 transition-colors">
                  My Bookings
                </Link>
                <Link to="/profile" className="text-white hover:text-primary-100 transition-colors">
                  Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-white hover:text-primary-100 transition-colors">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-primary-100 transition-colors"
                >
                  Logout
                </button>
                <span className="text-white bg-primary-700 px-3 py-1 rounded-full text-sm">
                  {user?.name}
                </span>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-primary-100 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;