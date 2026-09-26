import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaPlane,
  FaExchangeAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers
} from 'react-icons/fa';
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md';

const FlightSearch = () => {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: '',
    class: 'economy'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSwap = () => {
    setSearchParams({
      ...searchParams,
      origin: searchParams.destination,
      destination: searchParams.origin
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!searchParams.origin || !searchParams.destination) {
      return setError('Please enter both origin and destination');
    }
    if (searchParams.origin.toUpperCase() === searchParams.destination.toUpperCase()) {
      return setError('Origin and destination cannot be the same');
    }
    if (!searchParams.date) {
      return setError('Please select a travel date');
    }

    setLoading(true);
    const queryParams = new URLSearchParams(searchParams).toString();
    navigate(`/search?${queryParams}`);
    setLoading(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* From and To with swap button */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <MdFlightTakeoff className="inline mr-1" /> From
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="origin"
                value={searchParams.origin}
                onChange={handleChange}
                placeholder="City or airport code (e.g., JFK)"
                className="input-field pl-10 uppercase"
                maxLength="3"
              />
            </div>
          </div>

          <div className="md:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition"
              title="Swap origin and destination"
            >
              <FaExchangeAlt />
            </button>
          </div>

          <div className="md:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <MdFlightLand className="inline mr-1" /> To
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="destination"
                value={searchParams.destination}
                onChange={handleChange}
                placeholder="City or airport code (e.g., LAX)"
                className="input-field pl-10 uppercase"
                maxLength="3"
              />
            </div>
          </div>
        </div>

        {/* Date and Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <FaCalendarAlt className="inline mr-1" /> Travel Date
            </label>
            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleChange}
              min={today}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <FaUsers className="inline mr-1" /> Class
            </label>
            <select
              name="class"
              value={searchParams.class}
              onChange={handleChange}
              className="input-field"
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="firstClass">First Class</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"
        >
          <FaSearch /> {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>
    </div>
  );
};

export default FlightSearch;