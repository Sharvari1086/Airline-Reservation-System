const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const User = require('../models/User');

// ... other controller functions ...

const getReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const totalFlights = await Flight.countDocuments();
    
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed', paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.status(200).json({
      success: true,
      reports: {
        totalUsers,
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalFlights,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addFlight,
  updateFlight,
  deleteFlight,
  getAllUsers,
  getAllBookings,
  getReports
};