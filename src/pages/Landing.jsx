import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlane,
  FaShieldAlt,
  FaMoneyBillWave,
  FaHeadset,
  FaArrowRight,
  FaGlobe,
  FaUsers,
  FaStar,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaTicketAlt,
  FaCreditCard,
  FaSuitcase
} from 'react-icons/fa';
import { MdFlightTakeoff } from 'react-icons/md';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const destinations = [
    {
      city: 'New York',
      country: 'United States',
      code: 'JFK',
      price: '₹45,999',
      image:
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop'
    },
    {
      city: 'London',
      country: 'United Kingdom',
      code: 'LHR',
      price: '₹38,500',
      image:
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop'
    },
    {
      city: 'Dubai',
      country: 'UAE',
      code: 'DXB',
      price: '₹22,999',
      image:
        'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop'
    },
    {
      city: 'Paris',
      country: 'France',
      code: 'CDG',
      price: '₹42,500',
      image:
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop'
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      code: 'NRT',
      price: '₹58,999',
      image:
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop'
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      code: 'SIN',
      price: '₹32,500',
      image:
        'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Business Traveler',
      location: 'Mumbai',
      text: 'AeroLink made my last-minute booking incredibly simple. Great prices and instant confirmation.',
      rating: 5
    },
    {
      name: 'Rahul Verma',
      role: 'Frequent Flyer',
      location: 'Bangalore',
      text: 'The seat selection feature is fantastic. I always get my preferred window seat now.',
      rating: 5
    },
    {
      name: 'Anjali Patel',
      role: 'Family Traveler',
      location: 'Delhi',
      text: 'Booked tickets for 5 family members in just 3 minutes. The whole process was seamless.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ============================================
          HERO SECTION
      ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
          <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-40 w-72 h-72 bg-blue-100 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-700 mb-6">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                <span>Trusted by 10,000+ travelers</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.05] mb-6">
                Fly to your
                <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  dream destination
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                Book flights to over 500 destinations worldwide. Compare prices
                from top airlines, choose your seat, and travel with confidence.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
                >
                  Book Your Flight <FaArrowRight />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold border-2 border-blue-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
                >
                  Sign In
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      P
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      R
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      A
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-300 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      +
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-900">
                      10,000+ happy travelers
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 text-xs">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <span className="text-gray-500 ml-1">4.8/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=900&auto=format&fit=crop"
                  alt="Airplane in flight"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
              </div>

              {/* Floating card 1 */}
              <div className="absolute top-8 -left-4 md:-left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 backdrop-blur-sm border border-blue-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Booking</div>
                  <div className="font-bold text-gray-900 text-sm">
                    Confirmed
                  </div>
                </div>
              </div>

              {/* Floating card 2 */}
              <div className="absolute bottom-8 -right-4 md:-right-8 bg-white rounded-2xl shadow-xl p-4 backdrop-blur-sm border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <MdFlightTakeoff className="text-blue-600" />
                  <div className="text-xs font-semibold text-gray-700">
                    Next Flight
                  </div>
                </div>
                <div className="font-bold text-gray-900">JFK → LHR</div>
                <div className="text-xs text-gray-500">2h 45m away</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          STATS STRIP
      ============================================ */}
      <section className="bg-blue-600 py-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '500+', label: 'Daily Flights' },
              { value: '100+', label: 'Destinations' },
              { value: '10K+', label: 'Happy Travelers' },
              { value: '4.8', label: 'Customer Rating' }
            ].map((s, i) => (
              <div key={i} className="text-center text-white">
                <div className="text-3xl md:text-4xl font-extrabold mb-1">
                  {s.value}
                </div>
                <div className="text-xs md:text-sm text-blue-100 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          POPULAR DESTINATIONS
      ============================================ */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
              EXPLORE THE WORLD
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover the most booked cities by travelers around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <Link
                key={d.code}
                to={`/search?destination=${d.code}`}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <img
                  src={d.image}
                  alt={d.city}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-blue-700">
                  {d.code}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-center gap-1 text-xs text-blue-200 mb-1">
                    <FaMapMarkerAlt />
                    <span>{d.country}</span>
                  </div>
                  <div className="text-2xl font-bold mb-2">{d.city}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-blue-200">from </span>
                      <span className="font-bold text-white">{d.price}</span>
                    </div>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <FaArrowRight className="text-blue-700 text-xs group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURES
      ============================================ */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
              WHY AEROLINK
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              We make air travel booking effortless, secure, and affordable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaShieldAlt />,
                title: 'Secure Booking',
                desc: 'Bank-level encryption protects every transaction and piece of personal data.',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: <FaMoneyBillWave />,
                title: 'Best Price Guarantee',
                desc: 'Find a lower price anywhere and we will refund the difference — no questions asked.',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: <FaHeadset />,
                title: '24/7 Support',
                desc: 'Real humans available around the clock via chat, email, and phone.',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((f, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white text-xl mb-5 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS
      ============================================ */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
              SIMPLE PROCESS
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Book your flight in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <FaGlobe />,
                title: 'Search',
                desc: 'Enter your origin, destination, and travel date to see all available flights.'
              },
              {
                step: '02',
                icon: <FaTicketAlt />,
                title: 'Select & Book',
                desc: 'Compare flights, pick your seat, add passengers, and book in seconds.'
              },
              {
                step: '03',
                icon: <FaSuitcase />,
                title: 'Pay & Fly',
                desc: 'Pay securely, receive your e-ticket with PNR instantly, and enjoy your journey.'
              }
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="bg-gradient-to-b from-blue-50 to-white rounded-2xl p-8 border-2 border-blue-100 hover:border-blue-300 transition-colors h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-600/25">
                      {s.icon}
                    </div>
                    <div className="text-5xl font-extrabold text-blue-100">
                      {s.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{s.desc}</p>
                </div>

                {/* Arrow between steps */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <FaArrowRight className="text-blue-300 text-xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          TESTIMONIALS
      ============================================ */}
      <section className="py-20 bg-blue-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="inline-block bg-white text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-sm">
              TESTIMONIALS
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Loved by Travelers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Here is what our customers say about AeroLink
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-blue-100"
              >
                <FaQuoteLeft className="text-blue-200 text-2xl mb-4" />
                <p className="text-gray-700 leading-relaxed mb-6">
                  {t.text}
                </p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <FaStar key={j} className="text-yellow-500 text-sm" />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      {t.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t.role} · {t.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CTA
      ============================================ */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-3xl p-10 md:p-16 text-center text-white">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold mb-6">
                <FaPlane />
                <span>START YOUR JOURNEY</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Ready to Fly?
              </h2>
              <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
                Join thousands of travelers who trust AeroLink for their flight
                bookings. Create your free account in under a minute.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-0.5"
                >
                  Get Started Free <FaArrowRight />
                </Link>
                <Link
                  to="/flights"
                  className="inline-flex items-center gap-2 border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Browse Flights
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;