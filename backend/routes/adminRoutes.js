const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  addFlight,
  updateFlight,
  deleteFlight,
  getAllUsers,
  getAllBookings,
  getBookingsByFlight,
  getReports,
  getFlightReports,
  getBookingTrends
} = require('../controllers/adminController');

router.use(protect, admin);

router.post('/flights', addFlight);
router.put('/flights/:id', updateFlight);
router.delete('/flights/:id', deleteFlight);

router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);
router.get('/bookings/flight/:flightId', getBookingsByFlight);
router.get('/reports', getReports);
router.get('/reports/flights', getFlightReports);
router.get('/reports/trends', getBookingTrends);
module.exports = router;