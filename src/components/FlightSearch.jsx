import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FlightSearch = () => {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: '',
    class: 'economy'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const queryParams = new URLSearchParams(searchParams).toString();
      navigate(`/search?${queryParams}`);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Flights</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              name="origin"
              value={searchParams.origin}
              onChange={handleChange}
              placeholder="City or Airport Code (e.g., NYC)"
              className="input-field"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              name="destination"
              value={searchParams.destination}
              onChange={handleChange}
              placeholder="City or Airport Code (e.g., LAX)"
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Travel Date
            </label>
            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleChange}
              className="input-field"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
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
          className="w-full btn-primary py-3 text-lg"
        >
          {loading ? 'Searching...' : '🔍 Search Flights'}
        </button>
      </form>
    </div>
  );
};

export default FlightSearch;