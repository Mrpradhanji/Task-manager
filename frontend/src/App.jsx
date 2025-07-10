import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Pending from './pages/Pending';
import Complete from './pages/Complete';
import Profile from './components/Profile';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import LandingPage from './pages/LandingPage';
import Calendar from './pages/Calendar';
import './index.css';

const API_URL = 'https://task-manager-3-3rzq.onrender.com';

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    return (stored && token) ? JSON.parse(stored) : null;
  });

  // Validate token on mount and when currentUser changes
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCurrentUser(null);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/user/me`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Invalid token');
        }

        const data = await response.json();
        if (data.success && data.user) {
          const avatarUrl = data.user.avatar 
            ? `https://task-manager-3-3rzq.onrender.com${data.user.avatar}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=random`;

          setCurrentUser(prev => ({
            ...prev,
            ...data.user,
            avatar: avatarUrl,
            token // Keep the existing token
          }));
        } else {
          throw new Error('Invalid user data');
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        // Clear invalid tokens and user data
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        // Redirect to login if we're on a protected route
        if (window.location.pathname.startsWith('/dashboard')) {
          navigate('/login', { replace: true });
        }
      }
    };

    validateToken();
  }, [navigate]);

  // Update localStorage when currentUser changes
  useEffect(() => {
    if (currentUser) {
      // Only store necessary user data in localStorage
      const userData = {
        email: currentUser.email,
        name: currentUser.name,
        id: currentUser.id,
        avatar: currentUser.avatar
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
  }, [currentUser]);

  const handleAuthSubmit = async (data) => {
    const user = {
      email: data.email,
      name: data.name || 'User',
      avatar: data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`,
      token: data.token,
      id: data.userId
    };
    setCurrentUser(user);
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    // Clear state first
    setCurrentUser(null);
    // Then clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    // Finally navigate
    setTimeout(() => navigate('/', { replace: true }), 0);
  };

  const ProtectedLayout = () => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          currentUser ? <Navigate to="/dashboard" replace /> : <LandingPage />
        } 
      />
      
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
          </div>
          )
        }
      />
      
      <Route
        path="/signup"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <SignUp onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
          </div>
          )
        }
      />

      <Route
        path="/forgot-password"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <ForgotPassword onBackToLogin={() => navigate('/login')} />
          </div>
        }
      />

      <Route
        path="/reset-password"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <ResetPassword />
          </div>
        }
      />

      <Route
        path="/dashboard"
        element={<ProtectedLayout />}
      >
        <Route index element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="pending" element={<Pending />} />
        <Route path="complete" element={<Complete />} />
      </Route>

      <Route
        path="/profile"
        element={<ProtectedLayout />}
      >
        <Route index element={<Profile setCurrentUser={setCurrentUser} onLogout={handleLogout} />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;