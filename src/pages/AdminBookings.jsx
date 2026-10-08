import React, { useState, useEffect } from 'react';
import {
  FaBook,
  FaPlane,
  FaUser,
  FaChair,
  FaCalendarAlt,
  FaArrowLeft,
  FaSearch
} from 'react-icons/fa';
import { adminService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminBookings = () => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flightBookings, setFlightBookings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const formatPrice = (v) => '₹' + Number(v || 0).toLocaleString('en-IN');

  const loadFlights = async () => {
    try {
      const response = await adminService.getFlightReports();
      setFlights(response.data.flightReports || []);
    } catch (err) {
      setError('Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  const loadBookingsForFlight = async (flightId) => {
    setLoadingBookings(true);
    try {
      const response = await adminService.getBookingsByFlight(flightId);
      setFlightBookings(response.data);
      setSelectedFlight(response.data.flight);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadFlights();
  }, []);

  const goBack = () => {
    setSelectedFlight(null);
    setFlightBookings(null);
    setSearch('');
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // ========================
  // SINGLE FLIGHT VIEW
  // ========================
  if (selectedFlight && flightBookings) {
    const { stats, bookings } = flightBookings;

    const filteredBookings = search.trim()
      ? bookings.filter((b) => {
          const q = search.trim().toLowerCase();
          return (
            b.bookingReference?.toLowerCase().includes(q) ||
            b.userId?.name?.toLowerCase().includes(q) ||
            b.userId?.email?.toLowerCase().includes(q) ||
            b.passengers.some((p) => p.name?.toLowerCase().includes(q))
          );
        })
      : bookings;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-custom">
          <button
            onClick={goBack}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-primary-600"
          >
            <FaArrowLeft /> Back to All Flights
          </button>

          {/* Flight Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary-100 p-3 rounded-xl">
                  <FaPlane className="text-primary-600 text-2xl" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">
                    {selectedFlight.flightNumber}
                  </div>
                  <div className="text-gray-600">
                    {selectedFlight.airline}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {selectedFlight.origin.code} →{' '}
                  {selectedFlight.destination.code}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(selectedFlight.departureTime).toLocaleString(
                    'en-IN'
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {stats.totalBookings}
                </div>
                <div className="text-xs text-gray-500">Total Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.confirmed}
                </div>
                <div className="text-xs text-gray-500">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.cancelled}
                </div>
                <div className="text-xs text-gray-500">Cancelled</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {formatPrice(stats.revenue)}
                </div>
                <div className="text-xs text-gray-500">Revenue</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by PNR, passenger name, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Bookings List */}
          {loadingBookings ? (
            <LoadingSpinner />
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Bookings
              </h3>
              <p className="text-gray-500">
                {search
                  ? 'No bookings match your search.'
                  : 'No bookings have been made for this flight yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="font-bold text-primary-600 text-lg">
                          {booking.bookingReference}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.paymentStatus === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          Payment: {booking.paymentStatus}
                        </span>
                      </div>

                      <div className="flex items-start gap-3 mb-3">
                        <FaUser className="text-gray-400 mt-1" />
                        <div>
                          <div className="font-medium">
                            {booking.userId?.name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.userId?.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.userId?.phone}
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <div className="text-xs text-gray-500 mb-2">
                          {booking.passengers.length} Passenger
                          {booking.passengers.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {booking.passengers.map((p, i) => (
                            <div
                              key={i}
                              className="text-xs bg-gray-100 px-3 py-1.5 rounded flex items-center gap-2"
                            >
                              <span className="font-medium">{p.name}</span>
                              <span className="text-gray-500">
                                {p.age}y, {p.gender}
                              </span>
                              {p.seatNumber && (
                                <span className="font-medium text-primary-600 flex items-center gap-1">
                                  <FaChair className="text-xs" />
                                  {p.seatNumber}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right md:min-w-[140px]">
                      <div className="text-xs text-gray-500">Amount</div>
                      <div className="text-2xl font-bold text-primary-600">
                        {formatPrice(booking.totalAmount)}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        <FaCalendarAlt className="inline mr-1" />
                        {new Date(booking.createdAt).toLocaleDateString(
                          'en-IN'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========================
  // ALL FLIGHTS LIST
  // ========================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaBook className="text-primary-600" /> Bookings by Flight
          </h1>
          <p className="text-gray-600">
            Click any flight to see all its bookings and passenger details
          </p>
        </div>

        {flights.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaPlane className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Flights
            </h3>
            <p className="text-gray-500">
              Add flights to start receiving bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {flights.map((flight) => (
              <button
                key={flight._id}
                onClick={() => loadBookingsForFlight(flight._id)}
                className="w-full text-left bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-primary-300 transition"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <FaPlane className="text-primary-600" />
                      </div>
                      <span className="text-lg font-bold text-primary-600">
                        {flight.flightNumber}
                      </span>
                      <span className="text-gray-600">{flight.airline}</span>
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

                    <div className="text-sm text-gray-600 mb-1">
                      {flight.origin.city} ({flight.origin.code}) →{' '}
                      {flight.destination.city} ({flight.destination.code})
                    </div>

                    <div className="text-xs text-gray-500">
                      <FaCalendarAlt className="inline mr-1" />
                      {new Date(flight.departureTime).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 md:min-w-[320px]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {flight.totalBookings}
                      </div>
                      <div className="text-xs text-gray-500">Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {flight.totalPassengers}
                      </div>
                      <div className="text-xs text-gray-500">Passengers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">
                        {formatPrice(flight.revenue)}
                      </div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Occupancy</span>
                    <span>
                      {flight.seatsBooked}/{flight.totalSeats} seats (
                      {flight.occupancyRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${flight.occupancyRate}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;