import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, UserPlus, Waves } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { signUp, loading } = useAuth();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await signUp(formData.email, formData.password, formData.fullName);
      
      if (result.success) {
        if (result.error) {
          // This is the email verification message
          toast.success(result.error);
        } else {
          toast.success('Account created successfully!');
        }
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
        });
      } else {
        toast.error(result.error || 'Failed to create account');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {/* Back Button */}
          <div className="flex justify-start mb-4">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center space-x-2 ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Back to Home</span>
            </button>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className={`p-3 ${themeClasses.headerBg} rounded-2xl shadow-2xl`}>
              <Waves className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
            Join Sumbawa Surf Guide
          </h2>
          <p className={`${themeClasses.textSecondary}`}>
            Create your account to access exclusive surf spots
          </p>
        </div>

        {/* Register Form */}
        <div className={`${themeClasses.cardBg} p-8 rounded-2xl shadow-2xl border ${themeClasses.border}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${themeClasses.textSecondary}`} />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} block w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} block w-full pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${themeClasses.textSecondary}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} block w-full pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${themeClasses.textSecondary}`} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} block w-full pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className={`${themeClasses.button} w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting || loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${themeClasses.textSecondary}`}>
              Already have an account?{' '}
              <Link
                to="/login"
                className={`${themeClasses.accent} hover:opacity-80 transition-opacity font-medium`}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}