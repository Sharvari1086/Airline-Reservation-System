import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">✈️ AeroLink</h3>
            <p className="text-gray-300">
              Your trusted airline reservation system. Book flights easily and securely.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/search" className="hover:text-white">Search Flights</a></li>
              <li><a href="/my-bookings" className="hover:text-white">My Bookings</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>📧 support@aerolink.com</li>
              <li>📞 +1 (555) 123-4567</li>
              <li>📍 123 Aviation Blvd, NYC</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
          <p>&copy; 2024 AeroLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;