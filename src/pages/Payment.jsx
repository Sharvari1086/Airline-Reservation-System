import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaCreditCard,
  FaLock,
  FaCheckCircle,
  FaPlane,
  FaArrowLeft,
  FaUniversity,
  FaMobileAlt,
  FaMoneyCheckAlt
} from 'react-icons/fa';
import { bookingService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await bookingService.getBookingById(bookingId);
        setBooking(response.data.booking);

        if (response.data.booking.status === 'confirmed') {
          navigate(`/confirmation/${bookingId}`);
        }
      } catch (err) {
        setError('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, navigate]);

  const handleCardChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
    }

    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
    }

    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardData({ ...cardData, [name]: value });
    if (error) setError('');
  };

  const validate = () => {
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (cardData.cardNumber.replace(/\s/g, '').length !== 16) {
        setError('Card number must be 16 digits');
        return false;
      }
      if (cardData.cardName.trim().length < 2) {
        setError('Please enter cardholder name');
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
        setError('Expiry must be in MM/YY format');
        return false;
      }
      if (cardData.cvv.length !== 3) {
        setError('CVV must be 3 digits');
        return false;
      }
    }

    if (paymentMethod === 'upi') {
      if (!upiId.includes('@')) {
        setError('Enter a valid UPI ID (e.g., name@upi)');
        return false;
      }
    }

    return true;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setProcessing(true);

    try {
      const payload = {
        paymentMethod,
        ...(paymentMethod === 'credit_card' || paymentMethod === 'debit_card'
          ? cardData
          : {}),
        ...(paymentMethod === 'upi' ? { upiId } : {})
      };

      const response = await bookingService.processPayment(bookingId, payload);

      // Redirect to confirmation
      navigate(`/confirmation/${response.data.booking._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error && !booking) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
        <Link to="/my-bookings" className="btn-primary inline-block">
          My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-primary-600"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <FaLock className="text-3xl text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Secure Payment</h1>
            <p className="text-sm text-gray-500">
              Your payment information is encrypted
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

              {/* Method Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { id: 'credit_card', label: 'Credit Card', icon: <FaCreditCard /> },
                  { id: 'debit_card', label: 'Debit Card', icon: <FaMoneyCheckAlt /> },
                  { id: 'upi', label: 'UPI', icon: <FaMobileAlt /> },
                  { id: 'net_banking', label: 'Net Banking', icon: <FaUniversity /> }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(m.id);
                      setError('');
                    }}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition ${
                      paymentMethod === m.id
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-xs font-medium text-center">
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>

              <form onSubmit={handlePay}>
                {/* Card Fields */}
                {(paymentMethod === 'credit_card' ||
                  paymentMethod === 'debit_card') && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Card Number
                      </label>
                      <div className="relative">
                        <FaCreditCard className="absolute left-3 top-3.5 text-gray-400" />
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardChange}
                          className="input-field pl-10"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardChange}
                        className="input-field"
                        placeholder="Name as on card"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardData.expiry}
                          onChange={handleCardChange}
                          className="input-field"
                          placeholder="12/28"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          CVV
                        </label>
                        <input
                          type="password"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          className="input-field"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Field */}
                {paymentMethod === 'upi' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      UPI ID
                    </label>
                    <div className="relative">
                      <FaMobileAlt className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          if (error) setError('');
                        }}
                        className="input-field pl-10"
                        placeholder="yourname@upi"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Example: john@okhdfcbank, jane@ybl
                    </p>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === 'net_banking' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    You will be redirected to your bank's secure portal to
                    complete the payment after clicking Pay.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full btn-primary py-3 mt-6 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <FaLock /> Pay ${booking.totalAmount}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  By completing this payment, you agree to our Terms of Service.
                  This is a demo system; no real charge will be made.
                </p>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-primary-600 font-bold">
                  <FaPlane />
                  {booking.flightId.flightNumber}
                </div>

                <div>
                  <div className="text-xs text-gray-500">Route</div>
                  <div className="font-medium">
                    {booking.flightId.origin.code} →{' '}
                    {booking.flightId.destination.code}
                  </div>
                  <div className="text-xs text-gray-500">
                    {booking.flightId.origin.city} to{' '}
                    {booking.flightId.destination.city}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Departure</div>
                  <div className="font-medium">
                    {new Date(booking.flightId.departureTime).toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Passengers</div>
                  <div className="font-medium">{booking.passengers.length}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-500">Class</div>
                  <div className="font-medium capitalize">
                    {booking.passengers[0].class === 'firstClass'
                      ? 'First Class'
                      : booking.passengers[0].class}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="text-xs text-gray-500">PNR</div>
                  <div className="font-bold text-primary-600">
                    {booking.bookingReference}
                  </div>
                </div>

                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${booking.totalAmount}
                  </span>
                </div>
              </div>

              <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-3 flex gap-2">
                <FaCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-800">
                  Free cancellation available up to 24 hours before departure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;