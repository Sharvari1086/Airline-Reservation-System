const nodemailer = require('nodemailer');

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[character];
  });

const formatDate = (value) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: process.env.MAIL_TIME_ZONE || 'Asia/Kolkata'
  }).format(new Date(value));

const sendBookingConfirmation = async (booking) => {
  const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error('SMTP_HOST, SMTP_USER, and SMTP_PASSWORD must be configured');
  }
  if (!booking.userId?.email || !booking.flightId) {
    throw new Error('Booking email requires a populated account and flight');
  }

  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP_PORT must be a valid port number');
  }

  const flight = booking.flightId;
  const recipientName = booking.userId.name || booking.userId.email;
  const departure = formatDate(flight.departureTime);
  const arrival = formatDate(flight.arrivalTime);
  const amount = `₹${Number(booking.totalAmount).toLocaleString('en-IN')}`;
  const passengers = booking.passengers
    .map((passenger) => {
      const seat = passenger.seatNumber ? ` - seat ${passenger.seatNumber}` : '';
      return `${passenger.name} (${passenger.class || 'economy'}${seat})`;
    });
  const safePassengers = passengers.map(escapeHtml);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD }
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || SMTP_USER,
    to: booking.userId.email,
    subject: `Booking confirmation - ${booking.bookingReference}`,
    text: [
      `Hello ${recipientName},`,
      '',
      'Your flight booking is confirmed.',
      `Booking reference (PNR): ${booking.bookingReference}`,
      `Flight: ${flight.airline} ${flight.flightNumber}`,
      `From: ${flight.origin.city} (${flight.origin.code})`,
      `To: ${flight.destination.city} (${flight.destination.code})`,
      `Departure: ${departure}`,
      `Arrival: ${arrival}`,
      `Passengers: ${passengers.join(', ')}`,
      `Total: ${amount}`,
      `Payment status: ${booking.paymentStatus}`,
      `Payment method: ${booking.paymentDetails?.method || 'Not specified'}`
    ].join('\n'),
    html: `
      <div style="font-family:Arial,sans-serif;color:#1f2937;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">Your booking is confirmed</h2>
        <p>Hello ${escapeHtml(recipientName)},</p>
        <p>Here are the details for your flight booking.</p>
        <p><strong>Booking reference (PNR):</strong> ${escapeHtml(booking.bookingReference)}</p>
        <h3>${escapeHtml(flight.airline)} ${escapeHtml(flight.flightNumber)}</h3>
        <p><strong>From:</strong> ${escapeHtml(flight.origin.city)} (${escapeHtml(flight.origin.code)})<br>
        <strong>To:</strong> ${escapeHtml(flight.destination.city)} (${escapeHtml(flight.destination.code)})</p>
        <p><strong>Departure:</strong> ${escapeHtml(departure)}<br>
        <strong>Arrival:</strong> ${escapeHtml(arrival)}</p>
        <p><strong>Passengers:</strong></p>
        <ul>${safePassengers.map((passenger) => `<li>${passenger}</li>`).join('')}</ul>
        <p><strong>Total:</strong> ${escapeHtml(amount)}<br>
        <strong>Payment status:</strong> ${escapeHtml(booking.paymentStatus)}<br>
        <strong>Payment method:</strong> ${escapeHtml(booking.paymentDetails?.method || 'Not specified')}</p>
      </div>
    `
  });
};

module.exports = { sendBookingConfirmation };
