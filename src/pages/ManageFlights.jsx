import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaPlane,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import { flightService, adminService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageFlights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadFlights();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = flights.filter(flight =>
        flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.origin.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flight.destination.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFlights(filtered);
    } else {
      setFilteredFlights(flights);
    }
  }, [searchTerm, flights]);

  const loadFlights = async () => {
    try {
      setLoading(true);
      const response = await flightService.searchFlights({});
      setFlights(response.data.flights);
      setFilteredFlights(response.data.flights);
      setError('');
    } catch (error) {
      console.error('Failed to load flights:', error);
      setError('Failed to load flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, flightNumber) => {
    if (!window.confirm(`Are you sure you want to delete flight ${flightNumber}?`)) {
      return;
    }

    try {
      setDeleting(id);
      await adminService.deleteFlight(id);
      setFlights(flights.filter(f => f._id !== id));
      setFilteredFlights(filteredFlights.filter(f => f._id !== id));
      alert(`Flight ${flightNumber} deleted successfully`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete flight');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaPlane className="text-primary-600" /> Manage Flights
            </h1>
            <p className="text-gray-600">Total: {flights.length} flights</p>
          </div>
          <Link to="/admin/add-flight" className="btn-primary flex items-center gap-2 mt-4 md:mt-0">
            <FaPlus /> Add New Flight
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by flight number, airline, or airport code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Flight List */}
        {filteredFlights.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaPlane className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Flights Found</h3>
            <p className="text-gray-500">Start by adding your first flight</p>
            <Link to="/admin/add-flight" className="btn-primary inline-block mt-4">
              Add Flight
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFlights.map((flight) => (
              <div key={flight._id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Flight Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-xl font-bold text-primary-600">
                        {flight.flightNumber}
                      </span>
                      <span className="text-gray-600">{flight.airline}</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        flight.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                        flight.status === 'delayed' ? 'bg-yellow-100 text-yellow-700' :
                        flight.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="font-bold">{flight.origin.code}</span>
                        <span className="text-gray-500 ml-1">{flight.origin.city}</span>
                      </div>
                      <FaPlane className="text-gray-400 text-xs transform rotate-90" />
                      <div>
                        <span className="font-bold">{flight.destination.code}</span>
                        <span className="text-gray-500 ml-1">{flight.destination.city}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span>🕐 {formatDate(flight.departureTime)}</span>
                      <span>⏱️ {flight.duration}</span>
                      <span>💺 {flight.availableSeats}/{flight.totalSeats} seats</span>
                      <span>💰 ${flight.fare.economy} - ${flight.fare.firstClass}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 items-start">
                    <Link
                      to={`/admin/edit-flight/${flight._id}`}
                      className="btn-secondary flex items-center gap-1 text-sm px-3 py-2"
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(flight._id, flight.flightNumber)}
                      disabled={deleting === flight._id}
                      className="btn-danger flex items-center gap-1 text-sm px-3 py-2"
                    >
                      {deleting === flight._id ? '...' : <><FaTrash /> Delete</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFlights;