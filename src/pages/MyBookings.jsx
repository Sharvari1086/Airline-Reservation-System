import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlane,
  FaCalendarAlt,
  FaArrowRight,
  FaSearch,
  FaTimesCircle,
  FaExchangeAlt,
  FaBook
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const { isAuthenticated } = useAuth();

  const formatPrice = (value) =>
    '₹' + Number(value || 0).toLocaleString('en-IN');

  const loadBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data.bookings || []);
      setFiltered(response.data.bookings || []);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (filter === 'all') {
      setFiltered(bookings);
    } else {
      setFiltered(bookings.filter((b) => b.status === filter));
    }
  }, [filter, bookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(bookingId, 'Cancelled by user');
      toast.success('Booking cancelled successfully');
      setBookings(
        bookings.map((b) =>
          b._id === bookingId
            ? { ...b, status: 'cancelled', cancellationDate: new Date() }
            : b
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const canReschedule = (booking) => {
    if (booking.status !== 'confirmed') return false;
    if (!booking.flightId) return false;
    const hours =
      (new Date(booking.flightId.departureTime).getTime() - Date.now()) /
      (1000 * 60 * 60);
    return hours > 24;
  };

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaBook className="text-primary-600" /> My Bookings
            </h1>
            <p className="text-gray-600">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/flights"
            className="btn-primary mt-4 md:mt-0 flex items-center gap-2"
          >
            <FaSearch /> Book New Flight
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'all', label: 'All' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'pending', label: 'Pending' },
            { id: 'cancelled', label: 'Cancelled' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaPlane className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Bookings Found
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all'
                ? "You haven't made any bookings yet."
                : `No ${filter} bookings.`}
            </p>
            <Link to="/flights" className="btn-primary inline-block">
              Search Flights
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const flight = booking.flightId;
              if (!flight) return null;

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3 flex-wrap">
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
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                        {booking.status === 'cancelled' &&
                          booking.cancellationDate && (
                            <span className="text-xs text-gray-500">
                              Cancelled on{' '}
                              {new Date(
                                booking.cancellationDate
                              ).toLocaleDateString('en-IN')}
                            </span>
                          )}
                      </div>

                      <div className="flex items-center gap-4 text-sm mb-2">
                        <div>
                          <div className="font-bold">
                            {flight.origin.code}
                          </div>
                          <div className="text-xs text-gray-500">
                            {flight.origin.city}
                          </div>
                        </div>
                        <FaArrowRight className="text-gray-400" />
                        <div>
                          <div className="font-bold">
                            {flight.destination.code}
                          </div>
                          <div className="text-xs text-gray-500">
                            {flight.destination.city}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {new Date(flight.departureTime).toLocaleDateString(
                            'en-IN'
                          )}
                        </span>
                        <span>PNR: {booking.bookingReference}</span>
                        <span>
                          {booking.passengers.length} passenger
                          {booking.passengers.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between md:min-w-[160px]">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Total</div>
                        <div className="text-2xl font-bold text-primary-600">
                          {formatPrice(booking.totalAmount)}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full mt-2">
                        <Link
                          to={`/confirmation/${booking._id}`}
                          className="btn-secondary text-sm text-center"
                        >
                          View Details
                        </Link>

                        {canReschedule(booking) && (
                          <Link
                            to={`/reschedule/${booking._id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <FaExchangeAlt /> Reschedule
                          </Link>
                        )}

                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <FaTimesCircle /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;