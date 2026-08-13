import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlane, 
  FaArrowRight, 
  FaCalendarAlt, 
  FaClock,
  FaUsers,
  FaMoneyBillWave,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { adminService } from '../services/api';

const AddFlight = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    flightNumber: '',
    airline: '',
    origin: {
      city: '',
      airport: '',
      code: ''
    },
    destination: {
      city: '',
      airport: '',
      code: ''
    },
    departureTime: '',
    arrivalTime: '',
    duration: '',
    totalSeats: '',
    availableSeats: '',
    fare: {
      economy: '',
      business: '',
      firstClass: ''
    },
    status: 'scheduled'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.flightNumber || !formData.airline) {
        throw new Error('Flight number and airline are required');
      }
      
      if (!formData.origin.code || !formData.destination.code) {
        throw new Error('Origin and destination codes are required');
      }
      
      if (!formData.departureTime || !formData.arrivalTime) {
        throw new Error('Departure and arrival times are required');
      }

      // Prepare data for API
      const flightData = {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        availableSeats: Number(formData.availableSeats),
        fare: {
          economy: Number(formData.fare.economy),
          business: Number(formData.fare.business),
          firstClass: Number(formData.fare.firstClass)
        }
      };

      const response = await adminService.addFlight(flightData);
      
      setSuccess(`Flight ${response.data.flight.flightNumber} added successfully!`);
      setFormData({
        flightNumber: '',
        airline: '',
        origin: { city: '', airport: '', code: '' },
        destination: { city: '', airport: '', code: '' },
        departureTime: '',
        arrivalTime: '',
        duration: '',
        totalSeats: '',
        availableSeats: '',
        fare: { economy: '', business: '', firstClass: '' },
        status: 'scheduled'
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/admin/manage-flights');
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to add flight');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FaPlane className="text-3xl text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-800">Add New Flight</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <span className="text-lg">❌</span>
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <span className="text-lg">✅</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Flight Number & Airline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Flight Number *
                </label>
                <input
                  type="text"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., AI101"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Airline *
                </label>
                <input
                  type="text"
                  name="airline"
                  value={formData.airline}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g., Air India"
                  required
                />
              </div>
            </div>

            {/* Origin */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaPlane className="text-primary-600" /> Origin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="origin.city"
                    value={formData.origin.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="New York"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Airport *
                  </label>
                  <input
                    type="text"
                    name="origin.airport"
                    value={formData.origin.airport}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="JFK Airport"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Code *
                  </label>
                  <input
                    type="text"
                    name="origin.code"
                    value={formData.origin.code}
                    onChange={handleChange}
                    className="input-field uppercase"
                    placeholder="JFK"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaArrowRight className="text-primary-600" /> Destination
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="destination.city"
                    value={formData.destination.city}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Los Angeles"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Airport *
                  </label>
                  <input
                    type="text"
                    name="destination.airport"
                    value={formData.destination.airport}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="LAX Airport"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Code *
                  </label>
                  <input
                    type="text"
                    name="destination.code"
                    value={formData.destination.code}
                    onChange={handleChange}
                    className="input-field uppercase"
                    placeholder="LAX"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Departure & Arrival */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <FaCalendarAlt className="inline mr-1" /> Departure Time *
                </label>
                <input
                  type="datetime-local"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="input-field"
                  min={today}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <FaCalendarAlt className="inline mr-1" /> Arrival Time *
                </label>
                <input
                  type="datetime-local"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  className="input-field"
                  min={today}
                  required
                />
              </div>
            </div>

            {/* Duration & Seats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <FaClock className="inline mr-1" /> Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="3h 30m"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <FaUsers className="inline mr-1" /> Total Seats *
                </label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="180"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Available Seats *
                </label>
                <input
                  type="number"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="150"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Fares */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaMoneyBillWave className="text-primary-600" /> Fares (USD)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Economy *
                  </label>
                  <input
                    type="number"
                    name="fare.economy"
                    value={formData.fare.economy}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="299"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Business *
                  </label>
                  <input
                    type="number"
                    name="fare.business"
                    value={formData.fare.business}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="599"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Class *
                  </label>
                  <input
                    type="number"
                    name="fare.firstClass"
                    value={formData.fare.firstClass}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="999"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="scheduled">Scheduled</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Adding Flight...'
                ) : (
                  <>
                    <FaSave /> Add Flight
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFlight;