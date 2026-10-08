const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const User = require('../models/User');

const addFlight = async (req, res) => {
  try {
    const flight = new Flight(req.body);
    await flight.save();
    res.status(201).json({
      success: true,
      message: 'Flight added successfully',
      flight
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!flight) {
      return res
        .status(404)
        .json({ success: false, message: 'Flight not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Flight updated successfully',
      flight
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);

    if (!flight) {
      return res
        .status(404)
        .json({ success: false, message: 'Flight not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Flight deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Count bookings per user
    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const totalBookings = await Booking.countDocuments({ userId: u._id });
        const confirmedBookings = await Booking.countDocuments({
          userId: u._id,
          status: 'confirmed'
        });
        const cancelledBookings = await Booking.countDocuments({
          userId: u._id,
          status: 'cancelled'
        });

        const revenueAgg = await Booking.aggregate([
          {
            $match: {
              userId: u._id,
              status: 'confirmed',
              paymentStatus: 'completed'
            }
          },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        return {
          _id: u._id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role,
          createdAt: u.createdAt,
          totalBookings,
          confirmedBookings,
          cancelledBookings,
          totalSpent: revenueAgg[0]?.total || 0
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithStats.length,
      users: usersWithStats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('flightId')
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get bookings for a specific flight
const getBookingsByFlight = async (req, res) => {
  try {
    const { flightId } = req.params;

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res
        .status(404)
        .json({ success: false, message: 'Flight not found' });
    }

    const bookings = await Booking.find({ flightId })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    const totalPassengers = bookings.reduce(
      (sum, b) => sum + b.passengers.length,
      0
    );
    const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
    const cancelled = bookings.filter((b) => b.status === 'cancelled').length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    const revenue = bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    res.status(200).json({
      success: true,
      flight,
      stats: {
        totalBookings: bookings.length,
        totalPassengers,
        confirmed,
        cancelled,
        pending,
        revenue
      },
      bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Global reports summary
const getReports = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({
      status: 'confirmed'
    });
    const cancelledBookings = await Booking.countDocuments({
      status: 'cancelled'
    });
    const totalFlights = await Flight.countDocuments();

    const revenueAgg = await Booking.aggregate([
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
        totalRevenue: revenueAgg[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Flight-wise analytics report
const getFlightReports = async (req, res) => {
  try {
    const flights = await Flight.find().sort({ departureTime: -1 });

    const flightReports = await Promise.all(
      flights.map(async (flight) => {
        const bookings = await Booking.find({ flightId: flight._id });

        const confirmed = bookings.filter(
          (b) => b.status === 'confirmed'
        ).length;
        const cancelled = bookings.filter(
          (b) => b.status === 'cancelled'
        ).length;
        const pending = bookings.filter((b) => b.status === 'pending').length;

        const totalPassengers = bookings.reduce(
          (sum, b) => sum + b.passengers.length,
          0
        );

        const revenue = bookings
          .filter((b) => b.status === 'confirmed')
          .reduce((sum, b) => sum + b.totalAmount, 0);

        const seatsBooked = flight.totalSeats - flight.availableSeats;
        const occupancyRate =
          flight.totalSeats > 0
            ? Math.round((seatsBooked / flight.totalSeats) * 100)
            : 0;

        return {
          _id: flight._id,
          flightNumber: flight.flightNumber,
          airline: flight.airline,
          origin: flight.origin,
          destination: flight.destination,
          departureTime: flight.departureTime,
          arrivalTime: flight.arrivalTime,
          status: flight.status,
          totalSeats: flight.totalSeats,
          availableSeats: flight.availableSeats,
          seatsBooked,
          occupancyRate,
          fare: flight.fare,
          totalBookings: bookings.length,
          confirmed,
          cancelled,
          pending,
          totalPassengers,
          revenue
        };
      })
    );

    // Aggregate summary
    const totalRevenue = flightReports.reduce((s, f) => s + f.revenue, 0);
    const totalBookings = flightReports.reduce(
      (s, f) => s + f.totalBookings,
      0
    );
    const totalPassengers = flightReports.reduce(
      (s, f) => s + f.totalPassengers,
      0
    );

    // Top flights by revenue
    const topFlights = [...flightReports]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Popular routes
    const routeMap = {};
    flightReports.forEach((f) => {
      const key = `${f.origin.code} → ${f.destination.code}`;
      if (!routeMap[key]) {
        routeMap[key] = {
          route: key,
          bookings: 0,
          passengers: 0,
          revenue: 0
        };
      }
      routeMap[key].bookings += f.totalBookings;
      routeMap[key].passengers += f.totalPassengers;
      routeMap[key].revenue += f.revenue;
    });
    const popularRoutes = Object.values(routeMap).sort(
      (a, b) => b.bookings - a.bookings
    );

    res.status(200).json({
      success: true,
      summary: {
        totalFlights: flights.length,
        totalBookings,
        totalPassengers,
        totalRevenue
      },
      topFlights,
      popularRoutes,
      flightReports
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Booking trends by date (last 30 days)
const getBookingTrends = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'confirmed'] }, '$totalAmount', 0]
            }
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      trends: trends.map((t) => ({
        date: t._id,
        bookings: t.bookings,
        revenue: t.revenue,
        cancelled: t.cancelled
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  addFlight,
  updateFlight,
  deleteFlight,
  getAllUsers,
  getAllBookings,
  getBookingsByFlight,
  getReports,
  getFlightReports,
  getBookingTrends
};