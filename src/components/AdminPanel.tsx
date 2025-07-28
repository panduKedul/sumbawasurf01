import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, MapPin, Waves, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { SurfSpot } from '../types';
import { useAdmin } from '../contexts/AdminContext';
import toast from 'react-hot-toast';

interface AdminPanelProps {
  spots: SurfSpot[];
  onSpotsUpdate: () => void;
}

export default function AdminPanel({ spots, onSpotsUpdate }: AdminPanelProps) {
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

  const { logoutAdmin } = useAdmin();

  if (!tableExists) {
    return (
      <div className="min-h-screen bg-dark-100 overflow-x-hidden">
        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6 max-w-4xl mx-auto">
        <div className="card-elegant p-3 lg:p-6 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-lg lg:text-2xl font-bold text-white mb-4">Database Setup Required</h2>
          <p className="text-sm lg:text-base text-gray-300 mb-4 lg:mb-6">
            The surf spots database table hasn't been created yet. Please run the SQL migration script in your Supabase dashboard to enable admin functionality.
          </p>
          <div className="bg-dark-400 p-3 lg:p-4 rounded-lg border border-dark-300">
            <p className="text-xs lg:text-sm text-gray-400 mb-2">Steps to setup:</p>
            <ol className="text-xs lg:text-sm text-gray-300 text-left space-y-1">
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
    <div className="min-h-screen bg-dark-100 overflow-x-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg lg:text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-xs lg:text-base text-gray-400">Manage surf spots and content</p>
        </div>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-3">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="btn-elegant px-3 lg:px-6 py-2 lg:py-3 rounded-lg font-medium flex items-center justify-center space-x-2 text-xs lg:text-base"
          >
            <Plus className="w-3 h-3 lg:w-5 lg:h-5" />
            <span>Add New Spot</span>
          </button>
          <button
            onClick={handleLogout}
            className="btn-elegant px-3 lg:px-4 py-2 lg:py-3 rounded-lg font-medium flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 border-red-400/30 hover:border-red-300/50 bg-red-500/10 hover:bg-red-500/20 text-xs lg:text-base"
          >
            <X className="w-3 h-3 lg:w-5 lg:h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || isEditing) && (
        <div className="card-elegant p-3 lg:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base lg:text-xl font-bold text-white">
              {isCreating ? 'Create New Surf Spot' : 'Edit Surf Spot'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Spot Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-elegant w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-xs lg:text-sm"
                placeholder="Enter spot name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Wave Type
              </label>
              <input
                type="text"
                value={formData.waveType}
                onChange={(e) => setFormData({ ...formData, waveType: e.target.value })}
                className="input-elegant w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-xs lg:text-sm"
                placeholder="e.g., Right-hand reef break"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Skill Level
              </label>
              <select
                value={formData.skillLevel}
                onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                className="input-elegant w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-xs lg:text-sm"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Best Season
              </label>
              <input
                type="text"
                value={formData.bestSeason}
                onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                className="input-elegant w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-xs lg:text-sm"
                placeholder="e.g., April to October"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tide Conditions
              </label>
              <input
                type="text"
                value={formData.tideConditions}
                onChange={(e) => setFormData({ ...formData, tideConditions: e.target.value })}
                className="input-elegant w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-xs lg:text-sm"
                placeholder="e.g., Mid tide"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                className="input-elegant w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-xs lg:text-sm"
                placeholder="-8.675539"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                className="input-elegant w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-xs lg:text-sm"
                placeholder="116.767209"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-elegant w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg h-20 lg:h-24 resize-none text-xs lg:text-sm"
                placeholder="Describe the surf spot..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Forecast URL
              </label>
              <input
                type="url"
                value={formData.forecastUrl}
                onChange={(e) => setFormData({ ...formData, forecastUrl: e.target.value })}
                className="input-elegant w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-xs lg:text-sm"
                placeholder="https://www.surf-forecast.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="input-elegant w-full px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-xs lg:text-sm"
                placeholder="https://images.pexels.com/..."
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 lg:px-6 py-2 lg:py-3 text-gray-400 hover:text-white transition-colors text-xs lg:text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn-elegant px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium flex items-center justify-center space-x-2 text-xs lg:text-sm"
            >
              <Save className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>{loading ? 'Saving...' : 'Save Spot'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Spots List */}
      <div className="card-elegant overflow-hidden">
        <div className="p-3 lg:p-6 border-b border-dark-400">
          <h2 className="text-base lg:text-xl font-bold text-white">Surf Spots ({spots.length})</h2>
        </div>
        
        <div className="divide-y divide-dark-400">
          {spots.map((spot) => (
            <div key={spot.id} className="p-3 lg:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 lg:gap-4 hover:bg-dark-300 transition-colors">
              <div className="flex items-start lg:items-center space-x-4 flex-1 min-w-0">
                <div className="p-2 bg-neon-blue rounded-lg">
                  <Waves className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-sm lg:text-base truncate">{spot.name}</h3>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4 text-xs lg:text-sm text-gray-400">
                    <span className="truncate">{spot.waveType}</span>
                    <span className="hidden lg:inline">•</span>
                    <span className="truncate">{spot.skillLevel}</span>
                    <span className="hidden lg:inline">•</span>
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
                  className="p-2 text-gray-400 hover:text-neon-blue transition-colors"
                >
                  <Edit className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
                <button
                  onClick={() => handleDelete(spot)}
                  disabled={loading}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
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
    </div>
  );
}