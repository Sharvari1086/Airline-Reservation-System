import React, { useState, useEffect } from 'react';
import {
  FaUsers,
  FaSearch,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaBook,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave
} from 'react-icons/fa';
import { adminService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const formatPrice = (v) => '₹' + Number(v || 0).toLocaleString('en-IN');

  const loadUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      setUsers(response.data.users || []);
      setFiltered(response.data.users || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let list = [...users];

    if (roleFilter !== 'all') {
      list = list.filter((u) => u.role === roleFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q)
      );
    }

    setFiltered(list);
  }, [search, roleFilter, users]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const passengerCount = users.filter((u) => u.role === 'user').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaUsers className="text-primary-600" /> System Users
          </h1>
          <p className="text-gray-600">
            {users.length} total users ({passengerCount} passengers, {adminCount}{' '}
            admins)
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 space-y-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Users' },
              { id: 'user', label: 'Passengers' },
              { id: 'admin', label: 'Admins' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setRoleFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  roleFilter === f.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
            <span className="ml-auto text-sm text-gray-500 self-center">
              Showing {filtered.length} of {users.length}
            </span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Users Found
            </h3>
            <p className="text-gray-500">Try changing the filter or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUserCircle className="text-primary-600 text-3xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">
                      {user.name}
                    </div>
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user.role === 'admin' ? 'Admin' : 'Passenger'}
                    </span>
                  </div>
                </div>

                {/* Contact */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaEnvelope className="text-gray-400 text-xs flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaPhone className="text-gray-400 text-xs flex-shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <FaCalendarAlt className="flex-shrink-0" />
                    <span>
                      Joined{' '}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-IN')
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Booking Stats */}
                {user.role === 'user' && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-gray-600">
                        <FaBook className="text-gray-400" /> Bookings
                      </span>
                      <span className="font-bold text-gray-800">
                        {user.totalBookings || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-green-600">
                        <FaCheckCircle /> Confirmed
                      </span>
                      <span className="font-bold text-green-600">
                        {user.confirmedBookings || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-red-600">
                        <FaTimesCircle /> Cancelled
                      </span>
                      <span className="font-bold text-red-600">
                        {user.cancelledBookings || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-t pt-2">
                      <span className="flex items-center gap-1 text-gray-600">
                        <FaMoneyBillWave className="text-gray-400" /> Spent
                      </span>
                      <span className="font-bold text-primary-600">
                        {formatPrice(user.totalSpent)}
                      </span>
                    </div>
                  </div>
                )}

                {user.role === 'admin' && (
                  <div className="bg-purple-50 rounded-lg p-3 text-xs text-purple-700 text-center">
                    System Administrator
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;