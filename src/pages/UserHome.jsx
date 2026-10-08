import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlane,
  FaSearch,
  FaBook,
  FaUser,
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaTimesCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const UserHome = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    date: '',
    class: 'economy'
  });

  const formatPrice = (value) =>
    '₹' + Number(value || 0).toLocaleString('en-IN');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        setBookings(response.data.bookings || []);
      } catch (err) {
        console.error('Failed to load bookings', err);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleChange = (e) => {
    setSearchForm({ ...searchForm, [e.target.name]: e.target.value });
  };

  const today = new Date().toISOString().split('T')[0];

  const upcomingBookings = bookings
    .filter(
      (b) =>
        b.status === 'confirmed' &&
        b.flightId &&
        new Date(b.flightId.departureTime) > new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.flightId.departureTime) -
        new Date(b.flightId.departureTime)
    );

  const stats = {
    total: bookings.length,
    upcoming: upcomingBookings.length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length
  };

  const firstName = user?.name?.split(' ')[0] || 'Traveler';

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {firstName}!
              </h1>
              <p className="text-primary-100">
                Ready for your next adventure? Let's get you flying.
              </p>
            </div>
            <Link
              to="/flights"
              className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center gap-2 shadow-md"
            >
              <FaSearch /> Search Flights
            </Link>
          </div>
        </div>
      </section>

      <section className="container-custom -mt-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Quick Search
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              name="origin"
              value={searchForm.origin}
              onChange={handleChange}
              placeholder="From (JFK)"
              className="input-field uppercase"
              maxLength="3"
            />
            <input
              type="text"
              name="destination"
              value={searchForm.destination}
              onChange={handleChange}
              placeholder="To (LAX)"
              className="input-field uppercase"
              maxLength="3"
            />
            <input
              type="date"
              name="date"
              value={searchForm.date}
              onChange={handleChange}
              min={today}
              className="input-field"
            />
            <Link
              to={`/search?${new URLSearchParams(searchForm).toString()}`}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <FaSearch /> Search
            </Link>
          </div>
        </div>
      </section>

      <section className="container-custom mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Total Bookings</span>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBook className="text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Upcoming Flights</span>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaPlane className="text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {stats.upcoming}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Cancelled</span>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FaTimesCircle className="text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800">
              {stats.cancelled}
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FaTicketAlt className="text-primary-600" /> Upcoming Trips
          </h2>
          <Link
            to="/my-bookings"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View All <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : upcomingBookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPlane className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No upcoming trips
            </h3>
            <p className="text-gray-500 mb-6">
              Start planning your next journey by searching for flights.
            </p>
            <Link to="/flights" className="btn-primary inline-flex items-center gap-2">
              <FaSearch /> Find Flights
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingBookings.slice(0, 3).map((booking) => {
              const flight = booking.flightId;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <FaPlane className="text-primary-600" />
                        </div>
                        <div>
                          <div className="font-bold text-primary-600">
                            {flight.flightNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            {flight.airline}
                          </div>
                        </div>
                        <span className="ml-auto md:ml-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <div className="font-bold text-gray-800">
                            {flight.origin.code}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(flight.departureTime).toLocaleTimeString(
                              'en-IN',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              }
                            )}
                          </div>
                        </div>
                        <FaArrowRight className="text-gray-400" />
                        <div>
                          <div className="font-bold text-gray-800">
                            {flight.destination.code}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(flight.arrivalTime).toLocaleTimeString(
                              'en-IN',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {new Date(flight.departureTime).toLocaleDateString('en-IN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaMapMarkerAlt /> {booking.passengers.length}{' '}
                          passenger
                          {booking.passengers.length !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaTicketAlt /> PNR: {booking.bookingReference}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between md:min-w-[140px]">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Total</div>
                        <div className="text-xl font-bold text-primary-600">
                          {formatPrice(booking.totalAmount)}
                        </div>
                      </div>
                      <Link
                        to={`/confirmation/${booking._id}`}
                        className="btn-secondary text-sm mt-2"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="container-custom pb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/flights"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <FaSearch className="text-primary-600 text-xl" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">Search Flights</div>
              <div className="text-xs text-gray-500">
                Find your next destination
              </div>
            </div>
          </Link>

          <Link
            to="/my-bookings"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FaBook className="text-blue-600 text-xl" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">My Bookings</div>
              <div className="text-xs text-gray-500">
                View all your bookings
              </div>
            </div>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-primary-300 hover:shadow-md transition flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <FaUser className="text-purple-600 text-xl" />
            </div>
            <div>
              <div className="font-semibold text-gray-800">My Profile</div>
              <div className="text-xs text-gray-500">
                Manage your account
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UserHome;