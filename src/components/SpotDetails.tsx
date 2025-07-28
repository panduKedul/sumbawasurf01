import React from 'react';
import { MapPin, Waves, Trophy, Calendar, Clock, ExternalLink, Star } from 'lucide-react';
import { SurfSpot } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface SpotDetailsProps {
  spot: SurfSpot;
}

export default function SpotDetails({ spot }: SpotDetailsProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

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
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 animate-fadeIn">
      {/* Hero Image */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={spot.imageUrl}
          alt={spot.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-xl lg:text-3xl font-bold text-white mb-2">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className={`${themeClasses.cardBg} p-3 lg:p-4 text-center rounded-lg shadow-sm`}>
          <Waves className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className={`text-xs ${themeClasses.textSecondary} mb-1`}>Wave Type</p>
          <p className={`text-xs lg:text-sm font-medium ${themeClasses.text}`}>{spot.waveType}</p>
        </div>
        
        <div className={`${themeClasses.cardBg} p-3 lg:p-4 text-center rounded-lg shadow-sm`}>
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className={`text-xs ${themeClasses.textSecondary} mb-1`}>Skill Level</p>
          <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getSkillLevelColor(spot.skillLevel)}`}>
            {spot.skillLevel}
          </span>
        </div>
        
        <div className={`${themeClasses.cardBg} p-3 lg:p-4 text-center rounded-lg shadow-sm`}>
          <Calendar className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className={`text-xs ${themeClasses.textSecondary} mb-1`}>Best Season</p>
          <p className={`text-xs lg:text-sm font-medium ${themeClasses.text}`}>{spot.bestSeason}</p>
        </div>
        
        <div className={`${themeClasses.cardBg} p-3 lg:p-4 text-center rounded-lg shadow-sm`}>
          <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className={`text-xs ${themeClasses.textSecondary} mb-1`}>Tide</p>
          <p className={`text-xs lg:text-sm font-medium ${themeClasses.text}`}>{spot.tideConditions}</p>
        </div>
      </div>

      {/* Description */}
      <div className={`${themeClasses.cardBg} p-4 lg:p-6 rounded-lg shadow-sm`}>
        <h2 className={`text-lg lg:text-xl font-semibold ${themeClasses.text} mb-4 flex items-center`}>
          <Star className={`w-5 h-5 ${themeClasses.accent} mr-2`} />
          About This Spot
        </h2>
        <p className={`${themeClasses.textSecondary} text-sm lg:text-base leading-relaxed`}>
          {spot.description}
        </p>
      </div>

      {/* Forecast Link */}
      <div className={`${themeClasses.cardBg} p-4 lg:p-6 rounded-lg shadow-sm`}>
        <h2 className={`text-lg lg:text-xl font-semibold ${themeClasses.text} mb-4`}>
          Current Forecast
        </h2>
        <a
          href={spot.forecastUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center space-x-2 ${themeClasses.button} px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base`}
        >
          <ExternalLink className="w-5 h-5" />
          <span>View Live Forecast</span>
        </a>
      </div>
    </div>
  );
}