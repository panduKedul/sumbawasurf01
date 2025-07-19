import React from 'react';
import { MapPin, Waves, Trophy, Calendar, Clock, ExternalLink, Star } from 'lucide-react';
import { SurfSpot } from '../types';

interface SpotDetailsProps {
  spot: SurfSpot;
}

export default function SpotDetails({ spot }: SpotDetailsProps) {
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
    </div>
  );
}