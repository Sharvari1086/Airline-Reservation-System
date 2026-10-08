import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaArrowLeft,
  FaPlane,
  FaSearch,
  FaExchangeAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { bookingService, flightService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const RescheduleBooking = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [availableFlights, setAvailableFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [newDate, setNewDate] = useState('');

  const formatPrice = (v) => '₹' + Number(v || 0).toLocaleString('en-IN');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await bookingService.getBookingById(bookingId);
        setBooking(response.data.booking);
      } catch (err) {
        toast.error('Failed to load booking');
        navigate('/my-bookings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId, navigate]);

  const handleSearch = async () => {
    if (!newDate) return toast.error('Select a new date');

    setSearching(true);
    setSelectedFlight(null);
    try {
      const response = await flightService.searchFlights({
        origin: booking.flightId.origin.code,
        destination: booking.flightId.destination.code,
        date: newDate,
        class: booking.passengers[0].class || 'economy'
      });

      const filtered = (response.data.flights || []).filter(
        (f) => f._id !== booking.flightId._id
      );

      setAvailableFlights(filtered);

      if (filtered.length === 0) {
        toast.info('No other flights available on this date');
      }
    } catch (err) {
      toast.error('Failed to search flights');
    } finally {
      setSearching(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedFlight) return toast.error('Select a flight');

    if (
      !window.confirm(
        'Reschedule booking to this flight? Your old flight will be released.'
      )
    ) {
      return;
    }

    setRescheduling(true);
    try {
      await bookingService.rescheduleBooking(bookingId, selectedFlight._id);
      toast.success('Booking rescheduled successfully');
      setTimeout(() => navigate('/my-bookings'), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reschedule failed');
    } finally {
      setRescheduling(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!booking) return null;

  const flight = booking.flightId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-primary-600"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaExchangeAlt className="text-primary-600" /> Reschedule Booking
        </h1>

        {/* Current Booking */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Current Flight
          </h2>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-100 p-2 rounded-lg">
              <FaPlane className="text-primary-600" />
            </div>
            <div>
              <div className="font-bold text-primary-600">
                {flight.flightNumber}
              </div>
              <div className="text-xs text-gray-500">{flight.airline}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {flight.origin.code} → {flight.destination.code} on{' '}
            {new Date(flight.departureTime).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            PNR: {booking.bookingReference} | Total:{' '}
            {formatPrice(booking.totalAmount)}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a new date
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input-field"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="btn-primary flex items-center gap-2"
            >
              <FaSearch /> {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Results */}
        {availableFlights.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Available Flights on {new Date(newDate).toLocaleDateString('en-IN')}
            </h2>
            <div className="space-y-3">
              {availableFlights.map((f) => (
                <div
                  key={f._id}
                  onClick={() => setSelectedFlight(f)}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    selectedFlight?._id === f._id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-primary-600">
                        {f.flightNumber} - {f.airline}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(f.departureTime).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}{' '}
                        →{' '}
                        {new Date(f.arrivalTime).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {f.duration} · {f.availableSeats} seats
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary-600">
                        {formatPrice(f.selectedFare || f.fare?.economy)}
                      </div>
                      <div className="text-xs text-gray-500">
                        per passenger
                      </div>
                      {selectedFlight?._id === f._id && (
                        <FaCheckCircle className="text-primary-600 mt-2 ml-auto" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedFlight && (
              <button
                onClick={handleConfirm}
                disabled={rescheduling}
                className="w-full btn-primary py-3 mt-4"
              >
                {rescheduling
                  ? 'Rescheduling...'
                  : `Confirm Reschedule to ${selectedFlight.flightNumber}`}
              </button>
            )}
          </div>
        )}

        {availableFlights.length === 0 &&
          newDate &&
          !searching && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
              No other flights on this route for the selected date. Try a
              different date.
            </div>
          )}

        <div className="text-center mt-4">
          <Link to="/my-bookings" className="text-gray-500 hover:text-primary-600 text-sm">
            Cancel and go back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RescheduleBooking;