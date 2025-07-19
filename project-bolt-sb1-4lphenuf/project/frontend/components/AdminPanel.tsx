import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, MapPin, Waves, Calendar, Clock, Trophy, ExternalLink } from 'lucide-react';
import { DatabaseSurfSpot } from '../types';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

interface AdminPanelProps {
  onSpotsUpdate: () => void;
}

export default function AdminPanel({ onSpotsUpdate }: AdminPanelProps) {
  const [spots, setSpots] = useState<DatabaseSurfSpot[]>([]);
  const [editingSpot, setEditingSpot] = useState<DatabaseSurfSpot | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    wave_type: '',
    skill_level: '',
    best_season: '',
    tide_conditions: '',
    latitude: 0,
    longitude: 0,
    forecast_url: '',
    image_url: '',
    is_active: true
  });

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const { data, error } = await supabase
        .from('surf_spots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSpots(data || []);
    } catch (error) {
      console.error('Error fetching spots:', error);
      toast.error('Failed to load surf spots');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        const { error } = await supabase
          .from('surf_spots')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('Surf spot created successfully');
      } else if (editingSpot) {
        const { error } = await supabase
          .from('surf_spots')
          .update(formData)
          .eq('id', editingSpot.id);
        
        if (error) throw error;
        toast.success('Surf spot updated successfully');
      }

      setEditingSpot(null);
      setIsCreating(false);
      resetForm();
      fetchSpots();
      onSpotsUpdate();
    } catch (error) {
      console.error('Error saving spot:', error);
      toast.error('Failed to save surf spot');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this surf spot?')) return;

    try {
      const { error } = await supabase
        .from('surf_spots')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Surf spot deleted successfully');
      fetchSpots();
    } catch (error) {
      console.error('Error deleting spot:', error);
      toast.error('Failed to delete surf spot');
    }
  };

  const startEdit = (spot: DatabaseSurfSpot) => {
    setEditingSpot(spot);
    setFormData(spot);
    setIsCreating(false);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingSpot(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      wave_type: '',
      skill_level: '',
      best_season: '',
      tide_conditions: '',
      latitude: 0,
      longitude: 0,
      forecast_url: '',
      image_url: '',
      is_active: true
    });
  };

  const cancelEdit = () => {
    setEditingSpot(null);
    setIsCreating(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading surf spots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-gray-400">Manage surf spots and website content</p>
      </div>

      <div className="space-y-6">
          <div className="mb-6">
            <button
              onClick={startCreate}
              className="bg-neon-blue text-dark-100 px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add New Surf Spot
            </button>
          </div>

          {(isCreating || editingSpot) && (
            <div className="card-elegant p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                {isCreating ? 'Create New Surf Spot' : 'Edit Surf Spot'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">ID</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="input-elegant w-full p-3 rounded-lg"
                    placeholder="e.g., pipeline-hawaii"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-elegant w-full p-3 rounded-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-elegant w-full p-3 rounded-lg"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Wave Type</label>
                  <select
                    value={formData.wave_type}
                    onChange={(e) => setFormData({ ...formData, wave_type: e.target.value })}
                    className="input-elegant w-full p-3 rounded-lg"
                  >
                    <option value="">Select wave type</option>
                    <option value="Beach Break">Beach Break</option>
                    <option value="Point Break">Point Break</option>
                    <option value="Reef Break">Reef Break</option>
                    <option value="River Mouth">River Mouth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Skill Level</label>
                  <select
                    value={formData.skill_level}
                    onChange={(e) => setFormData({ ...formData, skill_level: e.target.value })}
                    className="input-elegant w-full p-3 rounded-lg"
                  >
                    <option value="">Select skill level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Pro">Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Best Season</label>
                  <input
                    type="text"
                    value={formData.best_season}
                    onChange={(e) => setFormData({ ...formData, best_season: e.target.value })}
                    className="input-elegant w-full p-3 rounded-lg"
                    placeholder="e.g., Winter, Summer, Year-round"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tide Conditions</label>
                  <input
                    type="text"
                    value={formData.tide_conditions}
                    onChange={(e) => setFormData({ ...formData, tide_conditions: e.target.value })}
                    className="input-elegant w-full p-3 rounded-lg"
                    placeholder="e.g., Low to mid tide"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                    className="input-elegant w-full p-3 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                    className="input-elegant w-full p-3 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Forecast URL</label>
                  <input
                    type="url"
                    value={formData.forecast_url}
                    onChange={(e) => setFormData({ ...formData, forecast_url: e.target.value })}
                    className="input-elegant w-full p-3 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="input-elegant w-full p-3 rounded-lg"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2 w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-300">
                    Active
                  </label>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-medium"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {spots.map((spot) => (
              <div key={spot.id} className="card-elegant p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{spot.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        spot.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {spot.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-2">{spot.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Waves className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-300">{spot.wave_type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-300">{spot.skill_level}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span className="text-gray-300">{spot.best_season}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-300">{spot.tide_conditions}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{spot.latitude}, {spot.longitude}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => window.open(spot.forecast_url, '_blank')}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="View Forecast"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => startEdit(spot)}
                      className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(spot.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {spots.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Waves className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No surf spots found. Create your first one!</p>
            </div>
          )}
      </div>
    </div>
  );
}