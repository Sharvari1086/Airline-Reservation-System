const express = require('express');
const router = express.Router();
const {
  searchFlights,
  getFlightById,
  getFlightByNumber,
  getDestinations
} = require('../controllers/flightController');

router.get('/', searchFlights);
router.get('/destinations', getDestinations);
router.get('/number/:flightNumber', getFlightByNumber);
router.get('/:id', getFlightById);

module.exports = router;