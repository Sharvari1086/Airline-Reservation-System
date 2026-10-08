const mongoose = require('mongoose');
const Flight = require('../models/Flight');

// Search flights
const searchFlights = async (req, res) => {
  try {
    const { origin, destination, date, class: seatClass, airline } = req.query;

    const query = {};

    if (origin) query['origin.code'] = origin.toUpperCase();
    if (destination) query['destination.code'] = destination.toUpperCase();
    if (airline) query.airline = { $regex: airline, $options: 'i' };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.departureTime = { $gte: startDate, $lte: endDate };
    }

    query.availableSeats = { $gt: 0 };
    query.status = { $in: ['scheduled', 'delayed'] };

    const fareClass = seatClass || 'economy';

    const flights = await Flight.find(query).sort({ departureTime: 1 });

    const formattedFlights = flights.map((flight) => {
      const flightObj = flight.toObject();
      const selectedFare = flight.fare[fareClass] || flight.fare.economy;

      return {
        ...flightObj,
        selectedFare: selectedFare,
        requestedClass: fareClass
      };
    });

    const airlines = await Flight.distinct('airline');

    res.status(200).json({
      success: true,
      count: formattedFlights.length,
      airlines,
      flights: formattedFlights
    });
  } catch (error) {
    console.error('searchFlights error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get flight by ID
const getFlightById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid flight ID format'
      });
    }

    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.status(200).json({
      success: true,
      flight
    });
  } catch (error) {
    console.error('getFlightById error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get flight by number
const getFlightByNumber = async (req, res) => {
  try {
    const flight = await Flight.findOne({
      flightNumber: req.params.flightNumber.toUpperCase()
    });

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.status(200).json({
      success: true,
      flight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get destinations
const getDestinations = async (req, res) => {
  try {
    const origins = await Flight.distinct('origin.city');
    const destinations = await Flight.distinct('destination.city');

    res.status(200).json({
      success: true,
      origins,
      destinations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  searchFlights,
  getFlightById,
  getFlightByNumber,
  getDestinations
};