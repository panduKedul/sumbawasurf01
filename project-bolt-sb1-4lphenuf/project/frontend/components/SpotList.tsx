import React from 'react';
import { MapPin, Waves, ExternalLink, Star } from 'lucide-react';
import { SurfSpot } from '../types';

interface SpotListProps {
  spots: SurfSpot[];
  onSelectSpot: (spot: SurfSpot) => void;
  selectedSpot: SurfSpot | null;
}

export default function SpotList({ spots, onSelectSpot, selectedSpot }: SpotListProps) {
  return (
    <div className="h-full flex flex-col bg-dark-200">
      {/* Header */}
      <div className="p-6 border-b border-dark-400">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 bg-neon-blue rounded-lg shadow-lg">
            <Waves className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Surf Spots</h2>
            <p className="text-sm text-gray-400">{spots.length} spots available</p>
          </div>
        </div>
      </div>

      {/* Spots List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 spots-list-container">
        {spots.map((spot) => (
          <div
            key={spot.id}
            onClick={() => onSelectSpot(spot)}
            className={`group cursor-pointer card-elegant p-4 transition-all duration-300 hover:scale-[1.02] ${
              selectedSpot?.id === spot.id
                ? 'ring-2 ring-neon-blue shadow-lg shadow-neon-blue/25'
                : ''
            }`}
          >
            {/* Spot Name Only */}
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base leading-tight group-hover:text-neon-blue transition-colors duration-300">
                {spot.name}
              </h3>
              {selectedSpot?.id === spot.id && (
                <div className="flex items-center space-x-1 text-neon-blue">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              )}
            </div>

            {/* Selected Indicator */}
            {selectedSpot?.id === spot.id && (
              <div className="mt-3 pt-3 border-t border-dark-400">
                <div className="flex items-center space-x-2 text-neon-blue bg-neon-blue/10 px-3 py-2 rounded-lg border border-neon-blue/20">
                  <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Currently Selected</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-dark-400">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Click any spot to view details
          </p>
        </div>
      </div>
    </div>
  );
}