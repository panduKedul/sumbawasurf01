import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Waves } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setIsSubmitted(true);
        toast.success('Password reset email sent! Check your inbox.');
      } else {
        toast.error(result.error || 'Failed to send reset email');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center p-4`}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className={`p-3 ${themeClasses.headerBg} rounded-2xl shadow-2xl`}>
                <Mail className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
              Check Your Email
            </h2>
            <p className={`${themeClasses.textSecondary} mb-8`}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <div className={`${themeClasses.cardBg} p-6 rounded-2xl shadow-2xl border ${themeClasses.border} mb-6`}>
              <p className={`text-sm ${themeClasses.textSecondary} mb-4`}>
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className={`${themeClasses.button} w-full py-3 px-4 rounded-lg font-medium transition-all duration-300`}
              >
                Try Again
              </button>
            </div>
            <Link
              to="/login"
              className={`inline-flex items-center ${themeClasses.accent} hover:opacity-80 transition-opacity`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className={`p-3 ${themeClasses.headerBg} rounded-2xl shadow-2xl`}>
              <Waves className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
            Reset Password
          </h2>
          <p className={`${themeClasses.textSecondary}`}>
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Reset Form */}
        <div className={`${themeClasses.cardBg} p-8 rounded-2xl shadow-2xl border ${themeClasses.border}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 ${themeClasses.textSecondary}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} block w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${themeClasses.button} w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className={`inline-flex items-center ${themeClasses.accent} hover:opacity-80 transition-opacity`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}