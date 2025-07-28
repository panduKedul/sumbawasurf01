import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink, Navigation, Maximize2 } from 'lucide-react';
import { SurfSpot } from '../types';

interface MapProps {
  spots: SurfSpot[];
  onSelectSpot: (spot: SurfSpot) => void;
  selectedSpot: SurfSpot | null;
}

export default function Map({ spots, onSelectSpot, selectedSpot }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        // Dynamic import Leaflet
        const L = await import('leaflet');
        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Clear existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Create map
        const map = L.map(mapRef.current!, {
          center: [-8.8, 116.7],
          zoom: 10,
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: false,
        });

        mapInstanceRef.current = map;

        // Add multiple tile layer options for better reliability
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        });

        // Fallback tile layers
        const fallbackLayers = [
          L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
          }),
          L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors, © CartoDB',
            maxZoom: 18,
          })
        ];

        // Try to add primary tile layer
        tileLayer.on('tileerror', () => {
          console.log('Primary tile layer failed, trying fallback...');
          tileLayer.remove();
          fallbackLayers[0].addTo(map);
        });

        tileLayer.addTo(map);

        // Custom marker creation
        const createCustomMarker = (spot: SurfSpot, isSelected: boolean = false) => {
          const markerColor = isSelected ? '#FF6B6B' : '#00F6FF';
          const markerSize = isSelected ? 35 : 30;
          
          const customIcon = L.divIcon({
            html: `
              <div style="
                position: relative;
                width: ${markerSize}px;
                height: ${markerSize}px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
                <div style="
                  background: ${markerColor};
                  width: ${markerSize - 6}px;
                  height: ${markerSize - 6}px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                  transition: all 0.3s ease;
                ">
                  <div style="
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                  "></div>
                </div>
                ${isSelected ? `
                  <div style="
                    position: absolute;
                    top: -5px;
                    left: -5px;
                    width: ${markerSize + 10}px;
                    height: ${markerSize + 10}px;
                    border: 2px solid ${markerColor};
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                  "></div>
                ` : ''}
              </div>
            `,
            className: 'custom-surf-marker',
            iconSize: [markerSize, markerSize],
            iconAnchor: [markerSize / 2, markerSize / 2],
          });

          return customIcon;
        };

        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
          @keyframes pulse {
            0% { transform: scale(0.8); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.5; }
            100% { transform: scale(0.8); opacity: 1; }
          }
          
          .leaflet-popup-content-wrapper {
            background: #1a1a1a !important;
            color: white !important;
            border: 1px solid rgba(0, 246, 255, 0.3) !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
          }
          
          .leaflet-popup-content {
            margin: 12px !important;
            font-family: 'Titillium Web', sans-serif !important;
          }
          
          .leaflet-popup-tip {
            background: #1a1a1a !important;
            border: 1px solid rgba(0, 246, 255, 0.3) !important;
          }
          
          .leaflet-popup-close-button {
            color: #00F6FF !important;
            font-size: 18px !important;
            font-weight: bold !important;
          }
          
          .leaflet-popup-close-button:hover {
            color: white !important;
          }
        `;
        document.head.appendChild(style);

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add markers for each spot
        spots.forEach((spot) => {
          const isSelected = selectedSpot?.id === spot.id;
          const marker = L.marker([spot.coordinates[0], spot.coordinates[1]], {
            icon: createCustomMarker(spot, isSelected)
          });

          marker.addTo(map);
          markersRef.current.push(marker);

          // Create popup content
          const popupContent = `
            <div style="min-width: 280px; max-width: 320px;">
              <div style="
                background: linear-gradient(135deg, #00F6FF 0%, #007FFF 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 8px;
                line-height: 1.2;
              ">${spot.name}</div>
              
              <p style="
                color: #cccccc;
                margin: 0 0 12px 0;
                line-height: 1.4;
                font-size: 14px;
              ">${spot.description.substring(0, 120)}${spot.description.length > 120 ? '...' : ''}</p>
              
              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                <span style="
                  background: rgba(0, 246, 255, 0.2);
                  color: #00F6FF;
                  font-size: 11px;
                  padding: 4px 8px;
                  border-radius: 12px;
                  border: 1px solid rgba(0, 246, 255, 0.3);
                ">${spot.skillLevel}</span>
                <span style="
                  background: rgba(34, 197, 94, 0.2);
                  color: #22c55e;
                  font-size: 11px;
                  padding: 4px 8px;
                  border-radius: 12px;
                  border: 1px solid rgba(34, 197, 94, 0.3);
                ">${spot.waveType}</span>
                <span style="
                  background: rgba(251, 191, 36, 0.2);
                  color: #fbbf24;
                  font-size: 11px;
                  padding: 4px 8px;
                  border-radius: 12px;
                  border: 1px solid rgba(251, 191, 36, 0.3);
                ">${spot.bestSeason}</span>
              </div>
              
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-top: 8px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
              ">
                <span style="color: #888; font-size: 11px;">
                  ${spot.coordinates[0].toFixed(4)}, ${spot.coordinates[1].toFixed(4)}
                </span>
                <a href="${spot.forecastUrl}" target="_blank" style="
                  color: #00F6FF;
                  text-decoration: none;
                  font-size: 12px;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  padding: 4px 8px;
                  border: 1px solid rgba(0, 246, 255, 0.3);
                  border-radius: 6px;
                  background: rgba(0, 246, 255, 0.1);
                  transition: all 0.2s ease;
                ">
                  Forecast →
                </a>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent, {
            closeButton: true,
            autoClose: false,
            className: 'custom-surf-popup',
            maxWidth: 350,
          });

          marker.on('click', () => {
            onSelectSpot(spot);
          });

          // Open popup for selected spot
          if (isSelected) {
            marker.openPopup();
          }
        });

        // Update markers function
        (map as any).updateMarkers = () => {
          markersRef.current.forEach((marker, index) => {
            const spot = spots[index];
            const isSelected = selectedSpot?.id === spot.id;
            marker.setIcon(createCustomMarker(spot, isSelected));
            
            if (isSelected) {
              marker.openPopup();
            }
          });
        };

        setMapLoaded(true);
        setMapError(false);

      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        setMapLoaded(false);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [spots, onSelectSpot]);

  // Update markers when selection changes
  useEffect(() => {
    if (mapInstanceRef.current && (mapInstanceRef.current as any).updateMarkers) {
      (mapInstanceRef.current as any).updateMarkers();
    }
  }, [selectedSpot]);

  // Fallback component when map fails
  const MapFallback = () => (
    <div className="w-full h-full bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl border border-dark-400 flex flex-col">
      <div className="p-4 md:p-6 text-center flex-1 flex flex-col justify-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">West Sumbawa Surf Spots</h3>
          <p className="text-gray-400 mb-6">Interactive map of {spots.length} surf locations</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {spots.slice(0, 9).map((spot) => (
            <button
              key={spot.id}
              onClick={() => onSelectSpot(spot)}
              className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 text-left ${
                selectedSpot?.id === spot.id
                  ? 'bg-gradient-to-br from-neon-blue/20 to-primary-600/20 border-neon-blue/50 shadow-lg shadow-neon-blue/25'
                  : 'bg-dark-400 border-dark-300 hover:border-neon-blue/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                <MapPin className={`w-5 h-5 mt-1 flex-shrink-0 ${
                  selectedSpot?.id === spot.id ? 'text-neon-blue' : 'text-gray-400'
                }`} />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-white text-sm mb-1 truncate">{spot.name}</h4>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-2">{spot.description}</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs px-2 py-1 bg-neon-blue/20 text-neon-blue rounded border border-neon-blue/30">
                      {spot.skillLevel}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        {spots.length > 9 && (
          <p className="text-sm text-gray-500 mt-4">
            And {spots.length - 9} more spots available...
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className={`w-full h-full rounded-xl border border-dark-400 overflow-hidden ${
          mapError || !mapLoaded ? 'hidden' : 'block'
        }`}
        style={{ minHeight: '400px', background: '#1a1a1a' }}
      />
      
      {/* Fallback when map fails or is loading */}
      {(mapError || !mapLoaded) && <MapFallback />}
      
      {/* Map Controls Overlay */}
      {mapLoaded && !mapError && (
        <>
          <div className="absolute top-4 left-4 bg-dark-200/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-dark-400">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-neon-blue" />
              <span className="text-sm font-medium text-white">West Sumbawa</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {spots.length} surf spots
            </p>
          </div>

          {/* Selected Spot Info */}
          {selectedSpot && (
            <div className="absolute bottom-4 left-4 right-4 bg-dark-200/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-dark-400">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-white mb-1 truncate">{selectedSpot.name}</h3>
                  <p className="text-sm text-gray-300 mb-2 line-clamp-2">{selectedSpot.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block bg-neon-blue/20 text-neon-blue text-xs px-2 py-1 rounded border border-neon-blue/30">
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
                    className="flex items-center space-x-1 text-neon-blue hover:text-neon-blue/80 text-sm transition-colors ml-4 flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
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