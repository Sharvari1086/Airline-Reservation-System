const searchFlights = async (req, res) => {
  try {
    const {
      origin,
      destination,
      date,
      class: seatClass,
      airline,
      minPrice,
      maxPrice,
      sortBy
    } = req.query;

    const query = {};

    if (origin) query['origin.code'] = origin.toUpperCase();
    if (destination) query['destination.code'] = destination.toUpperCase();
    if (airline) query.airline = { $regex: airline, $options: 'i' };

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.departureTime = { $gte: startDate, $lte: endDate };
    }

    query.availableSeats = { $gt: 0 };
    query.status = { $in: ['scheduled', 'delayed'] };

    const fareClass = seatClass || 'economy';

    // Build price filter
    if (minPrice || maxPrice) {
      const farePath = `fare.${fareClass}`;
      query[farePath] = {};
      if (minPrice) query[farePath].$gte = Number(minPrice);
      if (maxPrice) query[farePath].$lte = Number(maxPrice);
    }

    let sortOptions = { departureTime: 1 };
    if (sortBy === 'price_low') {
      sortOptions = { [`fare.${fareClass}`]: 1 };
    } else if (sortBy === 'price_high') {
      sortOptions = { [`fare.${fareClass}`]: -1 };
    } else if (sortBy === 'duration') {
      sortOptions = { departureTime: 1 };
    } else if (sortBy === 'departure_early') {
      sortOptions = { departureTime: 1 };
    } else if (sortBy === 'departure_late') {
      sortOptions = { departureTime: -1 };
    }

    const flights = await Flight.find(query).sort(sortOptions);

    const formattedFlights = flights.map((flight) => {
      const flightObj = flight.toObject();
      const selectedFare = flight.fare[fareClass] || flight.fare.economy;

      return {
        ...flightObj,
        selectedFare: selectedFare,
        requestedClass: fareClass
      };
    });

    // Get unique airlines for filter dropdown
    const airlines = await Flight.distinct('airline');

    res.status(200).json({
      success: true,
      count: formattedFlights.length,
      airlines,
      flights: formattedFlights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};