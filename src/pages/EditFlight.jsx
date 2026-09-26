import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaTimes, FaPlane } from 'react-icons/fa';
import { flightService, adminService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const EditFlight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const loadFlight = async () => {
      try {
        const response = await flightService.getFlightById(id);
        const flight = response.data.flight;

        const formatDateTime = (dateStr) => {
          const d = new Date(dateStr);
          const pad = (n) => String(n).padStart(2, '0');
          return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };

        setFormData({
          flightNumber: flight.flightNumber,
          airline: flight.airline,
          origin: {
            city: flight.origin.city,
            airport: flight.origin.airport,
            code: flight.origin.code
          },
          destination: {
            city: flight.destination.city,
            airport: flight.destination.airport,
            code: flight.destination.code
          },
          departureTime: formatDateTime(flight.departureTime),
          arrivalTime: formatDateTime(flight.arrivalTime),
          duration: flight.duration,
          totalSeats: flight.totalSeats,
          availableSeats: flight.availableSeats,
          fare: {
            economy: flight.fare.economy,
            business: flight.fare.business,
            firstClass: flight.fare.firstClass
          },
          status: flight.status
        });
      } catch (err) {
        setError('Failed to load flight');
      } finally {
        setLoading(false);
      }
    };

    loadFlight();
  }, [id]);

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
    setSaving(true);

    try {
      const payload = {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        availableSeats: Number(formData.availableSeats),
        fare: {
          economy: Number(formData.fare.economy),
          business: Number(formData.fare.business),
          firstClass: Number(formData.fare.firstClass)
        }
      };

      await adminService.updateFlight(id, payload);
      setSuccess('Flight updated successfully');

      setTimeout(() => {
        navigate('/admin/manage-flights');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update flight');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FaPlane className="text-3xl text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-800">Edit Flight</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Flight Number
                </label>
                <input
                  type="text"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Airline
                </label>
                <input
                  type="text"
                  name="airline"
                  value={formData.airline}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Origin</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  name="origin.city"
                  value={formData.origin.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="City"
                  required
                />
                <input
                  type="text"
                  name="origin.airport"
                  value={formData.origin.airport}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Airport"
                  required
                />
                <input
                  type="text"
                  name="origin.code"
                  value={formData.origin.code}
                  onChange={handleChange}
                  className="input-field uppercase"
                  placeholder="Code"
                  maxLength="3"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Destination</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  name="destination.city"
                  value={formData.destination.city}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="City"
                  required
                />
                <input
                  type="text"
                  name="destination.airport"
                  value={formData.destination.airport}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Airport"
                  required
                />
                <input
                  type="text"
                  name="destination.code"
                  value={formData.destination.code}
                  onChange={handleChange}
                  className="input-field uppercase"
                  placeholder="Code"
                  maxLength="3"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Departure Time
                </label>
                <input
                  type="datetime-local"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Arrival Time
                </label>
                <input
                  type="datetime-local"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Duration
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
                  Total Seats
                </label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleChange}
                  className="input-field"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Available Seats
                </label>
                <input
                  type="number"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  className="input-field"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Fares (USD)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="number"
                  name="fare.economy"
                  value={formData.fare.economy}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Economy"
                  min="0"
                  required
                />
                <input
                  type="number"
                  name="fare.business"
                  value={formData.fare.business}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Business"
                  min="0"
                  required
                />
                <input
                  type="number"
                  name="fare.firstClass"
                  value={formData.fare.firstClass}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="First Class"
                  min="0"
                  required
                />
              </div>
            </div>

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
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
              >
                <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/manage-flights')}
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

export default EditFlight;