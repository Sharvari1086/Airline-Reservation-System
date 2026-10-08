const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
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
} = require('../controllers/bookingController');

router.use(protect);

router.post('/', createBooking);
router.post('/pending', createPendingBooking);
router.post('/:id/pay', processPayment);
router.get('/', getUserBookings);
router.get('/pnr/:pnr', getBookingByPNR);
router.get('/flight/:flightId/seats', getBookedSeats);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/payment', confirmPayment);
router.put('/:id/reschedule', rescheduleBooking);
router.get('/:id', getBookingById);

module.exports = router;