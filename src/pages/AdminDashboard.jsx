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
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaRoute,
  FaUserCircle
} from 'react-icons/fa';
import { adminService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState(null);
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatPrice = (v) => '₹' + Number(v || 0).toLocaleString('en-IN');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reportRes, flightRes] = await Promise.all([
          adminService.getReports(),
          adminService.getFlightReports()
        ]);
        setReports(reportRes.data.reports);
        setFlightData(flightRes.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      loadData();
    }
  }, [user]);

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

  const totalBookings = reports?.totalBookings || 0;
  const confirmed = reports?.confirmedBookings || 0;
  const cancelled = reports?.cancelledBookings || 0;
  const confirmedPct =
    totalBookings > 0 ? Math.round((confirmed / totalBookings) * 100) : 0;
  const cancelledPct =
    totalBookings > 0 ? Math.round((cancelled / totalBookings) * 100) : 0;

  const topFlights = flightData?.topFlights || [];
  const popularRoutes = flightData?.popularRoutes || [];
  const flightReports = flightData?.flightReports || [];

  // Flights sorted by most bookings
  const flightsByBookings = [...flightReports]
    .sort((a, b) => b.totalBookings - a.totalBookings)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0 flex-wrap">
            <Link
              to="/admin/add-flight"
              className="btn-primary flex items-center gap-2"
            >
              <FaPlus /> Add Flight
            </Link>
            <Link
              to="/admin/manage-flights"
              className="btn-secondary flex items-center gap-2"
            >
              <FaList /> Manage Flights
            </Link>
          </div>
        </div>

        {/* Primary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">
                  {reports?.totalUsers || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Flights</p>
                <p className="text-3xl font-bold text-gray-800">
                  {reports?.totalFlights || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaPlane className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800">
                  {totalBookings}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaBook className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(reports?.totalRevenue)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                <span className="text-sm text-gray-600">Confirmed</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {confirmed}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${confirmedPct}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {confirmedPct}% of all bookings
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaTimesCircle className="text-red-600" />
                <span className="text-sm text-gray-600">Cancelled</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {cancelled}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{ width: `${cancelledPct}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {cancelledPct}% of all bookings
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FaMoneyBillWave className="text-primary-600" />
                <span className="text-sm text-gray-600">Avg. Booking</span>
              </div>
              <span className="text-xl font-bold text-primary-600">
                {formatPrice(confirmed > 0 ? reports.totalRevenue / confirmed : 0)}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Per confirmed booking
            </div>
          </div>
        </div>

        {/* Top Flights + Popular Routes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FaTrophy className="text-yellow-500" /> Top Flights
              </h2>
              <Link
                to="/admin/reports"
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                View Reports
              </Link>
            </div>
            {topFlights.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No flight data yet</p>
            ) : (
              <div className="space-y-3">
                {topFlights.map((f, i) => (
                  <div
                    key={f._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          i === 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : i === 1
                            ? 'bg-gray-200 text-gray-700'
                            : i === 2
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {f.flightNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          {f.origin.code} → {f.destination.code}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600 text-sm">
                        {formatPrice(f.revenue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {f.totalBookings} bookings
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FaRoute className="text-primary-600" /> Popular Routes
              </h2>
              <Link
                to="/admin/reports"
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                View Reports
              </Link>
            </div>
            {popularRoutes.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No route data yet</p>
            ) : (
              <div className="space-y-3">
                {popularRoutes.slice(0, 5).map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                        <FaPlane className="text-primary-600 text-sm" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {r.route}
                        </div>
                        <div className="text-xs text-gray-500">
                          {r.passengers} passengers
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-600">
                        {r.bookings}
                      </div>
                      <div className="text-xs text-gray-500">bookings</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Flights with Most Bookings */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FaBook className="text-primary-600" /> Flights with Most Bookings
            </h2>
            <Link
              to="/admin/bookings"
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Bookings
            </Link>
          </div>

          {flightsByBookings.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">No bookings yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 font-medium text-gray-600">
                      Flight
                    </th>
                    <th className="text-left py-2 font-medium text-gray-600">
                      Route
                    </th>
                    <th className="text-right py-2 font-medium text-gray-600">
                      Bookings
                    </th>
                    <th className="text-right py-2 font-medium text-gray-600">
                      Passengers
                    </th>
                    <th className="text-right py-2 font-medium text-gray-600">
                      Occupancy
                    </th>
                    <th className="text-right py-2 font-medium text-gray-600">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {flightsByBookings.map((f) => (
                    <tr
                      key={f._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3">
                        <div className="font-medium text-primary-600">
                          {f.flightNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          {f.airline}
                        </div>
                      </td>
                      <td className="py-3 text-gray-700">
                        {f.origin.code} → {f.destination.code}
                      </td>
                      <td className="py-3 text-right font-medium">
                        {f.totalBookings}
                      </td>
                      <td className="py-3 text-right font-medium">
                        {f.totalPassengers}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`font-medium ${
                            f.occupancyRate >= 75
                              ? 'text-green-600'
                              : f.occupancyRate >= 40
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {f.occupancyRate}%
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-primary-600">
                        {formatPrice(f.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/add-flight"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
                <FaPlus className="text-primary-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Add Flight</h3>
                <p className="text-xs text-gray-600">Create new flight</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/bookings"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                <FaBook className="text-orange-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Bookings</h3>
                <p className="text-xs text-gray-600">View by flight</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="bg-cyan-100 p-3 rounded-full flex-shrink-0">
                <FaUsers className="text-cyan-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Users</h3>
                <p className="text-xs text-gray-600">View all users</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/reports"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                <FaChartBar className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Reports</h3>
                <p className="text-xs text-gray-600">Analytics</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;