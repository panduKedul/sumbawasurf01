import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { loginAdmin, toggleAdminLogin } = useAdmin();
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card-elegant max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-neon-blue rounded-lg">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Admin Access</h2>
          </div>
          <button
            onClick={toggleAdminLogin}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-elegant w-full px-4 py-3 rounded-lg"
              placeholder="Enter admin email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-elegant w-full px-4 py-3 pr-12 rounded-lg"
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-elegant w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <Lock className="w-5 h-5" />
            <span>{loading ? 'Logging in...' : 'Login as Admin'}</span>
          </button>
        </form>

        <div className="mt-6 p-4 bg-dark-400 rounded-lg border border-dark-300">
          <p className="text-xs text-gray-400 text-center">
            Admin access is required to manage surf spots and content
          </p>
        </div>
      </div>
    </div>
  );
}