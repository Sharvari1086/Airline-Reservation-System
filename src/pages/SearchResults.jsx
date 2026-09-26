import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  FaSearch,
  FaPlane,
  FaFilter,
  FaTimes,
  FaExchangeAlt,
  FaCalendarAlt,
  FaClock,
  FaChair,
  FaArrowRight,
  FaSortAmountDown,
  FaEye
} from 'react-icons/fa';
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md';
import { flightService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchForm, setSearchForm] = useState({
    origin: '',
    destination: '',
    date: '',
    class: 'economy'
  });

  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    airline: '',
    minPrice: '',
    maxPrice: '',
    sortBy: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const origin = params.get('origin') || '';
    const destination = params.get('destination') || '';
    const date = params.get('date') || '';
    const seatClass = params.get('class') || 'economy';

    setSearchForm({ origin, destination, date, class: seatClass });

    if (origin && destination && date) {
      fetchFlights({ origin, destination, date, class: seatClass });
    }
  }, [location.search]);

  const fetchFlights = async (params) => {
    setLoading(true);
    setError('');
    try {
      const response = await flightService.searchFlights({
        origin: params.origin,
        destination: params.destination,
        date: params.date,
        class: params.class
      });
      setFlights(response.data.flights || []);
      setAirlines(response.data.airlines || []);
    } catch (err) {
      setError('Failed to load flights. Please try again.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setSearchForm({ ...searchForm, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSwap = () => {
    setSearchForm({
      ...searchForm,
      origin: searchForm.destination,
      destination: searchForm.origin
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!searchForm.origin || !searchForm.destination) {
      return setError('Please enter both origin and destination');
    }
    if (searchForm.origin.toUpperCase() === searchForm.destination.toUpperCase()) {
      return setError('Origin and destination cannot be the same');
    }
    if (!searchForm.date) {
      return setError('Please select a travel date');
    }

    const queryParams = new URLSearchParams(searchForm).toString();
    navigate(`/search?${queryParams}`);
  };

  const handleClearFilters = () => {
    setFilters({ airline: '', minPrice: '', maxPrice: '', sortBy: '' });
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

  const filteredFlights = flights
    .filter((flight) => {
      if (filters.airline && flight.airline !== filters.airline) return false;
      const fare = flight.selectedFare || flight.fare?.economy || 0;
      if (filters.minPrice && fare < Number(filters.minPrice)) return false;
      if (filters.maxPrice && fare > Number(filters.maxPrice)) return false;
      return true;
    })
    .sort((a, b) => {
      const aFare = a.selectedFare || a.fare?.economy || 0;
      const bFare = b.selectedFare || b.fare?.economy || 0;

      switch (filters.sortBy) {
        case 'price_low':
          return aFare - bFare;
        case 'price_high':
          return bFare - aFare;
        case 'departure_early':
          return new Date(a.departureTime) - new Date(b.departureTime);
        case 'departure_late':
          return new Date(b.departureTime) - new Date(a.departureTime);
        default:
          return 0;
      }
    });

  const hasActiveFilters =
    filters.airline || filters.minPrice || filters.maxPrice || filters.sortBy;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar Section */}
      <div className="bg-primary-600 py-6 shadow-lg">
        <div className="container-custom">
          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  From
                </label>
                <div className="relative">
                  <MdFlightTakeoff className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="origin"
                    value={searchForm.origin}
                    onChange={handleFormChange}
                    placeholder="JFK"
                    className="input-field pl-10 uppercase text-sm"
                    maxLength="3"
                  />
                </div>
              </div>

              <div className="md:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200"
                >
                  <FaExchangeAlt />
                </button>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  To
                </label>
                <div className="relative">
                  <MdFlightLand className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="destination"
                    value={searchForm.destination}
                    onChange={handleFormChange}
                    placeholder="LAX"
                    className="input-field pl-10 uppercase text-sm"
                    maxLength="3"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={searchForm.date}
                  onChange={handleFormChange}
                  min={today}
                  className="input-field text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  name="class"
                  value={searchForm.class}
                  onChange={handleFormChange}
                  className="input-field text-sm"
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="firstClass">First Class</option>
                </select>
              </div>

              <div className="md:col-span-1">
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 flex items-center justify-center"
                >
                  <FaSearch />
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="container-custom py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Available Flights
            </h1>
            {searchForm.origin && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>{searchForm.origin}</strong> to{' '}
                <strong>{searchForm.destination}</strong> on{' '}
                <strong>
                  {searchForm.date
                    ? new Date(searchForm.date).toLocaleDateString()
                    : ''}
                </strong>{' '}
                | {filteredFlights.length} flights found
              </p>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-3 md:mt-0 btn-secondary flex items-center gap-2 text-sm"
          >
            <FaFilter /> {showFilters ? 'Hide' : 'Show'} Filters
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {showFilters && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-5 sticky top-20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FaFilter className="text-primary-600" /> Filters
                    </h3>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <FaTimes /> Clear
                      </button>
                    )}
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaSortAmountDown className="inline mr-1" /> Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters({ ...filters, sortBy: e.target.value })
                      }
                      className="input-field text-sm"
                    >
                      <option value="">Recommended</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="departure_early">Departure: Earliest</option>
                      <option value="departure_late">Departure: Latest</option>
                    </select>
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Airline
                    </label>
                    <select
                      value={filters.airline}
                      onChange={(e) =>
                        setFilters({ ...filters, airline: e.target.value })
                      }
                      className="input-field text-sm"
                    >
                      <option value="">All Airlines</option>
                      {airlines.map((airline) => (
                        <option key={airline} value={airline}>
                          {airline}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range (USD)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, minPrice: e.target.value })
                        }
                        placeholder="Min"
                        className="input-field text-sm"
                        min="0"
                      />
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, maxPrice: e.target.value })
                        }
                        placeholder="Max"
                        className="input-field text-sm"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                    Showing {filteredFlights.length} of {flights.length} flights
                  </div>
                </div>
              </div>
            )}

            <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
              {filteredFlights.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <FaPlane className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Flights Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {hasActiveFilters
                      ? 'No flights match your filters. Try adjusting them.'
                      : 'No flights match your search. Try a different date or route.'}
                  </p>
                  {hasActiveFilters ? (
                    <button onClick={handleClearFilters} className="btn-primary">
                      Clear Filters
                    </button>
                  ) : (
                    <Link to="/" className="btn-primary inline-block">
                      New Search
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFlights.map((flight) => {
                    const fare = flight.selectedFare || flight.fare?.economy || 0;

                    return (
                      <div
                        key={flight._id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-5">
                          {/* Flight Info */}
                          <div className="flex-1">
                            {/* Header Row */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="bg-primary-100 p-2 rounded-lg">
                                <FaPlane className="text-primary-600" />
                              </div>
                              <div className="flex items-center gap-3">
                                <Link
                                  to={`/flight/${flight._id}`}
                                  className="text-lg font-bold text-primary-600 hover:text-primary-700 hover:underline"
                                >
                                  {flight.flightNumber}
                                </Link>
                                <span className="text-gray-600 text-sm">
                                  {flight.airline}
                                </span>
                              </div>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  flight.status === 'scheduled'
                                    ? 'bg-green-100 text-green-700'
                                    : flight.status === 'delayed'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {flight.status}
                              </span>
                            </div>

                            {/* Route */}
                            <div className="flex items-center gap-3 md:gap-6">
                              <div className="text-center">
                                <div className="text-xl font-bold text-gray-800">
                                  {formatTime(flight.departureTime)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {flight.origin.code}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {flight.origin.city}
                                </div>
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                  <FaClock className="text-xs" /> {flight.duration}
                                </div>
                                <div className="flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                                  <div className="flex-1 h-px bg-gray-300 relative">
                                    <FaPlane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-600 bg-white px-1 text-xs" />
                                  </div>
                                  <div className="w-2 h-2 rounded-full bg-primary-600"></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-center">
                                  Non-stop
                                </div>
                              </div>

                              <div className="text-center">
                                <div className="text-xl font-bold text-gray-800">
                                  {formatTime(flight.arrivalTime)}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {flight.destination.code}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {flight.destination.city}
                                </div>
                              </div>
                            </div>

                            {/* Extra Info */}
                            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FaCalendarAlt /> {formatDate(flight.departureTime)}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaChair /> {flight.availableSeats} seats left
                              </span>
                              <span className="text-green-600 font-medium">
                                Free cancellation
                              </span>
                            </div>
                          </div>

                          {/* Price and Buttons Column */}
                          <div className="flex flex-col justify-between md:min-w-[180px] gap-3">
                            <div className="text-right">
                              <div className="text-xs text-gray-500 uppercase mb-1">
                                {flight.requestedClass || 'Economy'}
                              </div>
                              <div className="text-3xl font-bold text-primary-600">
                                ${fare}
                              </div>
                              <div className="text-xs text-gray-500">
                                per passenger
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Link
                                to={`/flight/${flight._id}`}
                                className="btn-secondary text-sm text-center flex items-center justify-center gap-2"
                              >
                                <FaEye /> View Details
                              </Link>
                              <Link
                                to={`/booking/${flight._id}?class=${searchForm.class}`}
                                className="btn-primary flex items-center justify-center gap-2"
                              >
                                Book Now <FaArrowRight />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;