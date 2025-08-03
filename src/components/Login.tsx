import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Waves } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { signIn, loading } = useAuth();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn(formData.email, formData.password);

      if (!result.success) {
        toast.error(result.error || 'Failed to sign in');
      } else {
        toast.success('Login successful');
        window.location.href = '/'; // ✅ redirect ke halaman utama tanpa useRouter
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
            Welcome Back
          </h2>
          <p className={`${themeClasses.textSecondary}`}>
            Sign in to your Sumbawa Surf Guide account
          </p>
        </div>

        {/* Login Form */}
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
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} block w-full pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your password"
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

            {/* Forgot Password Link */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className={`${themeClasses.accent} hover:opacity-80 transition-opacity`}
                >
                  Forgot your password?
                </Link>
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
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${themeClasses.textSecondary}`}>
              Don't have an account?{' '}
              <Link
                to="/register"
                className={`${themeClasses.accent} hover:opacity-80 transition-opacity font-medium`}
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}