import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaCheckCircle,
  FaPlane,
  FaUser,
  FaCalendarAlt,
  FaChair,
  FaPrint,
  FaDownload,
  FaTimes,
  FaArrowRight
} from 'react-icons/fa';
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md';
import { bookingService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await bookingService.getBookingById(bookingId);
        setBooking(response.data.booking);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this booking? This action cannot be undone.'
      )
    ) {
      return;
    }

    setCancelling(true);
    try {
      await bookingService.cancelBooking(bookingId, 'Cancelled by user');
      alert('Booking cancelled successfully');
      navigate('/my-bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner />;

  if (error || !booking) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4">
          {error || 'Booking not found'}
        </div>
        <Link to="/my-bookings" className="btn-primary inline-block">
          My Bookings
        </Link>
      </div>
    );
  }

  const flight = booking.flightId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        {/* Success Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your flight has been booked successfully. Please save your PNR.
          </p>
        </div>

        {/* PNR Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 text-white mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <div className="text-sm text-primary-100 mb-1">
                Booking Reference (PNR)
              </div>
              <div className="text-4xl font-bold tracking-wider">
                {booking.bookingReference}
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-sm text-primary-100 mb-1">Status</div>
              <div className="text-xl font-semibold capitalize">
                {booking.status}
              </div>
            </div>
          </div>
        </div>

        {/* Flight Details Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaPlane className="text-primary-600" /> Flight Details
          </h2>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <div className="text-2xl font-bold text-primary-600">
                {flight.flightNumber}
              </div>
              <div className="text-gray-600">{flight.airline}</div>
            </div>
            <div className="text-sm text-gray-500">
              {flight.duration} · Non-stop
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <MdFlightTakeoff /> Departure
              </div>
              <div className="text-xl font-bold">
                {new Date(flight.departureTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
              <div className="text-sm text-gray-600">
                {flight.origin.code} - {flight.origin.city}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(flight.departureTime).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            <div className="flex-1 flex justify-center">
              <FaArrowRight className="text-primary-600 text-2xl" />
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-xs text-gray-500 mb-1">
                <MdFlightLand /> Arrival
              </div>
              <div className="text-xl font-bold">
                {new Date(flight.arrivalTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </div>
              <div className="text-sm text-gray-600">
                {flight.destination.code} - {flight.destination.city}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(flight.arrivalTime).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Details Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaUser className="text-primary-600" /> Passenger Details
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-600">
                    #
                  </th>
                  <th className="text-left py-2 font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left py-2 font-medium text-gray-600">
                    Age
                  </th>
                  <th className="text-left py-2 font-medium text-gray-600">
                    Gender
                  </th>
                  <th className="text-left py-2 font-medium text-gray-600">
                    Class
                  </th>
                  <th className="text-left py-2 font-medium text-gray-600">
                    Seat
                  </th>
                </tr>
              </thead>
              <tbody>
                {booking.passengers.map((p, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 text-gray-500">{i + 1}</td>
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3">{p.age}</td>
                    <td className="py-3">{p.gender}</td>
                    <td className="py-3 capitalize">
                      {p.class === 'firstClass' ? 'First Class' : p.class}
                    </td>
                    <td className="py-3">
                      {p.seatNumber || (
                        <span className="text-gray-400 text-xs">TBA</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Passengers</span>
              <span className="font-medium">{booking.passengers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fare per passenger</span>
              <span className="font-medium">
                ${(booking.totalAmount / booking.passengers.length).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base">
              <span className="font-semibold">Total Amount</span>
              <span className="font-bold text-primary-600 text-xl">
                ${booking.totalAmount}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-600">Payment Status</span>
              <span
                className={`font-medium capitalize ${
                  booking.paymentStatus === 'completed'
                    ? 'text-green-600'
                    : 'text-yellow-600'
                }`}
              >
                {booking.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={handlePrint}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <FaPrint /> Print Ticket
            </button>
            <Link
              to="/my-bookings"
              className="btn-primary flex items-center justify-center gap-2"
            >
              My Bookings <FaArrowRight />
            </Link>
            {booking.status !== 'cancelled' && (
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="btn-danger flex items-center justify-center gap-2"
              >
                <FaTimes /> {cancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;