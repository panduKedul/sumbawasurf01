import React, { useState } from 'react';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';
import { SurfSpot } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface MapProps {
  spots: SurfSpot[];
  onSelectSpot: (spot: SurfSpot) => void;
  selectedSpot: SurfSpot | null;
}

export default function Map({ spots, onSelectSpot, selectedSpot }: MapProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [mapError, setMapError] = useState(false);

  // Center coordinates for West Sumbawa
  const centerLat = -8.8;
  const centerLng = 116.7;
  const zoom = 10;

  // Create Google Maps embed URL
  const googleMapsUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.63!2d${centerLng}!3d${centerLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcdb0a1a1a1a1a1%3A0x1a1a1a1a1a1a1a1a!2sWest%20Sumbawa%2C%20Indonesia!5e0!3m2!1sen!2sid!4v1640995200000!5m2!1sen!2sid`;

  // Fallback component when map fails
  const MapFallback = () => (
    <div className={`w-full h-full ${themeClasses.cardBg} rounded-xl border ${themeClasses.border} flex flex-col overflow-hidden`}>
      <div className="p-3 sm:p-4 md:p-6 text-center flex-1 flex flex-col justify-center">
        <div className="mb-4 md:mb-6">
          <div className={`w-12 h-12 md:w-16 md:h-16 ${themeClasses.headerBg} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4`}>
            <Navigation className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className={`text-lg md:text-2xl font-bold ${themeClasses.text} mb-2`}>West Sumbawa Surf Spots</h3>
          <p className={`text-sm md:text-base ${themeClasses.textSecondary} mb-4 md:mb-6`}>Interactive map of {spots.length} surf locations</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 max-w-4xl mx-auto overflow-y-auto max-h-64 md:max-h-80">
          {spots.map((spot) => (
            <button
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              className={`p-3 md:p-4 rounded-lg border transition-all duration-300 hover:scale-105 text-left shadow-sm ${
                selectedSpot?.id === spot.id
                  ? `${themeClasses.cardBg} ${themeClasses.border} ring-2 ring-blue-500`
                  : `${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.buttonHover}`
              }`}
            >
              <div className="flex items-start space-x-2 md:space-x-3">
                <MapPin className={`w-4 h-4 md:w-5 md:h-5 mt-1 flex-shrink-0 ${
                  selectedSpot?.id === spot.id ? themeClasses.accent : themeClasses.textSecondary
                }`} />
                <div className="min-w-0 flex-1">
                  <h4 className={`font-semibold ${themeClasses.text} text-xs md:text-sm mb-1 truncate`}>{spot.name}</h4>
                  <p className={`text-xs ${themeClasses.textSecondary} mb-2 line-clamp-2`}>{spot.description}</p>
                  <div className="flex flex-wrap gap-1">
                    <span className={`text-xs px-2 py-1 ${themeClasses.accent} bg-blue-100 rounded border border-blue-200`}>
                      {spot.skillLevel}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full">
      {/* Google Maps Embed */}
      {!mapError ? (
        <div className={`w-full h-full rounded-xl overflow-hidden border ${themeClasses.border}`}>
          <iframe
            src={googleMapsUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '300px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="West Sumbawa Surf Spots Map"
            onError={() => setMapError(true)}
            className="w-full h-full"
          />
        </div>
      ) : (
        <MapFallback />
      )}
      
      {/* Map Controls Overlay */}
      {!mapError && (
        <>
          <div className={`absolute top-2 md:top-4 left-2 md:left-4 ${themeClasses.cardBg} backdrop-blur-sm rounded-lg p-2 md:p-3 shadow-sm border ${themeClasses.border}`}>
            <div className="flex items-center space-x-2">
              <MapPin className={`w-3 h-3 md:w-4 md:h-4 ${themeClasses.accent}`} />
              <span className={`text-xs md:text-sm font-medium ${themeClasses.text}`}>West Sumbawa</span>
            </div>
            <p className={`text-xs ${themeClasses.textSecondary} mt-1`}>
              {spots.length} surf spots
            </p>
          </div>

          {/* Selected Spot Info */}
          {selectedSpot && (
            <div className={`absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 ${themeClasses.cardBg} backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-sm border ${themeClasses.border}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-sm md:text-lg ${themeClasses.text} mb-1 truncate`}>{selectedSpot.name}</h3>
                  <p className={`text-xs md:text-sm ${themeClasses.textSecondary} mb-2 line-clamp-2`}>{selectedSpot.description}</p>
                  <div className="flex flex-wrap items-center gap-1 md:gap-2">
                    <span className={`inline-block ${themeClasses.accent} bg-blue-100 text-xs px-2 py-1 rounded border border-blue-200`}>
                      {selectedSpot.skillLevel}
                    </span>
                    <span className="inline-block bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded border border-green-500/30">
                      {selectedSpot.waveType}
                    </span>
                  </div>
                </div>
                {selectedSpot.forecastUrl && (
                  <a
                    href={selectedSpot.forecastUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-1 ${themeClasses.accent} hover:opacity-80 text-xs md:text-sm transition-colors ml-2 md:ml-4 flex-shrink-0`}
                  >
                    <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Forecast</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}