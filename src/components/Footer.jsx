import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlane,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaShieldAlt,
  FaHeadset,
  FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <footer className="bg-blue-50 border-t border-blue-100 text-gray-700 mt-auto">
      {/* Main Footer */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                <FaPlane className="text-white text-sm" />
              </div>
              <span className="text-lg font-bold text-gray-900">AeroLink</span>
            </Link>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              India's trusted airline reservation platform connecting you to
              over 500 destinations worldwide.
            </p>
            <div className="flex gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 bg-white hover:bg-primary-600 hover:text-white text-gray-600 rounded-md flex items-center justify-center transition shadow-sm"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-xs" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 bg-white hover:bg-primary-600 hover:text-white text-gray-600 rounded-md flex items-center justify-center transition shadow-sm"
                aria-label="Twitter"
              >
                <FaTwitter className="text-xs" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 bg-white hover:bg-primary-600 hover:text-white text-gray-600 rounded-md flex items-center justify-center transition shadow-sm"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xs" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 bg-white hover:bg-primary-600 hover:text-white text-gray-600 rounded-md flex items-center justify-center transition shadow-sm"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-xs" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary-600 transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/flights"
                  className="text-gray-600 hover:text-primary-600 transition"
                >
                  Search Flights
                </Link>
              </li>
              {isAuthenticated && !isAdmin && (
                <>
                  <li>
                    <Link
                      to="/my-bookings"
                      className="text-gray-600 hover:text-primary-600 transition"
                    >
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="text-gray-600 hover:text-primary-600 transition"
                    >
                      My Profile
                    </Link>
                  </li>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="text-gray-600 hover:text-primary-600 transition"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="text-gray-600 hover:text-primary-600 transition"
                    >
                      Create Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wide">
              Support
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary-600 transition"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary-600 transition"
                >
                  Cancellation Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary-600 transition"
                >
                  Refund Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary-600 transition"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary-600 transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-primary-600 transition"
                >
                  Baggage Info
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-xs uppercase tracking-wide">
              Contact Us
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-primary-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  AeroLink Technologies Pvt. Ltd.
                  <br />
                  BKC, Mumbai 400051, India
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-primary-600 flex-shrink-0" />
                <a
                  href="tel:+918012345678"
                  className="text-gray-600 hover:text-primary-600 transition"
                >
                  +91 80 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-primary-600 flex-shrink-0" />
                <a
                  href="mailto:support@aerolink.in"
                  className="text-gray-600 hover:text-primary-600 transition"
                >
                  support@aerolink.in
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-blue-100">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <p>
              © {new Date().getFullYear()} AeroLink Technologies Pvt. Ltd.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#"
                className="hover:text-primary-600 transition"
              >
                Terms
              </a>
              <span className="text-blue-200">|</span>
              <a
                href="#"
                className="hover:text-primary-600 transition"
              >
                Privacy
              </a>
              <span className="text-blue-200">|</span>
              <a
                href="#"
                className="hover:text-primary-600 transition"
              >
                Cookies
              </a>
            </div>
            <p className="flex items-center gap-1">
              <FaShieldAlt className="text-green-500" />
              PCI DSS Compliant
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;