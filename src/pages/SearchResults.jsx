import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { flightService } from '../services/api';
import FlightCard from '../components/FlightCard';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResults = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchFlights = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(location.search);
        const searchParams = {
          origin: params.get('origin'),
          destination: params.get('destination'),
          date: params.get('date'),
          class: params.get('class') || 'economy'
        };

        const response = await flightService.searchFlights(searchParams);
        setFlights(response.data.flights);
        setError('');
      } catch (error) {
        setError('Failed to load flights. Please try again.');
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (location.search) {
      searchFlights();
    } else {
      navigate('/');
    }
  }, [location.search, navigate]);

  if (loading) {
    return (
      <div className="container-custom py-12">
        <LoadingSpinner />
      </div>
    );
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
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Available Flights
      </h1>
      <p className="text-gray-600 mb-8">
        Found {flights.length} flight{flights.length !== 1 ? 's' : ''} matching your search
      </p>

      {flights.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No Flights Available
          </h3>
          <p className="text-gray-500">
            We couldn't find any flights matching your criteria. Please try different dates or destinations.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {flights.map((flight) => (
            <FlightCard key={flight._id} flight={flight} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;