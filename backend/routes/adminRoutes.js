const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  addFlight,
  updateFlight,
  deleteFlight,
  getAllUsers,
  getAllBookings,
  getReports
} = require('../controllers/adminController');

router.use(protect, admin);

router.post('/flights', addFlight);
router.put('/flights/:id', updateFlight);
router.delete('/flights/:id', deleteFlight);
router.get('/users', getAllUsers);
router.get('/bookings', getAllBookings);
router.get('/reports', getReports);

module.exports = router;