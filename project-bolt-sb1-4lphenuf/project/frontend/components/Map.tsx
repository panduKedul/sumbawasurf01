import React, { useEffect, useRef } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { SurfSpot } from '../types';

interface MapProps {
  spots: SurfSpot[];
  onSelectSpot: (spot: SurfSpot) => void;
  selectedSpot: SurfSpot | null;
}

export default function Map({ spots, onSelectSpot, selectedSpot }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map with Leaflet
    const initMap = async () => {
      // Dynamic import to avoid SSR issues
      const L = await import('leaflet');
      
      // Clear existing map
      mapRef.current!.innerHTML = '';
      
      // Create map
      const map = L.map(mapRef.current!, {
        center: [-8.8, 116.7], // West Sumbawa coordinates
        zoom: 11,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add markers for each spot
      spots.forEach((spot) => {
        const marker = L.marker([spot.latitude, spot.longitude])
          .addTo(map)
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold text-lg">${spot.name}</h3>
              <p class="text-sm text-gray-600">${spot.description}</p>
              <div class="mt-2">
                <span class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  ${spot.skill_level}
                </span>
              </div>
            </div>
          `)
          .on('click', () => {
            onSelectSpot(spot);
          });

        // Highlight selected spot
        if (selectedSpot && selectedSpot.id === spot.id) {
          marker.openPopup();
        }
      });
    };

    initMap();
  }, [spots, selectedSpot, onSelectSpot]);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map Overlay Info */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">West Sumbawa Surf Spots</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Click markers to view spot details
        </p>
      </div>

      {/* Selected Spot Info */}
      {selectedSpot && (
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{selectedSpot.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedSpot.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {selectedSpot.skill_level}
                </span>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {selectedSpot.wave_type}
                </span>
              </div>
            </div>
            {selectedSpot.forecast_url && (
              <a
                href={selectedSpot.forecast_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Forecast</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}