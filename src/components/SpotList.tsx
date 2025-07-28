import React from 'react';
import { Waves, Star } from 'lucide-react';
import { SurfSpot } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface SpotListProps {
  spots: SurfSpot[];
  onSelectSpot: (spot: SurfSpot) => void;
  selectedSpot: SurfSpot | null;
}

export default function SpotList({ spots, onSelectSpot, selectedSpot }: SpotListProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div className={`h-full flex flex-col ${themeClasses.cardBg}`}>
      {/* Header */}
      <div className={`p-6 border-b ${themeClasses.border}`}>
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-2 ${themeClasses.button} rounded-lg shadow-lg`}>
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${themeClasses.text}`}>Surf Spots</h2>
            <p className={`text-sm ${themeClasses.textSecondary}`}>{spots.length} spots available</p>
          </div>
        </div>
      </div>

      {/* Spots List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 spots-list-container">
        {spots.map((spot) => (
          <div
            key={spot.id}
            onClick={() => onSelectSpot(spot)}
            className={`group cursor-pointer ${themeClasses.cardBg} border ${themeClasses.border} rounded-lg p-4 transition-all duration-300 hover:scale-[1.02] shadow-md ${
              selectedSpot?.id === spot.id
                ? `ring-2 ring-blue-500 shadow-lg`
                : `${themeClasses.buttonHover}`
            }`}
          >
            {/* Spot Name Only */}
            <div className="flex items-center justify-between">
              <h3 className={`font-bold ${themeClasses.text} text-base leading-tight group-hover:${themeClasses.accent} transition-colors duration-300`}>
                {spot.name}
              </h3>
              {selectedSpot?.id === spot.id && (
                <div className={`flex items-center space-x-1 ${themeClasses.accent}`}>
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>

            {/* Selected Indicator */}
            {selectedSpot?.id === spot.id && (
              <div className={`mt-3 pt-3 border-t ${themeClasses.border}`}>
                <div className={`flex items-center space-x-2 ${themeClasses.accent} bg-blue-50 px-3 py-2 rounded-lg border border-blue-200`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Currently Selected</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={`p-4 border-t ${themeClasses.border}`}>
        <div className="text-center">
          <p className={`text-sm ${themeClasses.textSecondary}`}>
            Click any spot to view details
          </p>
        </div>
      </div>
    </div>
  );
}