const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight',
      required: true
    },
    passengers: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true, min: 1 },
        gender: {
          type: String,
          enum: ['Male', 'Female', 'Other'],
          required: true
        },
        seatNumber: { type: String, default: null },
        class: {
          type: String,
          enum: ['economy', 'business', 'firstClass'],
          default: 'economy'
        }
      }
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentDetails: {
      method: {
        type: String,
        enum: ['credit_card', 'debit_card', 'net_banking', 'upi']
      },
      transactionId: String,
      paymentDate: Date
    },
    confirmationEmailSentAt: Date,
    cancellationDate: Date,
    cancellationReason: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);