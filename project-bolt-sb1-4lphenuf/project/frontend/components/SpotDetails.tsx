import React, { useState } from 'react';
import { MapPin, Waves, Trophy, Calendar, Clock, ExternalLink, Heart, Bell, Star } from 'lucide-react';
import { SurfSpot } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';

interface SpotDetailsProps {
  spot: SurfSpot;
}

export default function SpotDetails({ spot }: SpotDetailsProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAlertForm, setShowAlertForm] = useState(false);

  const getSkillLevelColor = (skillLevel: string) => {
    switch (skillLevel.toLowerCase()) {
      case 'beginner':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'intermediate':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'advanced':
        return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'expert':
      case 'pro':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('spot_id', spot.id);
        
        if (error) throw error;
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            spot_id: spot.id
          });
        
        if (error) throw error;
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorite');
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Hero Image */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={spot.imageUrl}
          alt={spot.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {spot.name}
          </h1>
          <div className="flex items-center space-x-2 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {spot.coordinates[0].toFixed(4)}, {spot.coordinates[1].toFixed(4)}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleFavorite}
            className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-500/80 text-white' 
                : 'bg-black/50 text-white hover:bg-red-500/80'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setShowAlertForm(!showAlertForm)}
            className="p-3 rounded-full bg-black/50 text-white hover:bg-yellow-500/80 backdrop-blur-sm transition-all duration-300"
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-elegant p-4 text-center">
          <Waves className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400 mb-1">Wave Type</p>
          <p className="text-sm font-medium text-white">{spot.waveType}</p>
        </div>
        
        <div className="card-elegant p-4 text-center">
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400 mb-1">Skill Level</p>
          <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getSkillLevelColor(spot.skillLevel)}`}>
            {spot.skillLevel}
          </span>
        </div>
        
        <div className="card-elegant p-4 text-center">
          <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400 mb-1">Best Season</p>
          <p className="text-sm font-medium text-white">{spot.bestSeason}</p>
        </div>
        
        <div className="card-elegant p-4 text-center">
          <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-xs text-gray-400 mb-1">Tide</p>
          <p className="text-sm font-medium text-white">{spot.tideConditions}</p>
        </div>
      </div>

      {/* Description */}
      <div className="card-elegant p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Star className="w-5 h-5 text-neon-blue mr-2" />
          About This Spot
        </h2>
        <p className="text-gray-300 leading-relaxed">
          {spot.description}
        </p>
      </div>

      {/* Forecast Link */}
      <div className="card-elegant p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Current Forecast
        </h2>
        <a
          href={spot.forecastUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 bg-neon-blue text-dark-100 px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          <span>View Live Forecast</span>
        </a>
      </div>

      {/* Alert Form */}
      {showAlertForm && user && (
        <div className="card-elegant p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Set Wave Alert
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Min Wave Height (ft)
              </label>
              <input
                type="number"
                className="input-elegant w-full px-3 py-2 rounded-lg"
                placeholder="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Wave Height (ft)
              </label>
              <input
                type="number"
                className="input-elegant w-full px-3 py-2 rounded-lg"
                placeholder="8"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Wind Speed (mph)
              </label>
              <input
                type="number"
                className="input-elegant w-full px-3 py-2 rounded-lg"
                placeholder="15"
              />
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button className="btn-elegant px-6 py-2 rounded-lg">
              Create Alert
            </button>
            <button 
              onClick={() => setShowAlertForm(false)}
              className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}