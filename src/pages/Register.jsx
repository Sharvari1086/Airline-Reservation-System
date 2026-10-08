import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaPlane,
  FaArrowRight
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [touched, setTouched] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from
    ? location.state.from.pathname + (location.state.from.search || '')
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (error) setError('');
    if (success) setSuccess('');

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return 'Very Weak';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    if (passwordStrength === 4) return 'Strong';
    if (passwordStrength === 5) return 'Very Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-green-500';
    if (passwordStrength === 5) return 'bg-green-700';
    return 'bg-gray-300';
  };

  const validateForm = () => {
    if (!formData.name || formData.name.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid phone number (at least 10 digits)');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const registerData = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phone: formData.phone.trim()
    };

    const result = await register(registerData);

    if (result.success) {
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate('/');
        }
      }, 1200);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100 py-10 px-4">
      {/* ============================================
          CARD
      ============================================ */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* ============================================
              LEFT: IMAGE
          ============================================ */}
          <div className="hidden md:block relative">
            <img
              src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1200&auto=format&fit=crop"
              alt="Airplane taking off"
              className="w-full h-full object-cover"
            />
          </div>

          {/* ============================================
              RIGHT: FORM
          ============================================ */}
          <div className="p-10 sm:p-12 lg:p-14 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">

              {/* Logo */}
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <div className="bg-primary-600 p-2.5 rounded-lg">
                  <FaPlane className="text-white text-lg" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  AeroLink
                </span>
              </Link>

              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                  Create Account
                </h1>
                <p className="text-sm text-gray-600">
                  {from
                    ? 'Create your account to continue with your booking'
                    : 'Join AeroLink and start your journey'}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-3 py-2.5 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-3 py-2.5 rounded-lg mb-4 text-sm">
                  {success}
                </div>
              )}

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 outline-none transition ${
                        touched.name &&
                        formData.name.length < 2 &&
                        formData.name.length > 0
                          ? 'border-red-300'
                          : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {touched.name &&
                    formData.name.length < 2 &&
                    formData.name.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Name must be at least 2 characters
                      </p>
                    )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition"
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{
                              width: `${(passwordStrength / 5) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-primary-500/20 outline-none transition ${
                        touched.confirmPassword &&
                        formData.confirmPassword &&
                        formData.confirmPassword !== formData.password
                          ? 'border-red-300'
                          : touched.confirmPassword &&
                            formData.confirmPassword === formData.password &&
                            formData.confirmPassword.length > 0
                          ? 'border-green-300'
                          : 'border-gray-200 focus:border-primary-500'
                      }`}
                      placeholder="Re-enter password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {touched.confirmPassword && formData.confirmPassword && (
                    <p
                      className={`text-xs mt-1 ${
                        formData.confirmPassword === formData.password
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {formData.confirmPassword === formData.password
                        ? 'Passwords match'
                        : 'Passwords do not match'}
                    </p>
                  )}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-600 leading-relaxed"
                  >
                    I agree to the{' '}
                    <a
                      href="#"
                      className="text-primary-600 hover:underline"
                    >
                      Terms
                    </a>{' '}
                    and{' '}
                    <a
                      href="#"
                      className="text-primary-600 hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group shadow-md shadow-primary-600/25"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Login link */}
              <div className="text-center mt-5">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    state={{ from: location.state?.from }}
                    className="text-primary-600 hover:text-primary-700 font-semibold hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;