import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const token = searchParams.get('token');
  console.log('Reset password page loaded with token:', token);
  console.log('Token length:', token?.length);

  useEffect(() => {
    if (!token) {
      console.log('No token found in URL');
      setMessage({
        type: 'error',
        text: 'Invalid or missing reset token. Please request a new password reset link.'
      });
      return;
    }

    // Validate token format
    if (token.length !== 64) {
      console.log('Invalid token length:', token.length);
      setMessage({
        type: 'error',
        text: 'Invalid reset token format. Please request a new password reset link.'
      });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      console.log('Submit attempted without token');
      setMessage({
        type: 'error',
        text: 'Invalid or missing reset token. Please request a new password reset link.'
      });
      return;
    }

    if (token.length !== 64) {
      console.log('Invalid token length on submit:', token.length);
      setMessage({
        type: 'error',
        text: 'Invalid reset token format. Please request a new password reset link.'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log('Password mismatch');
      setMessage({
        type: 'error',
        text: 'Passwords do not match'
      });
      return;
    }

    if (formData.password.length < 8) {
      console.log('Password too short');
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters long'
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Sending reset password request with token:', token);
      console.log('Token length being sent:', token.length);
      
      const API_URL = 'https://task-manager-3-37o6.onrender.com';
      const response = await fetch(`${API_URL}/api/user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          newPassword: formData.password
        })
      });

      const data = await response.json();
      console.log('Reset password response:', data);

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Password has been reset successfully. Redirecting to login...'
        });
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        throw new Error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="bg-[#0A0A0A] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#00FFFF]/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h2>
            <p className="text-gray-400 mb-6">The password reset link is invalid or has expired.</p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-[#00FFFF] hover:text-[#00FFFF]/80 font-medium transition-colors"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="bg-[#0A0A0A] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#00FFFF]/20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
          <p className="text-gray-400">Enter your new password</p>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              New Password
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
                placeholder="Enter new password"
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
              Confirm New Password
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
                placeholder="Confirm new password"
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
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 