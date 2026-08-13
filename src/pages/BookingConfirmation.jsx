import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await bookingService.getBookingById(bookingId);
        setBooking(response.data.booking);
      } catch (error) {
        setError('Failed to load booking details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await bookingService.cancelBooking(bookingId, 'Cancelled by user');
      alert('Booking cancelled successfully');
      navigate('/my-bookings');
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

  if (error || !booking) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error || 'Booking not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h1>
            <p className="text-gray-600 mt-2">
              Your flight has been booked successfully
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-600">Booking Reference (PNR)</div>
              <div className="text-2xl font-bold text-primary-600">
                {booking.bookingReference}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Passenger</div>
                <div className="font-medium">
                  {booking.passengers.map(p => p.name).join(', ')}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="font-bold text-primary-600">${booking.totalAmount}</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="text-sm text-gray-600">Flight Details</div>
              <div className="font-medium">{booking.flightId.flightNumber} - {booking.flightId.airline}</div>
              <div className="text-sm text-gray-600">
                {booking.flightId.origin.code} → {booking.flightId.destination.code}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(booking.flightId.departureTime).toLocaleString()}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="text-sm text-gray-600">Status</div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <Link to="/my-bookings" className="flex-1 btn-secondary text-center">
              My Bookings
            </Link>
            {booking.status !== 'cancelled' && (
              <button
                onClick={handleCancelBooking}
                className="flex-1 btn-danger"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;