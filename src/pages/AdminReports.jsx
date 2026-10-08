import React, { useState, useEffect } from 'react';
import {
  FaChartBar,
  FaUsers,
  FaBook,
  FaPlane,
  FaMoneyBillWave,
  FaTrophy,
  FaRoute,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { adminService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [globalReports, setGlobalReports] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatPrice = (v) => '₹' + Number(v || 0).toLocaleString('en-IN');
  const formatShort = (v) => {
    if (v >= 10000000) return '₹' + (v / 10000000).toFixed(1) + 'Cr';
    if (v >= 100000) return '₹' + (v / 100000).toFixed(1) + 'L';
    if (v >= 1000) return '₹' + (v / 1000).toFixed(1) + 'K';
    return '₹' + v;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [flightRes, globalRes, trendsRes] = await Promise.all([
          adminService.getFlightReports(),
          adminService.getReports(),
          adminService.getBookingTrends()
        ]);
        setData(flightRes.data);
        setGlobalReports(globalRes.data.reports);
        setTrends(trendsRes.data.trends || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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

  const { summary, topFlights, popularRoutes, flightReports } = data;

  // ========== Chart Data Preparation ==========

  // 1. Status breakdown pie chart
  const totalBookings = flightReports.reduce(
    (s, f) => s + f.totalBookings,
    0
  );
  const totalConfirmed = flightReports.reduce((s, f) => s + f.confirmed, 0);
  const totalCancelled = flightReports.reduce((s, f) => s + f.cancelled, 0);
  const totalPending = Math.max(
    0,
    totalBookings - totalConfirmed - totalCancelled
  );

  const statusPieData = [
    { name: 'Confirmed', value: totalConfirmed },
    { name: 'Cancelled', value: totalCancelled },
    { name: 'Pending', value: totalPending }
  ].filter((d) => d.value > 0);

  // 2. Top flights bar chart
  const topFlightsChart = topFlights.map((f) => ({
    name: f.flightNumber,
    route: `${f.origin.code}-${f.destination.code}`,
    revenue: f.revenue,
    bookings: f.totalBookings
  }));

  // 3. Popular routes bar chart
  const routesChart = popularRoutes.slice(0, 6).map((r) => ({
    name: r.route,
    bookings: r.bookings,
    passengers: r.passengers
  }));

  // 4. Occupancy distribution bar chart
  const occupancyBuckets = {
    '0-25%': 0,
    '26-50%': 0,
    '51-75%': 0,
    '76-100%': 0
  };
  flightReports.forEach((f) => {
    const r = f.occupancyRate;
    if (r <= 25) occupancyBuckets['0-25%']++;
    else if (r <= 50) occupancyBuckets['26-50%']++;
    else if (r <= 75) occupancyBuckets['51-75%']++;
    else occupancyBuckets['76-100%']++;
  });
  const occupancyData = Object.entries(occupancyBuckets).map(
    ([range, count]) => ({ range, count })
  );

  // 5. Booking trend (last 30 days)
  const trendsChart = trends.map((t) => ({
    date: new Date(t.date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    }),
    bookings: t.bookings,
    revenue: t.revenue,
    cancelled: t.cancelled
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 text-xs">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="flex justify-between gap-3">
            <span>{entry.name}:</span>
            <span className="font-medium">
              {entry.dataKey === 'revenue'
                ? formatPrice(entry.value)
                : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaChartBar className="text-primary-600" /> Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Flight-wise bookings, revenue, and performance insights
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">
                  {globalReports?.totalUsers || 0}
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
                  {summary?.totalFlights || 0}
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
                  {summary?.totalBookings || 0}
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
                  {formatPrice(summary?.totalRevenue)}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Booking Trend Line Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaChartBar className="text-primary-600" /> Booking Trend (Last 30 Days)
          </h2>
          {trendsChart.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No booking data for the last 30 days
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendsChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  stroke="#6b7280"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Bookings"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Cancelled"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Row: Pie + Top Flights Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaBook className="text-primary-600" /> Booking Status
            </h2>
            {statusPieData.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No bookings yet
              </p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === 'Confirmed'
                              ? '#10b981'
                              : entry.name === 'Cancelled'
                              ? '#ef4444'
                              : '#f59e0b'
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                      <FaCheckCircle className="text-green-600" /> Confirmed
                    </div>
                    <div className="font-bold text-green-600">
                      {totalConfirmed}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
                      <FaTimesCircle className="text-red-600" /> Cancelled
                    </div>
                    <div className="font-bold text-red-600">
                      {totalCancelled}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-1">Pending</div>
                    <div className="font-bold text-yellow-600">
                      {totalPending}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Top Flights Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaTrophy className="text-yellow-500" /> Top Flights by Revenue
            </h2>
            {topFlightsChart.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topFlightsChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                    tickFormatter={formatShort}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="revenue"
                    fill="#10b981"
                    radius={[8, 8, 0, 0]}
                    name="Revenue"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Row: Popular Routes + Occupancy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Popular Routes Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaRoute className="text-primary-600" /> Popular Routes
            </h2>
            {routesChart.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={routesChart}
                  layout="vertical"
                  margin={{ left: 20, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    width={90}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="bookings"
                    fill="#3b82f6"
                    name="Bookings"
                    radius={[0, 8, 8, 0]}
                  />
                  <Bar
                    dataKey="passengers"
                    fill="#8b5cf6"
                    name="Passengers"
                    radius={[0, 8, 8, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Occupancy Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaPlane className="text-primary-600" /> Occupancy Distribution
            </h2>
            {flightReports.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                No flights yet
              </p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="range"
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="count"
                      name="Flights"
                      radius={[8, 8, 0, 0]}
                      fill="#f59e0b"
                    />
                  </BarChart>
                </ResponsiveContainer>

                <div className="text-xs text-gray-500 text-center mt-3">
                  Number of flights in each occupancy range
                </div>
              </>
            )}
          </div>
        </div>

        {/* Flight-wise Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FaPlane className="text-primary-600" /> Flight-wise Report
            </h2>
            <p className="text-sm text-gray-500">
              Complete booking and revenue data for every flight
            </p>
          </div>

          {flightReports.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No flights in the system yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Flight
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Route
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Departure
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                      Bookings
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                      Passengers
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                      Confirmed
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                      Cancelled
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                      Occupancy
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {flightReports.map((f) => (
                    <tr
                      key={f._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium text-primary-600">
                          {f.flightNumber}
                        </div>
                        <div className="text-xs text-gray-500">
                          {f.airline}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {f.origin.code} → {f.destination.code}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {new Date(f.departureTime).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {f.totalBookings}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {f.totalPassengers}
                      </td>
                      <td className="py-3 px-4 text-right text-green-600 font-medium">
                        {f.confirmed}
                      </td>
                      <td className="py-3 px-4 text-right text-red-600 font-medium">
                        {f.cancelled}
                      </td>
                      <td className="py-3 px-4 text-right">
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
                      <td className="py-3 px-4 text-right font-bold text-primary-600">
                        {formatPrice(f.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;