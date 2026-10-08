import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FaUser,
  FaPlane,
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaChair,
  FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { flightService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SeatMap from '../components/SeatMap';

const BookingPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'Male' }
  ]);

  const urlParams = new URLSearchParams(location.search);
  const initialClass = urlParams.get('class') || 'economy';
  const [seatClass, setSeatClass] = useState(initialClass);

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showSeatMap, setShowSeatMap] = useState(false);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const flightResponse = await flightService.getFlightById(flightId);
        setFlight(flightResponse.data.flight);

        // Fetch booked seats from database
        try {
          const seatsResponse = await bookingService.getBookedSeats(flightId);
          setBookedSeats(seatsResponse.data.bookedSeats || []);
        } catch (seatErr) {
          console.error('Failed to load booked seats:', seatErr);
          setBookedSeats([]);
        }
      } catch (err) {
        setError('Failed to load flight details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [flightId, isAuthenticated, navigate]);

  // Reset selected seats when class changes
  useEffect(() => {
    setSelectedSeats([]);
  }, [seatClass]);

  // Keep seat selections in sync with passenger count
  useEffect(() => {
    if (selectedSeats.length > passengers.length) {
      setSelectedSeats(selectedSeats.slice(0, passengers.length));
    }
  }, [passengers.length, selectedSeats]);

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);

    if (validationErrors[index]) {
      const newErrors = [...validationErrors];
      newErrors[index] = null;
      setValidationErrors(newErrors);
    }
  };

  const addPassenger = () => {
    if (passengers.length < 5) {
      setPassengers([...passengers, { name: '', age: '', gender: 'Male' }]);
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
      setSelectedSeats(selectedSeats.filter((_, i) => i !== index));
    }
  };

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
      return;
    }

    if (selectedSeats.length >= passengers.length) {
      toast.info(
        `You have ${passengers.length} passenger${
          passengers.length !== 1 ? 's' : ''
        }. Deselect a seat first or add a passenger.`
      );
      return;
    }

    setSelectedSeats([...selectedSeats, seatId]);
  };

  const validatePassengers = () => {
    const errors = [];
    let valid = true;

    passengers.forEach((p, i) => {
      const err = {};
      if (!p.name.trim() || p.name.trim().length < 2) {
        err.name = 'Name must be at least 2 characters';
        valid = false;
      }
      const ageNum = Number(p.age);
      if (!p.age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        err.age = 'Age must be between 1 and 120';
        valid = false;
      }
      errors[i] = err;
    });

    setValidationErrors(errors);

    if (!valid) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return valid;
  };

  const handleBooking = async () => {
    setError('');

    if (!validatePassengers()) {
      setError('Please fix the errors in the passenger details');
      return;
    }

    setBookingLoading(true);

    try {
      const cleanedPassengers = passengers.map((p, i) => ({
        name: p.name.trim(),
        age: Number(p.age),
        gender: p.gender,
        seatNumber: selectedSeats[i] || null
      }));

      const bookingData = {
        flightId,
        passengers: cleanedPassengers,
        seatClass
      };

      const response = await bookingService.createPendingBooking(bookingData);
      toast.success('Booking created. Proceeding to payment.');
      navigate(`/payment/${response.data.booking._id}`);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Booking failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error && !flight) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4">
          {error}
        </div>
        <Link to="/search" className="btn-primary inline-block">
          Back to Search
        </Link>
      </div>
    );
  }

  const getFare = () => flight.fare[seatClass] || flight.fare.economy;
  const totalAmount = getFare() * passengers.length;
  const formatPrice = (v) => '₹' + Number(v || 0).toLocaleString('en-IN');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-primary-600 transition"
        >
          <FaArrowLeft /> Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Complete Your Booking
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Passenger Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaUser className="text-primary-600" /> Passenger Details
              </h2>

              <p className="text-sm text-gray-600 mb-4">
                All fields are required. Name must be at least 2 characters.
                Age must be between 1 and 120.
              </p>

              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="border-b last:border-b-0 border-gray-200 pb-5 mb-5 last:pb-0 last:mb-0"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800">
                      Passenger {index + 1}
                      {selectedSeats[index] && (
                        <span className="ml-3 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                          Seat {selectedSeats[index]}
                        </span>
                      )}
                    </h3>
                    {passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(index)}
                        className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <FaTrash /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={passenger.name}
                        onChange={(e) =>
                          handlePassengerChange(index, 'name', e.target.value)
                        }
                        className={`input-field ${
                          validationErrors[index]?.name ? 'border-red-400' : ''
                        }`}
                        placeholder="John Doe"
                      />
                      {validationErrors[index]?.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {validationErrors[index].name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Age
                      </label>
                      <input
                        type="number"
                        value={passenger.age}
                        onChange={(e) =>
                          handlePassengerChange(index, 'age', e.target.value)
                        }
                        className={`input-field ${
                          validationErrors[index]?.age ? 'border-red-400' : ''
                        }`}
                        placeholder="25"
                        min="1"
                        max="120"
                      />
                      {validationErrors[index]?.age && (
                        <p className="text-xs text-red-500 mt-1">
                          {validationErrors[index].age}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Gender
                      </label>
                      <div className="flex gap-3">
                        {['Male', 'Female', 'Other'].map((gender) => (
                          <button
                            key={gender}
                            type="button"
                            onClick={() =>
                              handlePassengerChange(index, 'gender', gender)
                            }
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${
                              passenger.gender === gender
                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {gender}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {passengers.length < 5 && (
                <button
                  type="button"
                  onClick={addPassenger}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                  <FaPlus /> Add Another Passenger
                </button>
              )}

              <p className="text-xs text-gray-500 mt-4">
                Maximum 5 passengers per booking
              </p>
            </div>

            {/* Seat Class Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaChair className="text-primary-600" /> Select Seat Class
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.keys(flight.fare).map((cls) => {
                  const label =
                    cls === 'firstClass'
                      ? 'First Class'
                      : cls.charAt(0).toUpperCase() + cls.slice(1);
                  const isSelected = seatClass === cls;

                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSeatClass(cls)}
                      className={`text-left p-4 rounded-xl border-2 transition ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">
                          {label}
                        </span>
                        {isSelected && (
                          <FaCheckCircle className="text-primary-600" />
                        )}
                      </div>
                      <div className="text-xl font-bold text-primary-600">
                        {formatPrice(flight.fare[cls])}
                      </div>
                      <div className="text-xs text-gray-500">
                        per passenger
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Seat Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FaChair className="text-primary-600" /> Seat Selection
                </h2>
                <button
                  type="button"
                  onClick={() => setShowSeatMap(!showSeatMap)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showSeatMap ? 'Hide Seat Map' : 'Choose Seats'}
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Optional. If you skip this, seats will be assigned at check-in.
                {bookedSeats.length > 0 && (
                  <span className="ml-1 text-red-600">
                    ({bookedSeats.length} seats already taken)
                  </span>
                )}
              </p>

              {showSeatMap && (
                <SeatMap
                  totalSeats={Math.min(flight.totalSeats, 60)}
                  seatClass={seatClass}
                  selectedSeats={selectedSeats}
                  bookedSeats={bookedSeats}
                  onSeatClick={handleSeatClick}
                  maxSelectable={passengers.length}
                />
              )}

              {!showSeatMap && selectedSeats.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      Seat {seat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaPlane className="text-primary-600" /> Booking Summary
              </h2>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Flight</div>
                  <div className="font-medium">
                    {flight.flightNumber} - {flight.airline}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Route</div>
                  <div className="font-medium">
                    {flight.origin.code} → {flight.destination.code}
                  </div>
                  <div className="text-xs text-gray-500">
                    {flight.origin.city} to {flight.destination.city}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Departure</div>
                  <div className="text-sm font-medium">
                    {new Date(flight.departureTime).toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="text-sm font-medium">{flight.duration}</div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Passengers</span>
                    <span className="font-medium">{passengers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Class</span>
                    <span className="font-medium capitalize">
                      {seatClass === 'firstClass' ? 'First Class' : seatClass}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">
                      Fare per passenger
                    </span>
                    <span className="font-medium">
                      {formatPrice(getFare())}
                    </span>
                  </div>
                  {selectedSeats.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Seats</span>
                      <span className="font-medium text-sm">
                        {selectedSeats.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(totalAmount)}
                  </span>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="w-full btn-primary py-3 text-lg mt-4 flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    `Continue to Payment ${formatPrice(totalAmount)}`
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-3">
                  By continuing you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;