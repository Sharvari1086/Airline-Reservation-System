import React from 'react';
import { Link } from 'react-router-dom';

const FlightCard = ({ flight }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card hover:border-primary-300 border-2 border-transparent">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-lg font-bold text-primary-600">{flight.flightNumber}</span>
            <span className="text-gray-600">{flight.airline}</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              flight.status === 'scheduled' ? 'bg-green-100 text-green-700' :
              flight.status === 'delayed' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {flight.status.charAt(0).toUpperCase() + flight.status.slice(1)}
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div>
              <div className="text-2xl font-bold">{flight.origin.code}</div>
              <div className="text-sm text-gray-600">{flight.origin.city}</div>
              <div className="text-sm text-gray-500">{formatTime(flight.departureTime)}</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500">{flight.duration}</div>
              <div className="w-24 h-px bg-gray-300 relative">
                <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2">
                  ✈️
                </div>
              </div>
              <div className="text-xs text-gray-500">Non-stop</div>
            </div>

            <div>
              <div className="text-2xl font-bold">{flight.destination.code}</div>
              <div className="text-sm text-gray-600">{flight.destination.city}</div>
              <div className="text-sm text-gray-500">{formatTime(flight.arrivalTime)}</div>
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-500">
            📅 {formatDate(flight.departureTime)}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
          <div className="text-2xl font-bold text-primary-600">
            ${flight.fare || flight.fare?.economy}
          </div>
          <div className="text-sm text-gray-500">
            {flight.availableSeats} seats available
          </div>
          <Link
            to={`/booking/${flight._id}`}
            className="btn-primary w-full md:w-auto text-center"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;