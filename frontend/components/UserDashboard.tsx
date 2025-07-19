import React, { useState, useEffect } from 'react';
import { User, Heart, Bell, MapPin, Calendar, Trophy, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { SurfSpot } from '../types';
import { SURF_SPOTS } from '../utils/spots';
import toast from 'react-hot-toast';

interface UserDashboardProps {
  onClose: () => void;
  onShowProfile: () => void;
}

interface Favorite {
  id: string;
  spot_id: string;
  created_at: string;
}

interface Alert {
  id: string;
  spot_id: string;
  wave_height_min: number | null;
  wave_height_max: number | null;
}

export default function UserDashboard() {
  const { user, signOut } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (favoritesError) throw favoritesError;

      // Fetch alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (alertsError) throw alertsError;

      setFavorites(favoritesData || []);
      setAlerts(alertsData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    }
  };

  const removeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(alerts.filter(alert => alert.id !== alertId));
      toast.success('Alert removed');
    } catch (error) {
      console.error('Error removing alert:', error);
      toast.error('Failed to remove alert');
    }
  };

  const getSpotById = (spotId: string): SurfSpot | undefined => {
    return SURF_SPOTS.find(spot => spot.id === spotId);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Manage your surf spots and preferences</p>
      </div>

      <div className="space-y-6">
          {/* User Info */}
          <div className="card-elegant bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/30 p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-neon-blue" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{user?.email}</h3>
                <p className="text-gray-300">Welcome back to Sumbawa Surf Guide!</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-neon-blue/20 hover:bg-neon-blue/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-white border border-neon-blue/30"
              >
                <Settings className="w-4 h-4" />
                Profile Settings
              </button>
              <button
                onClick={handleSignOut}
                className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-white border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Favorites Section */}
            <div className="card-elegant p-6">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-white">Favorite Spots</h3>
                <span className="bg-dark-400 text-gray-300 px-2 py-1 rounded-full text-sm">
                  {favorites.length}
                </span>
              </div>

              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((favorite) => {
                    const spot = getSpotById(favorite.spot_id);
                    return (
                      <div key={favorite.id} className="flex items-center justify-between p-3 bg-dark-400 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-white">{spot?.name || 'Unknown Spot'}</p>
                            <p className="text-sm text-gray-400">{spot?.waveType}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFavorite(favorite.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          title="Remove from favorites"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No favorite spots yet</p>
                  <p className="text-sm">Start exploring and add your favorites!</p>
                </div>
              )}
            </div>

            {/* Alerts Section */}
            <div className="card-elegant p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-white">Wave Alerts</h3>
                <span className="bg-dark-400 text-gray-300 px-2 py-1 rounded-full text-sm">
                  {alerts.length}
                </span>
              </div>

              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((alert) => {
                    const spot = getSpotById(alert.spot_id);
                    return (
                      <div key={alert.id} className="p-3 bg-dark-400 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <p className="font-medium text-white">{spot?.name || 'Unknown Spot'}</p>
                          </div>
                          <button
                            onClick={() => removeAlert(alert.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remove alert"
                          >
                            ×
                          </button>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          {alert.wave_height_min && alert.wave_height_max && (
                            <p>Wave Height: {alert.wave_height_min}ft - {alert.wave_height_max}ft</p>
                          )}
                          {alert.wind_speed_max && (
                            <p>Max Wind: {alert.wind_speed_max} mph</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No wave alerts set</p>
                  <p className="text-sm">Set up alerts to get notified of perfect conditions!</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="card-elegant p-4 text-center">
             <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
             <p className="text-2xl font-bold text-white">{favorites.length}</p>
             <p className="text-sm text-gray-400">Favorites</p>
            </div>
           <div className="card-elegant p-4 text-center">
              <Bell className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
             <p className="text-2xl font-bold text-white">{alerts.length}</p>
             <p className="text-sm text-gray-400">Alerts</p>
            </div>
           <div className="card-elegant p-4 text-center">
              <MapPin className="w-6 h-6 text-green-600 mx-auto mb-2" />
             <p className="text-2xl font-bold text-white">{SURF_SPOTS.length}</p>
             <p className="text-sm text-gray-400">Total Spots</p>
            </div>
           <div className="card-elegant p-4 text-center">
              <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-2" />
             <p className="text-2xl font-bold text-white">
                {new Date().toLocaleDateString('en-US', { month: 'short' })}
              </p>
             <p className="text-sm text-gray-400">This Month</p>
            </div>
          </div>
      </div>
    </div>
  );
}