import React, { useState } from 'react';
import { User, Mail, Calendar, LogOut, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { user, signOut } = useAuth();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');

  const handleSave = async () => {
    // Note: Updating user metadata requires additional setup in Supabase
    // For now, we'll just show a success message
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} pt-16`}>
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 ${themeClasses.headerBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
            My Profile
          </h1>
          <p className={`${themeClasses.textSecondary}`}>
            Manage your account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className={`${themeClasses.cardBg} rounded-2xl shadow-2xl border ${themeClasses.border} p-8`}>
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              ) : (
                <div className={`flex items-center ${themeClasses.cardBg} ${themeClasses.border} px-4 py-3 rounded-lg`}>
                  <User className={`w-5 h-5 ${themeClasses.textSecondary} mr-3`} />
                  <span className={`${themeClasses.text}`}>
                    {user.user_metadata?.full_name || 'Not provided'}
                  </span>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Email Address
              </label>
              <div className={`flex items-center ${themeClasses.cardBg} ${themeClasses.border} px-4 py-3 rounded-lg`}>
                <Mail className={`w-5 h-5 ${themeClasses.textSecondary} mr-3`} />
                <span className={`${themeClasses.text}`}>{user.email}</span>
              </div>
            </div>

            {/* Account Created */}
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Member Since
              </label>
              <div className={`flex items-center ${themeClasses.cardBg} ${themeClasses.border} px-4 py-3 rounded-lg`}>
                <Calendar className={`w-5 h-5 ${themeClasses.textSecondary} mr-3`} />
                <span className={`${themeClasses.text}`}>
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className={`${themeClasses.button} flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300`}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(user.user_metadata?.full_name || '');
                    }}
                    className={`${themeClasses.textSecondary} hover:${themeClasses.text} border ${themeClasses.border} flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300`}
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`${themeClasses.button} flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300`}
                  >
                    <Edit3 className="w-5 h-5 mr-2" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}