import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        setBookings(response.data.bookings);
      } catch (error) {
        setError('Failed to load bookings');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadBookings();
    }
  }, [isAuthenticated]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(bookingId, 'Cancelled by user');
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
      alert('Booking cancelled successfully');
    } catch (error) {
      alert('Failed to cancel booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <LoadingSpinner />
      </div>
    );
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
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No Bookings Yet
          </h3>
          <p className="text-gray-500">
            You haven't made any bookings yet. Start your journey with us!
          </p>
          <Link to="/" className="btn-primary inline-block mt-4">
            Search Flights
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-lg font-bold text-primary-600">
                      {booking.bookingReference}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-bold">{booking.flightId.flightNumber}</div>
                      <div className="text-sm text-gray-600">{booking.flightId.airline}</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {booking.flightId.origin.code} → {booking.flightId.destination.code}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(booking.flightId.departureTime).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    Passengers: {booking.passengers.map(p => p.name).join(', ')}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="font-bold text-primary-600">
                    ${booking.totalAmount}
                  </div>
                  <Link
                    to={`/confirmation/${booking._id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    View Details
                  </Link>
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;