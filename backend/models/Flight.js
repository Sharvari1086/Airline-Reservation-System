const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: [true, 'Flight number is required'],
    unique: true,
    trim: true
  },
  airline: {
    type: String,
    required: [true, 'Airline name is required'],
    trim: true
  },
  origin: {
    city: {
      type: String,
      required: true
    },
    airport: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      match: [/^[A-Z]{3}$/, 'Airport code must be 3 uppercase letters']
    }
  },
  destination: {
    city: {
      type: String,
      required: true
    },
    airport: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      match: [/^[A-Z]{3}$/, 'Airport code must be 3 uppercase letters']
    }
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required']
  },
  duration: {
    type: String,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true,
    min: [1, 'Total seats must be at least 1']
  },
  availableSeats: {
    type: Number,
    required: true,
    min: [0, 'Available seats cannot be negative']
  },
  fare: {
    economy: {
      type: Number,
      required: true,
      min: [0, 'Fare cannot be negative']
    },
    business: {
      type: Number,
      required: true,
      min: [0, 'Fare cannot be negative']
    },
    firstClass: {
      type: Number,
      required: true,
      min: [0, 'Fare cannot be negative']
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'cancelled', 'completed'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Flight', flightSchema);