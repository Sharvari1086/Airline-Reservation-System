const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Flight = require('./models/Flight');

dotenv.config();

const flights = [
  {
    flightNumber: 'AI101',
    airline: 'Air India',
    origin: { city: 'New York', airport: 'JFK International Airport', code: 'JFK' },
    destination: { city: 'Los Angeles', airport: 'LAX International Airport', code: 'LAX' },
    departureTime: new Date('2026-12-25T10:00:00'),
    arrivalTime: new Date('2026-12-25T13:30:00'),
    duration: '3h 30m',
    totalSeats: 180,
    availableSeats: 150,
    fare: { economy: 24999, business: 49999, firstClass: 89999 },
    status: 'scheduled'
  },
  {
    flightNumber: 'UA202',
    airline: 'United Airlines',
    origin: { city: 'London', airport: 'Heathrow Airport', code: 'LHR' },
    destination: { city: 'New York', airport: 'JFK International Airport', code: 'JFK' },
    departureTime: new Date('2026-12-26T14:00:00'),
    arrivalTime: new Date('2026-12-26T22:30:00'),
    duration: '8h 30m',
    totalSeats: 220,
    availableSeats: 180,
    fare: { economy: 37999, business: 74999, firstClass: 124999 },
    status: 'scheduled'
  },
  {
    flightNumber: 'BA303',
    airline: 'British Airways',
    origin: { city: 'Mumbai', airport: 'Chhatrapati Shivaji Airport', code: 'BOM' },
    destination: { city: 'London', airport: 'Heathrow Airport', code: 'LHR' },
    departureTime: new Date('2026-12-27T02:00:00'),
    arrivalTime: new Date('2026-12-27T06:30:00'),
    duration: '9h 30m',
    totalSeats: 250,
    availableSeats: 220,
    fare: { economy: 45999, business: 99999, firstClass: 209999 },
    status: 'scheduled'
  },
  {
    flightNumber: 'EK404',
    airline: 'Emirates',
    origin: { city: 'Dubai', airport: 'Dubai International Airport', code: 'DXB' },
    destination: { city: 'London', airport: 'Heathrow Airport', code: 'LHR' },
    departureTime: new Date('2026-12-28T08:00:00'),
    arrivalTime: new Date('2026-12-28T12:00:00'),
    duration: '4h 00m',
    totalSeats: 300,
    availableSeats: 250,
    fare: { economy: 33999, business: 74999, firstClass: 169999 },
    status: 'scheduled'
  },
  {
    flightNumber: 'SQ308',
    airline: 'Singapore Airlines',
    origin: { city: 'Singapore', airport: 'Changi Airport', code: 'SIN' },
    destination: { city: 'Tokyo', airport: 'Narita International Airport', code: 'NRT' },
    departureTime: new Date('2026-12-29T09:00:00'),
    arrivalTime: new Date('2026-12-29T17:00:00'),
    duration: '8h 00m',
    totalSeats: 280,
    availableSeats: 200,
    fare: { economy: 49999, business: 124999, firstClass: 249999 },
    status: 'scheduled'
  },
  {
    flightNumber: 'AI505',
    airline: 'Air India',
    origin: { city: 'Delhi', airport: 'Indira Gandhi International Airport', code: 'DEL' },
    destination: { city: 'Mumbai', airport: 'Chhatrapati Shivaji Airport', code: 'BOM' },
    departureTime: new Date('2026-12-30T07:00:00'),
    arrivalTime: new Date('2026-12-30T09:15:00'),
    duration: '2h 15m',
    totalSeats: 160,
    availableSeats: 140,
    fare: { economy: 4999, business: 11999, firstClass: 21999 },
    status: 'scheduled'
  },
  {
    flightNumber: 'AF606',
    airline: 'Air France',
    origin: { city: 'Paris', airport: 'Charles de Gaulle Airport', code: 'CDG' },
    destination: { city: 'New York', airport: 'JFK International Airport', code: 'JFK' },
    departureTime: new Date('2027-01-02T11:00:00'),
    arrivalTime: new Date('2027-01-02T14:30:00'),
    duration: '8h 30m',
    totalSeats: 240,
    availableSeats: 200,
    fare: { economy: 39999, business: 79999, firstClass: 154999 },
    status: 'scheduled'
  },
  {
    flightNumber: 'QF707',
    airline: 'Qantas',
    origin: { city: 'Sydney', airport: 'Sydney Kingsford Smith Airport', code: 'SYD' },
    destination: { city: 'Singapore', airport: 'Changi Airport', code: 'SIN' },
    departureTime: new Date('2027-01-03T13:00:00'),
    arrivalTime: new Date('2027-01-03T19:00:00'),
    duration: '8h 00m',
    totalSeats: 260,
    availableSeats: 210,
    fare: { economy: 43999, business: 94999, firstClass: 189999 },
    status: 'scheduled'
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Flight.deleteMany({});
    console.log('Cleared existing flights');

    const inserted = await Flight.insertMany(flights);
    console.log(`Inserted ${inserted.length} flights`);

    inserted.forEach((f) => {
      console.log(
        `${f.flightNumber} | ${f.airline} | ${f.origin.code} to ${f.destination.code} | ₹${f.fare.economy}`
      );
    });

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

seed();