import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlane, 
  FaGlobe, 
  FaUsers, 
  FaStar, 
  FaShieldAlt, 
  FaMoneyBillWave, 
  FaHeadset,
  FaRocket,
  FaSearch,
  FaClock,
  FaCreditCard,
  FaRoute
} from 'react-icons/fa';
import { MdFlightTakeoff, MdFlightLand } from 'react-icons/md';
import { FiChevronRight } from 'react-icons/fi';
import { BiWorld } from 'react-icons/bi';
import FlightSearch from '../components/FlightSearch';
import { flightService } from '../services/api';

const Home = () => {
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await flightService.getDestinations();
        const destinations = response.data.destinations?.slice(0, 6) || [
          'New York', 'London', 'Dubai', 'Singapore', 'Tokyo', 'Paris'
        ];
        setPopularDestinations(destinations);
      } catch (error) {
        console.error('Failed to fetch destinations:', error);
        setPopularDestinations(['New York', 'London', 'Dubai', 'Singapore', 'Tokyo', 'Paris']);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="container-custom relative z-10 py-20 md:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <FaPlane className="text-white" />
              <span>Welcome to AeroLink</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Book Your Dream Flight
              <span className="block text-primary-200">With Confidence</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-2xl mx-auto mb-8">
              Discover the best flight deals, compare prices, and book your next adventure with ease.
              Your journey begins here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/flights"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FaSearch className="text-primary-600" />
                Browse Flights
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-700 transition-all duration-300"
              >
                <FaRocket />
                Join Now
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path fill="#f3f4f6" fillOpacity="1" d="M0,64L80,74.7C160,85,320,107,480,101.3C640,96,800,64,960,58.7C1120,53,1280,75,1360,85.3L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Search Section */}
      <section className="container-custom -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <FlightSearch />
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <FaPlane className="text-3xl text-primary-600" />, label: 'Flights', value: '500+' },
            { icon: <BiWorld className="text-3xl text-primary-600" />, label: 'Destinations', value: '100+' },
            { icon: <FaUsers className="text-3xl text-primary-600" />, label: 'Happy Customers', value: '10K+' },
            { icon: <FaStar className="text-3xl text-primary-600" />, label: 'Rating', value: '4.8/5' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-center mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-primary-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Choose AeroLink?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make your travel experience seamless, secure, and affordable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FaShieldAlt className="text-4xl text-primary-600" />,
              title: 'Secure Booking',
              description: 'Your payments and personal information are protected with enterprise-grade security',
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: <FaMoneyBillWave className="text-4xl text-primary-600" />,
              title: 'Best Price Guarantee',
              description: 'Get the best deals and competitive fares on all flights with our price match promise',
              color: 'from-green-500 to-green-600'
            },
            {
              icon: <FaHeadset className="text-4xl text-primary-600" />,
              title: '24/7 Customer Support',
              description: 'Our dedicated team is always available to assist you with your bookings and queries',
              color: 'from-purple-500 to-purple-600'
            }
          ].map((feature, index) => (
            <div key={index} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-50 rounded-xl group-hover:bg-primary-100 transition-colors">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center gap-1 text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
                  Learn More <FiChevronRight className="text-xs" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Popular Destinations
            </h2>
            <p className="text-gray-600">
              Explore the most booked routes by our travelers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((destination, index) => (
              <Link
                key={index}
                to={`/flights?destination=${destination}`}
                className="group bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center hover:bg-primary-50"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                  <MdFlightLand className="mx-auto text-primary-600" />
                </div>
                <div className="font-medium text-gray-800">{destination}</div>
                <div className="text-xs text-gray-500 mt-1">Popular route</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom py-16">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-primary-100 max-w-2xl mx-auto mb-6">
            Join thousands of happy travelers who trust AeroLink for their flight bookings
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3 rounded-full font-semibold hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaRocket />
              Get Started
            </Link>
            <Link
              to="/flights"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-700 transition-all duration-300"
            >
              <FaSearch />
              Search Flights
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;