import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, MapPin, Waves, AlertCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SurfSpot } from '../types';
import { useAdmin } from '../contexts/AdminContext';
import { useTheme } from '../contexts/ThemeContext';
import toast from 'react-hot-toast';

interface AdminPanelProps {
  spots: SurfSpot[];
  onSpotsUpdate: () => void;
}

export default function AdminPanel({ spots, onSpotsUpdate }: AdminPanelProps) {
  const { logoutAdmin } = useAdmin();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingSpot, setEditingSpot] = useState<SurfSpot | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [tableExists, setTableExists] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    waveType: '',
    skillLevel: 'Beginner',
    bestSeason: '',
    tideConditions: '',
    latitude: 0,
    longitude: 0,
    forecastUrl: '',
    imageUrl: ''
  });

  useEffect(() => {
    checkTableExists();
  }, []);

  const checkTableExists = async () => {
    try {
      const { error } = await supabase
        .from('surf_spots')
        .select('count')
        .limit(1);
      
      if (error && (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist'))) {
        setTableExists(false);
      } else {
        setTableExists(true);
      }
    } catch (error) {
      setTableExists(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      waveType: '',
      skillLevel: 'Beginner',
      bestSeason: '',
      tideConditions: '',
      latitude: 0,
      longitude: 0,
      forecastUrl: '',
      imageUrl: ''
    });
  };

  const handleCreate = () => {
    resetForm();
    setIsCreating(true);
    setIsEditing(false);
    setEditingSpot(null);
  };

  const handleEdit = (spot: SurfSpot) => {
    setFormData({
      name: spot.name,
      description: spot.description,
      waveType: spot.waveType,
      skillLevel: spot.skillLevel,
      bestSeason: spot.bestSeason,
      tideConditions: spot.tideConditions,
      latitude: spot.coordinates[0],
      longitude: spot.coordinates[1],
      forecastUrl: spot.forecastUrl,
      imageUrl: spot.imageUrl
    });
    setEditingSpot(spot);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!tableExists) {
      toast.error('Database table not available');
      return;
    }

    setLoading(true);
    try {
      if (isCreating) {
        const { error } = await supabase
          .from('surf_spots')
          .insert([{
            name: formData.name,
            description: formData.description,
            wave_type: formData.waveType,
            skill_level: formData.skillLevel,
            best_season: formData.bestSeason,
            tide_conditions: formData.tideConditions,
            latitude: formData.latitude,
            longitude: formData.longitude,
            forecast_url: formData.forecastUrl,
            image_url: formData.imageUrl,
            is_active: true
          }]);

        if (error) throw error;
        toast.success('Surf spot created successfully!');
      } else if (editingSpot) {
        const { error } = await supabase
          .from('surf_spots')
          .update({
            name: formData.name,
            description: formData.description,
            wave_type: formData.waveType,
            skill_level: formData.skillLevel,
            best_season: formData.bestSeason,
            tide_conditions: formData.tideConditions,
            latitude: formData.latitude,
            longitude: formData.longitude,
            forecast_url: formData.forecastUrl,
            image_url: formData.imageUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSpot.id);

        if (error) throw error;
        toast.success('Surf spot updated successfully!');
      }

      handleCancel();
      onSpotsUpdate();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (spot: SurfSpot) => {
    if (!tableExists) {
      toast.error('Database table not available');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${spot.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('surf_spots')
        .update({ is_active: false })
        .eq('id', spot.id);

      if (error) throw error;
      toast.success('Surf spot deleted successfully!');
      onSpotsUpdate();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingSpot(null);
    resetForm();
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout from admin panel?')) {
      logoutAdmin();
    }
  };

  if (!tableExists) {
    return (
      <div className={`min-h-screen ${themeClasses.bg} pt-16 overflow-x-hidden`}>
        <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
          <div className={`${themeClasses.cardBg} p-4 lg:p-6 text-center rounded-xl shadow-xl`}>
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className={`text-lg lg:text-2xl font-bold ${themeClasses.text} mb-4`}>Database Setup Required</h2>
            <p className={`text-sm lg:text-base ${themeClasses.textSecondary} mb-6`}>
              The surf spots database table hasn't been created yet. Please run the SQL migration script in your Supabase dashboard to enable admin functionality.
            </p>
            <div className={`${themeClasses.cardBg} p-4 rounded-lg border ${themeClasses.border}`}>
              <p className={`text-sm ${themeClasses.textSecondary} mb-2`}>Steps to setup:</p>
              <ol className={`text-sm ${themeClasses.text} text-left space-y-1`}>
                <li>1. Go to your Supabase dashboard</li>
                <li>2. Navigate to SQL Editor</li>
                <li>3. Run the migration script to create the surf_spots table</li>
                <li>4. Refresh this page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} pt-16 overflow-x-hidden`}>
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className={`${themeClasses.cardBg} p-4 lg:p-6 rounded-xl shadow-xl`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className={`text-xl lg:text-3xl font-bold ${themeClasses.text} mb-2`}>Admin Panel</h1>
              <p className={`text-sm lg:text-base ${themeClasses.textSecondary}`}>Manage surf spots and content</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleCreate}
                disabled={loading}
                className={`${themeClasses.button} px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 text-sm transition-all duration-300 shadow-lg`}
              >
                <Plus className="w-4 h-4" />
                <span>Add New Spot</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 text-sm transition-all duration-300 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || isEditing) && (
          <div className={`${themeClasses.cardBg} p-4 lg:p-6 rounded-xl shadow-xl`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg lg:text-xl font-bold ${themeClasses.text}`}>
                {isCreating ? 'Create New Surf Spot' : 'Edit Surf Spot'}
              </h2>
              <button
                onClick={handleCancel}
                className={`${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Spot Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter spot name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Wave Type
                </label>
                <input
                  type="text"
                  value={formData.waveType}
                  onChange={(e) => setFormData({ ...formData, waveType: e.target.value })}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., Right-hand reef break"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Skill Level
                </label>
                <select
                  value={formData.skillLevel}
                  onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Best Season
                </label>
                <input
                  type="text"
                  value={formData.bestSeason}
                  onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., April to October"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Tide Conditions
                </label>
                <input
                  type="text"
                  value={formData.tideConditions}
                  onChange={(e) => setFormData({ ...formData, tideConditions: e.target.value })}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="e.g., Mid tide"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="-8.675539"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="116.767209"
                />
              </div>

              <div className="lg:col-span-2">
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 py-2 rounded-lg h-24 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Describe the surf spot..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Forecast URL
                </label>
                <input
                  type="url"
                  value={formData.forecastUrl}
                  onChange={(e) => setFormData({ ...formData, forecastUrl: e.target.value })}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://www.surf-forecast.com/..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="https://images.pexels.com/..."
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mt-6">
              <button
                onClick={handleCancel}
                disabled={loading}
                className={`px-4 py-2 ${themeClasses.textSecondary} hover:${themeClasses.text} transition-colors text-sm`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`${themeClasses.button} px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 text-sm transition-all duration-300 shadow-lg`}
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Spot'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Spots List */}
        <div className={`${themeClasses.cardBg} rounded-xl shadow-xl overflow-hidden`}>
          <div className={`p-4 lg:p-6 border-b ${themeClasses.border}`}>
            <h2 className={`text-lg lg:text-xl font-bold ${themeClasses.text}`}>Surf Spots ({spots.length})</h2>
          </div>
          
          <div className={`divide-y ${themeClasses.border}`}>
            {spots.map((spot) => (
              <div key={spot.id} className={`p-4 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:${themeClasses.buttonHover} transition-colors`}>
                <div className="flex items-start sm:items-center space-x-4 flex-1 min-w-0">
                  <div className={`p-2 ${themeClasses.accent} bg-opacity-20 rounded-lg`}>
                    <Waves className={`w-4 h-4 lg:w-5 lg:h-5 ${themeClasses.accent}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold ${themeClasses.text} text-sm lg:text-base truncate`}>{spot.name}</h3>
                    <div className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs lg:text-sm ${themeClasses.textSecondary}`}>
                      <span className="truncate">{spot.waveType}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">{spot.skillLevel}</span>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" />
                        <span className="truncate">{spot.coordinates[0].toFixed(4)}, {spot.coordinates[1].toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(spot)}
                    disabled={loading}
                    className={`p-2 ${themeClasses.textSecondary} hover:${themeClasses.accent} transition-colors`}
                  >
                    <Edit className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(spot)}
                    disabled={loading}
                    className={`p-2 ${themeClasses.textSecondary} hover:text-red-500 transition-colors`}
                  >
                    <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}