import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'https://task-manager-3-3rzq.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success && data.token) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        setError('');
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please sign in to continue.' 
          }
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration');
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
        <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-400">Join RTASK to manage your tasks</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
        </div>
      )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#00FFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-colors"
            placeholder="Enter your full name"
          />
        </div>

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
              minLength="8"
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#00FFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-colors pr-10"
              placeholder="Create a password"
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="8"
              className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#00FFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-colors pr-10"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#00FFFF] text-[#0A0A0A] py-2 px-4 rounded-lg font-medium hover:bg-[#00FFFF]/90 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Creating Account...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              Sign Up
            </>
          )}
        </button>

        <div className="text-center text-sm">
          <span className="text-gray-400">Already have an account? </span>
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-[#00FFFF] hover:text-[#00FFFF]/80 font-medium transition-colors"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
