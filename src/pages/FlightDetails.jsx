import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaPlane,
  FaClock,
  FaChair,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md';
import { flightService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState('economy');

  const formatPrice = (value) =>
    '₹' + Number(value || 0).toLocaleString('en-IN');

  useEffect(() => {
    const loadFlight = async () => {
      try {
        const response = await flightService.getFlightById(id);
        setFlight(response.data.flight);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load flight details');
      } finally {
        setLoading(false);
      }
    };

    loadFlight();
  }, [id]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-green-100 text-green-700',
      delayed: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-gray-100 text-gray-700'
    };
    return (
      <span
        className={`px-4 py-1.5 rounded-full text-sm font-medium ${
          styles[status] || styles.scheduled
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) return <LoadingSpinner />;

  if (error || !flight) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4">
          {error || 'Flight not found'}
        </div>
        <Link to="/search" className="btn-primary inline-block">
          Back to Search
        </Link>
      </div>
    );
  }

  const selectedFare = flight.fare[selectedClass];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-primary-600 transition"
        >
          <FaArrowLeft /> Back to Results
        </button>

        {/* Flight Header Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl shadow-lg p-6 text-white mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <FaPlane className="text-3xl" />
              </div>
              <div>
                <div className="text-sm text-primary-100">Flight</div>
                <div className="text-3xl font-bold">{flight.flightNumber}</div>
                <div className="text-primary-100">{flight.airline}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-primary-100 mb-1">Status</div>
              {getStatusBadge(flight.status)}
            </div>
          </div>
        </div>

        {/* Route Visual Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Flight Route
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Departure */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary-600 mb-2">
                <MdFlightTakeoff className="text-xl" />
                <span className="text-sm font-medium">Departure</span>
              </div>
              <div className="text-4xl font-bold text-gray-800">
                {formatTime(flight.departureTime)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDate(flight.departureTime)}
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-primary-600">
                  {flight.origin.code}
                </div>
                <div className="text-sm text-gray-600">
                  {flight.origin.city}
                </div>
                <div className="text-xs text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1">
                  <FaMapMarkerAlt /> {flight.origin.airport}
                </div>
              </div>
            </div>

            {/* Duration Middle */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FaClock /> {flight.duration}
              </div>
              <div className="w-32 h-0.5 bg-gray-300 my-2 relative">
                <FaPlane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-600 bg-white px-1" />
              </div>
              <div className="text-xs text-gray-500">Non-stop</div>
            </div>

            {/* Arrival */}
            <div className="flex-1 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2 text-primary-600 mb-2">
                <MdFlightLand className="text-xl" />
                <span className="text-sm font-medium">Arrival</span>
              </div>
              <div className="text-4xl font-bold text-gray-800">
                {formatTime(flight.arrivalTime)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {formatDate(flight.arrivalTime)}
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-primary-600">
                  {flight.destination.code}
                </div>
                <div className="text-sm text-gray-600">
                  {flight.destination.city}
                </div>
                <div className="text-xs text-gray-500 flex items-center justify-center md:justify-end gap-1 mt-1">
                  <FaMapMarkerAlt /> {flight.destination.airport}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Aircraft and Seats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaChair className="text-primary-600" /> Seat Availability
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Total Seats</span>
                <span className="font-medium">{flight.totalSeats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Available</span>
                <span className="font-medium text-green-600">
                  {flight.availableSeats}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-sm">Booked</span>
                <span className="font-medium text-red-600">
                  {flight.totalSeats - flight.availableSeats}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${(flight.availableSeats / flight.totalSeats) * 100}%`
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                {Math.round(
                  (flight.availableSeats / flight.totalSeats) * 100
                )}% seats available
              </div>
            </div>
          </div>

          {/* Timing */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaClock className="text-primary-600" /> Schedule
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-gray-600 text-xs mb-1">Departure</div>
                <div className="font-medium">
                  {formatTime(flight.departureTime)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(flight.departureTime)}
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="text-gray-600 text-xs mb-1">Arrival</div>
                <div className="font-medium">
                  {formatTime(flight.arrivalTime)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(flight.arrivalTime)}
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="text-gray-600 text-xs mb-1">Duration</div>
                <div className="font-medium">{flight.duration}</div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-primary-600" /> Amenities
            </h3>
            <div className="space-y-2">
              {[
                'Free cancellation',
                'In-flight meal',
                'Carry-on baggage',
                'Wi-Fi available',
                'USB charging'
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <FaCheckCircle className="text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fare Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Select Your Fare Class
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'economy',
                label: 'Economy',
                description: 'Standard seating and service'
              },
              {
                id: 'business',
                label: 'Business',
                description: 'Premium seating and priority boarding'
              },
              {
                id: 'firstClass',
                label: 'First Class',
                description: 'Luxury seating with full service'
              }
            ].map((cls) => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`text-left p-4 rounded-xl border-2 transition ${
                  selectedClass === cls.id
                    ? 'border-primary-600 bg-primary-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">
                    {cls.label}
                  </span>
                  {selectedClass === cls.id && (
                    <FaCheckCircle className="text-primary-600" />
                  )}
                </div>
                <div className="text-2xl font-bold text-primary-600 mb-2">
                  {formatPrice(flight.fare[cls.id])}
                </div>
                <div className="text-xs text-gray-500">{cls.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Booking Summary Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 sticky bottom-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-gray-500">Selected Class</div>
                <div className="font-semibold capitalize">
                  {selectedClass === 'firstClass' ? 'First Class' : selectedClass}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Fare per passenger</div>
                <div className="text-3xl font-bold text-primary-600">
                  {formatPrice(selectedFare)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Seats Available</div>
                <div className="font-semibold text-green-600">
                  {flight.availableSeats}
                </div>
              </div>
            </div>

            <Link
              to={`/booking/${flight._id}?class=${selectedClass}`}
              className="btn-primary py-3 px-8 text-lg flex items-center gap-2"
            >
              Book This Flight <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;