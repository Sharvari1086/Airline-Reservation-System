const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  getBookingByPNR,
  cancelBooking,
  confirmPayment
} = require('../controllers/bookingController');

router.use(protect);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/pnr/:pnr', getBookingByPNR);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/payment', confirmPayment);

module.exports = router;