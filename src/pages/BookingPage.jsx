import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flightService, bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const BookingPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passengers, setPassengers] = useState([
    { name: '', age: '', gender: 'Male' }
  ]);
  const [seatClass, setSeatClass] = useState('economy');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadFlight = async () => {
      try {
        const response = await flightService.getFlightById(flightId);
        setFlight(response.data.flight);
      } catch (error) {
        setError('Failed to load flight details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadFlight();
  }, [flightId, isAuthenticated, navigate]);

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const addPassenger = () => {
    if (passengers.length < 5) {
      setPassengers([...passengers, { name: '', age: '', gender: 'Male' }]);
    }
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const handleBooking = async () => {
    // Validate
    for (let p of passengers) {
      if (!p.name || !p.age) {
        alert('Please fill all passenger details');
        return;
      }
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        flightId,
        passengers,
        seatClass
      };

      const response = await bookingService.createBooking(bookingData);
      navigate(`/confirmation/${response.data.booking._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error || 'Flight not found'}
        </div>
      </div>
    );
  }

  const getFare = () => {
    return flight.fare[seatClass] || flight.fare.economy;
  };

  const totalAmount = getFare() * passengers.length;

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Complete Your Booking</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
            
            {passengers.map((passenger, index) => (
              <div key={index} className="border-b last:border-b-0 border-gray-200 pb-4 mb-4 last:pb-0 last:mb-0">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Passenger {index + 1}</h3>
                  {passengers.length > 1 && (
                    <button
                      onClick={() => removePassenger(index)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={passenger.name}
                      onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                      className="input-field"
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={passenger.age}
                      onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                      className="input-field"
                      placeholder="Age"
                      min="1"
                      max="120"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={passenger.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                      className="input-field"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {passengers.length < 5 && (
              <button                onClick={addPassenger}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                + Add Another Passenger
              </button>
            )}
          </div>

          <div className="card mt-6">
            <h2 className="text-xl font-semibold mb-4">Select Class</h2>
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(flight.fare).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSeatClass(cls)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    seatClass === cls
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium capitalize">{cls}</div>
                  <div className="text-sm text-gray-600">${flight.fare[cls]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div>
          <div className="card sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">Flight</div>
                <div className="font-medium">{flight.flightNumber} - {flight.airline}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Route</div>
                <div className="font-medium">
                  {flight.origin.code} → {flight.destination.code}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(flight.departureTime).toLocaleString()} - {new Date(flight.arrivalTime).toLocaleString()}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Passengers</div>
                <div className="font-medium">{passengers.length}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600">Class</div>
                <div className="font-medium capitalize">{seatClass}</div>
              </div>
              
              <div className="border-t pt-3">
                <div className="text-sm text-gray-600">Fare per passenger</div>
                <div className="font-medium">${getFare()}</div>
              </div>
              
              <div className="border-t pt-3">
                <div className="text-sm text-gray-600">Total Amount</div>
                <div className="text-2xl font-bold text-primary-600">${totalAmount}</div>
              </div>

              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full btn-primary py-3 text-lg mt-4"
              >
                {bookingLoading ? 'Processing...' : `Confirm Booking $${totalAmount}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;