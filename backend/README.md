# Backend email configuration

After a booking is confirmed or payment succeeds, the backend emails the booking
reference, flight itinerary, passenger names/seats, fare, and payment status to
the email address on the user's account.

Configure SMTP delivery in `backend/.env`:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
MAIL_FROM=bookings@example.com
MAIL_TIME_ZONE=Asia/Kolkata
```

Use port `465` with `SMTP_SECURE=true` when required by your mail provider. Set
`MAIL_FROM` to a sender address permitted by that provider. Restart the backend
after changing these settings. If SMTP delivery fails, the booking/payment
remains successful, the backend logs the delivery error, and the API response
reports that the email could not be sent.
