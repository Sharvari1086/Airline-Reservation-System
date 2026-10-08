import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaPlane,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
  FaUser,
  FaBook,
  FaTachometerAlt,
  FaPlusCircle,
  FaList,
  FaUsers,
  FaChartBar
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  const isIn = (path) => location.pathname.startsWith(path);

  // ==================
  // GUEST NAVBAR (Minimal - only Home, Sign In, Get Started)
  // ==================
  if (!isAuthenticated) {
    return (
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-600 p-2 rounded-lg">
                <FaPlane className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-900">AeroLink</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition ${
                  isActive('/')
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Home
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-700 hover:text-primary-600 px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary-700 transition shadow-sm"
              >
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-700 text-xl"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden py-4 space-y-1 border-t border-gray-100">
              <Link
                to="/"
                className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <hr className="my-2" />
              <Link
                to="/login"
                className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block py-2 px-3 bg-primary-600 text-white rounded-lg text-center font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // ==================
  // ADMIN NAVBAR (Blue theme)
  // ==================
  if (isAdmin) {
    const adminLinks = [
      { to: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, exact: true },
      { to: '/admin/manage-flights', label: 'Flights', icon: <FaList /> },
      { to: '/admin/add-flight', label: 'Add', icon: <FaPlusCircle /> },
      { to: '/admin/bookings', label: 'Bookings', icon: <FaBook /> },
      { to: '/admin/users', label: 'Users', icon: <FaUsers /> },
      { to: '/admin/reports', label: 'Reports', icon: <FaChartBar /> }
    ];

    return (
      <nav className="bg-primary-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link
                to="/admin"
                className="flex items-center gap-2 flex-shrink-0"
              >
                <div className="bg-white p-2 rounded-lg">
                  <FaPlane className="text-primary-700 text-lg" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-lg font-bold text-white">AeroLink</span>
                  <span className="text-xs text-primary-200 font-semibold">
                    Admin Panel
                  </span>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {adminLinks.map((link) => {
                  const active = link.exact
                    ? isActive(link.to)
                    : isIn(link.to) && !isActive('/admin');
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                        active
                          ? 'bg-white text-primary-700 shadow-sm'
                          : 'text-primary-100 hover:bg-primary-600'
                      }`}
                    >
                      {link.icon} {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-primary-600 px-3 py-1.5 rounded-full">
                <FaUserCircle className="text-primary-100" />
                <span className="text-sm font-medium text-white">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 text-sm text-primary-100 hover:text-white px-3 py-2 rounded-lg hover:bg-primary-600 transition"
              >
                <FaSignOutAlt /> Logout
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-white text-xl"
              >
                {menuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden py-4 space-y-1 border-t border-primary-600">
              {adminLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 py-2 px-3 text-primary-100 hover:bg-primary-600 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
              <hr className="my-2 border-primary-600" />
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-3 text-red-200 hover:bg-primary-600 rounded-lg"
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // ==================
  // USER NAVBAR (Logged in passenger)
  // ==================
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <FaPlane className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold text-gray-900">AeroLink</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition ${
                isActive('/')
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/flights"
              className={`text-sm font-medium transition ${
                isActive('/flights')
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              Search Flights
            </Link>
            <Link
              to="/my-bookings"
              className={`text-sm font-medium transition ${
                isActive('/my-bookings')
                  ? 'text-primary-600'
                  : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              My Bookings
            </Link>
          </div>

          <div className="hidden md:block relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-primary-600 text-xl" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 leading-tight">
                  {user?.name?.split(' ')[0]}
                </div>
                <div className="text-xs text-gray-500 leading-tight">
                  Passenger
                </div>
              </div>
              <FaChevronDown
                className={`text-gray-400 text-xs transition-transform ${
                  userMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <Link
                  to="/my-bookings"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <FaBook className="text-gray-400" /> My Bookings
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <FaUser className="text-gray-400" /> Profile
                </Link>
                <hr className="my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-700 text-xl"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-gray-100">
            <Link
              to="/"
              className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/flights"
              className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Search Flights
            </Link>
            <Link
              to="/my-bookings"
              className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              My Bookings
            </Link>
            <Link
              to="/profile"
              className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
            <hr className="my-2" />
            <button
              onClick={handleLogout}
              className="block w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;