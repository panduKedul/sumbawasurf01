import React, { useState, useEffect } from 'react';
import { User, Edit, Save, X, LogOut, Mail, Trophy, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

interface UserProfileProps {
  onClose: () => void;
}

interface Profile {
  id: string;
  email: string;
  username: string | null;
  skill_level: string | null;
  created_at: string;
  updated_at: string;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    skill_level: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast.error('Profile not found');
        return;
      }
      
      setProfile(data);
      setFormData({
        username: data.username || '',
        skill_level: data.skill_level || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username || null,
          skill_level: formData.skill_level || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile({
        ...profile,
        username: formData.username || null,
        skill_level: formData.skill_level || null,
        updated_at: new Date().toISOString()
      });

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        skill_level: profile.skill_level || ''
      });
    }
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {profile && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {profile.username || 'Anonymous Surfer'}
                </h3>
                <p className="text-gray-600">{profile.email}</p>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Username</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter username"
                      />
                    ) : (
                      <p className="text-gray-600">{profile.username || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Trophy className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Skill Level</p>
                    {isEditing ? (
                      <select
                        value={formData.skill_level}
                        onChange={(e) => setFormData({ ...formData, skill_level: e.target.value })}
                        className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select skill level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Pro">Pro</option>
                      </select>
                    ) : (
                      <p className="text-gray-600">{profile.skill_level || 'Not set'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Member Since</p>
                    <p className="text-gray-600">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}