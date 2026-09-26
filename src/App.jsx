import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchResults from './pages/SearchResults';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AddFlight from './pages/AddFlight';
import ManageFlights from './pages/ManageFlights';
import EditFlight from './pages/EditFlight';
import FlightDetails from './pages/FlightDetails';
import Payment from './pages/Payment';


function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/flight/:id" element={<FlightDetails />} />
              <Route path="/booking/:flightId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />  
              {/* User protected routes */}
              <Route
                path="/booking/:flightId"
                element={
                  <ProtectedRoute>
                    <BookingPage />
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
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin protected routes */}
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
  path="/payment/:bookingId"
  element={
    <ProtectedRoute>
      <Payment />
    </ProtectedRoute>
  }
/>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;