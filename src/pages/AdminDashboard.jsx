import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlus, 
  FaList, 
  FaUsers, 
  FaBook, 
  FaMoneyBillWave,
  FaPlane,
  FaChartBar,
  FaCog
} from 'react-icons/fa';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await adminService.getReports();
        setReports(response.data.reports);
      } catch (error) {
        console.error('Failed to load reports:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      loadReports();
    }
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link to="/admin/add-flight" className="btn-primary flex items-center gap-2">
              <FaPlus /> Add Flight
            </Link>
            <Link to="/admin/manage-flights" className="btn-secondary flex items-center gap-2">
              <FaList /> Manage Flights
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{reports?.totalUsers || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUsers className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-800">{reports?.totalBookings || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaBook className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Flights</p>
                <p className="text-2xl font-bold text-gray-800">{reports?.totalFlights || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaPlane className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${reports?.totalRevenue || 0}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/add-flight" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-full">
                <FaPlus className="text-primary-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Add New Flight</h3>
                <p className="text-sm text-gray-600">Create a new flight schedule</p>
              </div>
            </div>
          </Link>

          <Link to="/admin/manage-flights" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaList className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Manage Flights</h3>
                <p className="text-sm text-gray-600">Update or delete existing flights</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaChartBar className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">View Reports</h3>
                <p className="text-sm text-gray-600">Analytics and statistics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;