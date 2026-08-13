const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { generatePNR, generateTransactionId } = require('../utils/generatePNR');

const createBooking = async (req, res) => {
  try {
    const { flightId, passengers, seatClass = 'economy', paymentMethod = 'credit_card' } = req.body;
    
    if (!flightId || !passengers || passengers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide flight ID and passenger details'
      });
    }
    
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }
    
    const passengerCount = passengers.length;
    if (flight.availableSeats < passengerCount) {
      return res.status(400).json({
        success: false,
        message: `Only ${flight.availableSeats} seats available. Please reduce number of passengers.`
      });
    }
    
    const farePerPassenger = flight.fare[seatClass] || flight.fare.economy;
    const totalAmount = farePerPassenger * passengerCount;
    
    const bookingReference = generatePNR();
    
    const booking = new Booking({
      bookingReference,
      userId: req.user.id,
      flightId,
      passengers: passengers.map(p => ({
        ...p,
        class: seatClass,
        seatNumber: null
      })),
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'pending',
      paymentDetails: {
        method: paymentMethod,
        transactionId: generateTransactionId()
      }
    });
    
    flight.availableSeats -= passengerCount;
    await flight.save();
    
    await booking.save();
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate('flightId')
      .populate('userId', 'name email phone');
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('flightId')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flightId')
      .populate('userId', 'name email phone');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }
    
    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getBookingByPNR = async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      bookingReference: req.params.pnr.toUpperCase() 
    })
      .populate('flightId')
      .populate('userId', 'name email phone');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }
    
    const flight = await Flight.findById(booking.flightId);
    if (new Date(flight.departureTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking for past flights'
      });
    }
    
    booking.status = 'cancelled';
    booking.cancellationDate = new Date();
    booking.cancellationReason = reason || 'Cancelled by user';
    
    flight.availableSeats += booking.passengers.length;
    await flight.save();
    
    await booking.save();
    
    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    booking.paymentStatus = 'completed';
    booking.paymentDetails.paymentDate = new Date();
    booking.paymentDetails.method = paymentMethod || booking.paymentDetails.method;
    
    await booking.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  getBookingByPNR,
  cancelBooking,
  confirmPayment
};