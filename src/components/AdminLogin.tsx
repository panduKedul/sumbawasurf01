import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { loginAdmin, toggleAdminLogin } = useAdmin();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await loginAdmin(email, password);
      if (success) {
        toast.success('Admin login successful!');
        setEmail('');
        setPassword('');
        toggleAdminLogin(); // Close the login modal
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 ${themeClasses.theme === 'dark' ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm z-50 flex items-center justify-center p-4`}>
      <div className={`${themeClasses.cardBg} max-w-md w-full p-4 sm:p-6 rounded-xl shadow-sm border ${themeClasses.border}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 ${themeClasses.headerBg} rounded-lg shadow-sm`}>
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-lg sm:text-xl font-bold ${themeClasses.text}`}>Admin Access</h2>
          </div>
          <button
            onClick={toggleAdminLogin}
            className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs sm:text-sm font-medium ${themeClasses.text} mb-2`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div>
            <label className={`block text-xs sm:text-sm font-medium ${themeClasses.text} mb-2`}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`${themeClasses.button} w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center space-x-2 text-xs sm:text-sm transition-all duration-300 shadow-sm`}
          >
            <Lock className="w-5 h-5" />
            <span>{loading ? 'Logging in...' : 'Login as Admin'}</span>
          </button>
        </form>

        <div className={`mt-4 sm:mt-6 p-3 sm:p-4 ${themeClasses.cardBg} rounded-lg border ${themeClasses.border}`}>
          <p className={`text-xs ${themeClasses.textSecondary} text-center`}>
            Admin access is required to manage surf spots and content
          </p>
        </div>
      </div>
    </div>
  );
}