import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomeRouter from './pages/HomeRouter';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import FlightDetails from './pages/FlightDetails';
import BookingPage from './pages/BookingPage';
import Payment from './pages/Payment';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import RescheduleBooking from './pages/RescheduleBooking';
import Profile from './pages/Profile';

import AdminDashboard from './pages/AdminDashboard';
import AddFlight from './pages/AddFlight';
import ManageFlights from './pages/ManageFlights';
import EditFlight from './pages/EditFlight';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';
import AdminReports from './pages/AdminReports';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* ============ PUBLIC ROUTES ============ */}
            <Route path="/" element={<HomeRouter />} />
            <Route path="/flights" element={<SearchResults />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/flight/:id" element={<FlightDetails />} />

            {/* ============ USER PROTECTED ROUTES ============ */}
            <Route
              path="/booking/:flightId"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:bookingId"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/confirmation/:bookingId"
              element={
                <ProtectedRoute>
                  <BookingConfirmation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reschedule/:bookingId"
              element={
                <ProtectedRoute>
                  <RescheduleBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* ============ ADMIN PROTECTED ROUTES ============ */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-flight"
              element={
                <ProtectedRoute adminOnly>
                  <AddFlight />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-flights"
              element={
                <ProtectedRoute adminOnly>
                  <ManageFlights />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-flight/:id"
              element={
                <ProtectedRoute adminOnly>
                  <EditFlight />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute adminOnly>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute adminOnly>
                  <AdminReports />
                </ProtectedRoute>
              }
            />

            {/* ============ 404 ============ */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;