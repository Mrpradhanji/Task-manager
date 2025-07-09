import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const API_URL = 'https://task-manager-3-37o6.onrender.com';

const Login = ({ onSubmit, onSwitchMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    terms: false
  });

  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    }
    // Check for success message in location state
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const validateToken = async (token) => {
        try {
      const response = await fetch(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
          if (data.success) {
          onSubmit({
            email: data.user.email,
            name: data.user.name,
            token,
            userId: data.user.id
          });
        }
          }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('token');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.terms) {
      setError('Please accept the Terms & Conditions to continue');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        onSubmit({
          email: data.user.email,
          name: data.user.name,
          token: data.token,
          userId: data.user.id
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An error occurred during login');
      // Clear any existing invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="bg-[#0A0A0A] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#00FFFF]/20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Sign in to continue to RTASK</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#00FFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-colors"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#00FFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-colors pr-10"
              placeholder="Enter your password"
            />
              <button
                type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00FFFF] transition-colors"
              >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="h-4 w-4 rounded border-[#00FFFF]/20 bg-[#0A0A0A] text-[#00FFFF] focus:ring-[#00FFFF] focus:ring-offset-[#0A0A0A]"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
              Terms & Conditions
            </label>
          </div>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-[#00FFFF] hover:text-[#00FFFF]/80 font-medium transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#00FFFF] text-[#0A0A0A] py-2 px-4 rounded-lg font-medium hover:bg-[#00FFFF]/90 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="text-center text-sm">
          <span className="text-gray-400">Don't have an account? </span>
        <button
          type="button"
            onClick={onSwitchMode}
            className="text-[#00FFFF] hover:text-[#00FFFF]/80 font-medium transition-colors"
        >
            Sign up
        </button>
        </div>
      </form>
    </div>
  );
};

export default Login;