const Flight = require('../models/Flight');

const searchFlights = async (req, res) => {
  try {
    const { origin, destination, date, class: seatClass, airline } = req.query;
    
    const query = {};
    
    if (origin) {
      query['origin.code'] = origin.toUpperCase();
    }
    
    if (destination) {
      query['destination.code'] = destination.toUpperCase();
    }
    
    if (airline) {
      query.airline = { $regex: airline, $options: 'i' };
    }
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.departureTime = { $gte: startDate, $lte: endDate };
    }
    
    query.availableSeats = { $gt: 0 };
    query.status = { $in: ['scheduled', 'delayed'] };
    
    const flights = await Flight.find(query).sort({ departureTime: 1 });
    
    const formattedFlights = flights.map(flight => {
      const flightObj = flight.toObject();
      const fareClass = seatClass || 'economy';
      const fare = flight.fare[fareClass] || flight.fare.economy;
      
      return {
        ...flightObj,
        fare: fare,
        requestedClass: fareClass
      };
    });
    
    res.status(200).json({
      success: true,
      count: formattedFlights.length,
      flights: formattedFlights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getFlightById = async (req, res) => {
  try {
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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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