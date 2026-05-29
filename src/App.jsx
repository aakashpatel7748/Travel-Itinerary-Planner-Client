import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateItinerary from './pages/CreateItinerary';
import ItineraryDetailsPage from './pages/ItineraryDetailsPage';
import ShareItinerary from './pages/ShareItinerary';

// Route protection for Authenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.spinnerContainer}>
        <p>Verifying authentication session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route protection for Unauthenticated users (Guests only!)
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.spinnerContainer}>
        <p>Verifying authentication session...</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Root Router Redirector
const RootRedirector = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.spinnerContainer}>
        <p>Loading application...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={styles.appContainer} className="d-flex flex-column">
          <Navbar />
          <main style={styles.mainContent} className="flex-grow-1">
            <Routes>
              {/* Public Routes (Guests only) */}
              <Route 
                path="/login" 
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <GuestRoute>
                    <Signup />
                  </GuestRoute>
                } 
              />

              {/* Public Sharing Itinerary Route (No Authentication required!) */}
              <Route path="/share/:token" element={<ShareItinerary />} />

              {/* Protected Traveler Boards */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-itinerary"
                element={
                  <ProtectedRoute>
                    <CreateItinerary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/itinerary/:id"
                element={
                  <ProtectedRoute>
                    <ItineraryDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Retro-compatibility Redirects for recruiter/candidate dashboards */}
              <Route
                path="/candidate-dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter-dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback & Redirects */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#070a13'
  },
  mainContent: {
    flex: '1 0 auto'
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#070a13',
    color: '#94a3b8',
    fontSize: '0.95rem',
    fontWeight: '550'
  }
};

export default App;
