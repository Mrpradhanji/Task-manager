import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = ({ onBackToLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_URL = import.meta.env.VITE_API_URL;

  // Get the current user's email if they're logged in
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_URL}/api/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: data.message || 'If your email is registered, you will receive a password reset link.'
        });
        // If user is authenticated, redirect back to profile after 2 seconds
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
          setTimeout(() => {
            navigate('/profile');
          }, 2000);
        } else {
          setEmail('');
        }
      } else {
        throw new Error(data.message || 'Failed to process request');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#00FFFF]/20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
        <p className="text-gray-400">Enter your email to reset your password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {message.text && (
          <div className={`px-4 py-3 rounded-lg text-sm ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-500'
              : 'bg-red-500/10 border border-red-500/20 text-red-500'
          }`}>
            {message.text}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-[#0A0A0A] border border-[#00FFFF]/20 rounded-lg text-white focus:outline-none focus:border-[#00FFFF] focus:ring-1 focus:ring-[#00FFFF] transition-colors"
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#00FFFF] text-[#0A0A0A] py-2 px-4 rounded-lg font-medium hover:bg-[#00FFFF]/90 focus:outline-none focus:ring-2 focus:ring-[#00FFFF] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              Sending Reset Link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-[#00FFFF] hover:text-[#00FFFF]/80 font-medium transition-colors"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword; 