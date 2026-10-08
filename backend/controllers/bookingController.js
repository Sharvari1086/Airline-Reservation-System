const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const { generatePNR, generateTransactionId } = require('../utils/generatePNR');
// Create a pending booking (before payment)
const createPendingBooking = async (req, res) => {
  try {
    const {
      flightId,
      passengers,
      seatClass = 'economy'
    } = req.body;

    if (!flightId || !passengers || passengers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Flight ID and passenger details are required'
      });
    }

    if (passengers.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 passengers per booking'
      });
    }

    for (const p of passengers) {
      if (!p.name || p.name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Each passenger must have a name of at least 2 characters'
        });
      }
      if (!p.age || p.age < 1 || p.age > 120) {
        return res.status(400).json({
          success: false,
          message: 'Each passenger must have an age between 1 and 120'
        });
      }
      if (!['Male', 'Female', 'Other'].includes(p.gender)) {
        return res.status(400).json({
          success: false,
          message: 'Gender must be Male, Female, or Other'
        });
      }
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
        message: `Only ${flight.availableSeats} seats available`
      });
    }

    const farePerPassenger = flight.fare[seatClass];
    if (!farePerPassenger) {
      return res.status(400).json({
        success: false,
        message: 'Invalid seat class'
      });
    }

    const totalAmount = farePerPassenger * passengerCount;

    // Generate unique PNR
    let bookingReference;
    let exists = true;
    while (exists) {
      bookingReference = generatePNR();
      exists = await Booking.exists({ bookingReference });
    }

    // Reserve seats temporarily
    flight.availableSeats -= passengerCount;
    await flight.save();

    const booking = new Booking({
      bookingReference,
      userId: req.user.id,
      flightId,
      passengers: passengers.map((p) => ({
        name: p.name.trim(),
        age: Number(p.age),
        gender: p.gender,
        class: seatClass,
        seatNumber: null
      })),
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('flightId')
      .populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created. Proceed to payment.',
      booking: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Process payment
const processPayment = async (req, res) => {
  try {
    const { paymentMethod, cardNumber, cardName, expiry, cvv, upiId } = req.body;
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

    if (booking.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Booking already paid'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking has been cancelled'
      });
    }

    // Validate payment method
    const validMethods = ['credit_card', 'debit_card', 'upi', 'net_banking'];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    // Validate card details for card payments
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        return res.status(400).json({
          success: false,
          message: 'Invalid card number'
        });
      }
      if (!cardName || cardName.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Cardholder name is required'
        });
      }
      if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid expiry date (use MM/YY)'
        });
      }
      if (!cvv || cvv.length !== 3) {
        return res.status(400).json({
          success: false,
          message: 'Invalid CVV'
        });
      }
    }

    // Validate UPI
    if (paymentMethod === 'upi') {
      if (!upiId || !upiId.includes('@')) {
        return res.status(400).json({
          success: false,
          message: 'Invalid UPI ID'
        });
      }
    }

    // Simulate payment processing
    // In production, integrate Razorpay or Stripe here
    const paymentSuccess = true;

    if (!paymentSuccess) {
      booking.paymentStatus = 'failed';
      await booking.save();
      return res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again.'
      });
    }

    // Update booking with payment info
    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    booking.paymentDetails = {
      method: paymentMethod,
      transactionId:
        'TXN_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8),
      paymentDate: new Date()
    };

    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('flightId')
      .populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Payment successful',
      booking: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const createBooking = async (req, res) => {
  try {
    const {
      flightId,
      passengers,
      seatClass = 'economy',
      paymentMethod = 'credit_card'
    } = req.body;

    // Validate inputs
    if (!flightId || !passengers || passengers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Flight ID and passenger details are required'
      });
    }

    if (passengers.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 5 passengers per booking'
      });
    }

    // Validate each passenger
    for (const p of passengers) {
      if (!p.name || p.name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Each passenger must have a name of at least 2 characters'
        });
      }
      if (!p.age || p.age < 1 || p.age > 120) {
        return res.status(400).json({
          success: false,
          message: 'Each passenger must have an age between 1 and 120'
        });
      }
      if (!['Male', 'Female', 'Other'].includes(p.gender)) {
        return res.status(400).json({
          success: false,
          message: 'Gender must be Male, Female, or Other'
        });
      }
    }

    // Get flight
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    // Check seat availability
    const passengerCount = passengers.length;
    if (flight.availableSeats < passengerCount) {
      return res.status(400).json({
        success: false,
        message: `Only ${flight.availableSeats} seats available`
      });
    }

    // Calculate total
    const farePerPassenger = flight.fare[seatClass];
    if (!farePerPassenger) {
      return res.status(400).json({
        success: false,
        message: 'Invalid seat class'
      });
    }

    const totalAmount = farePerPassenger * passengerCount;

    // Generate unique PNR
    let bookingReference;
    let exists = true;
    while (exists) {
      bookingReference = generatePNR();
      exists = await Booking.exists({ bookingReference });
    }

    // Create booking
    const booking = new Booking({
      bookingReference,
      userId: req.user.id,
      flightId,
      passengers: passengers.map((p) => ({
  name: p.name.trim(),
  age: Number(p.age),
  gender: p.gender,
  class: seatClass,
  seatNumber: p.seatNumber || null
})),
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'pending',
      paymentDetails: {
        method: paymentMethod,
        transactionId: generateTransactionId()
      }
    });

    // Reduce available seats
    flight.availableSeats -= passengerCount;
    await flight.save();

    await booking.save();

    // Populate for response
    const populated = await Booking.findById(booking._id)
      .populate('flightId')
      .populate('userId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      booking: populated
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

    if (
      booking.userId._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
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

    if (
      booking.userId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking already cancelled'
      });
    }

    const flight = await Flight.findById(booking.flightId);
    if (flight && new Date(flight.departureTime) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking for past flights'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationDate = new Date();
    booking.cancellationReason = reason || 'Cancelled by user';

    if (flight) {
      flight.availableSeats += booking.passengers.length;
      await flight.save();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled',
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
    if (paymentMethod) booking.paymentDetails.method = paymentMethod;

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment confirmed',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Reschedule booking to a different flight
const rescheduleBooking = async (req, res) => {
  try {
    const { newFlightId } = req.body;
    const oldBooking = await Booking.findById(req.params.id);

    if (!oldBooking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (oldBooking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (oldBooking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cancelled bookings cannot be rescheduled'
      });
    }

    if (!newFlightId) {
      return res.status(400).json({
        success: false,
        message: 'New flight ID is required'
      });
    }

    const oldFlight = await Flight.findById(oldBooking.flightId);
    if (
      oldFlight &&
      new Date(oldFlight.departureTime).getTime() - Date.now() <
        24 * 60 * 60 * 1000
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule within 24 hours of departure'
      });
    }

    const newFlight = await Flight.findById(newFlightId);
    if (!newFlight) {
      return res.status(404).json({
        success: false,
        message: 'New flight not found'
      });
    }

    const passengerCount = oldBooking.passengers.length;
    if (newFlight.availableSeats < passengerCount) {
      return res.status(400).json({
        success: false,
        message: `New flight has only ${newFlight.availableSeats} seats available`
      });
    }

    const seatClass = oldBooking.passengers[0].class || 'economy';
    const newFare = newFlight.fare[seatClass];
    const newTotal = newFare * passengerCount;

    // Restore seats on old flight
    if (oldFlight) {
      oldFlight.availableSeats += passengerCount;
      await oldFlight.save();
    }

    // Reduce seats on new flight
    newFlight.availableSeats -= passengerCount;
    await newFlight.save();

    // Update booking
    oldBooking.flightId = newFlightId;
    oldBooking.totalAmount = newTotal;
    oldBooking.passengers = oldBooking.passengers.map((p) => ({
      ...p.toObject(),
      seatNumber: null
    }));
    await oldBooking.save();

    const populated = await Booking.findById(oldBooking._id)
      .populate('flightId')
      .populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Booking rescheduled successfully',
      booking: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get booked seats for a flight
const getBookedSeats = async (req, res) => {
  try {
    const { flightId } = req.params;

    const bookings = await Booking.find({
      flightId,
      status: { $in: ['pending', 'confirmed'] }
    }).select('passengers');

    const bookedSeats = [];
    bookings.forEach((booking) => {
      booking.passengers.forEach((p) => {
        if (p.seatNumber) {
          bookedSeats.push(p.seatNumber);
        }
      });
    });

    res.status(200).json({
      success: true,
      count: bookedSeats.length,
      bookedSeats
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
  createPendingBooking,
  processPayment,
  getUserBookings,
  getBookingById,
  getBookingByPNR,
  cancelBooking,
  confirmPayment,
  rescheduleBooking,
  getBookedSeats
};