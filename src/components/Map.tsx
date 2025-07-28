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
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const L = await import('leaflet');
        
        // Clear existing map
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }
        
        // Create map
        const map = L.map(mapRef.current!, {
          center: [-8.8, 116.7], // West Sumbawa coordinates
          zoom: 11,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        mapInstanceRef.current = map;

        // Add tile layer with better styling
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        // Custom marker icon
        const customIcon = L.divIcon({
          html: `<div style="
            background: linear-gradient(135deg, #00F6FF 0%, #007FFF 100%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>`,
          className: 'custom-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        // Add markers for each spot
        spots.forEach((spot) => {
          const marker = L.marker([spot.coordinates[0], spot.coordinates[1]], {
            icon: customIcon
          })
            .addTo(map)
            .bindPopup(`
              <div style="
                padding: 12px;
                background: #1a1a1a;
                color: white;
                border-radius: 8px;
                min-width: 200px;
                font-family: 'Titillium Web', sans-serif;
              ">
                <h3 style="
                  font-weight: bold;
                  font-size: 16px;
                  margin: 0 0 8px 0;
                  color: #00F6FF;
                ">${spot.name}</h3>
                <p style="
                  font-size: 14px;
                  color: #cccccc;
                  margin: 0 0 12px 0;
                  line-height: 1.4;
                ">${spot.description}</p>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <span style="
                    background: rgba(0, 246, 255, 0.2);
                    color: #00F6FF;
                    font-size: 12px;
                    padding: 4px 8px;
                    border-radius: 12px;
                    border: 1px solid rgba(0, 246, 255, 0.3);
                  ">${spot.skillLevel}</span>
                  <span style="
                    background: rgba(34, 197, 94, 0.2);
                    color: #22c55e;
                    font-size: 12px;
                    padding: 4px 8px;
                    border-radius: 12px;
                    border: 1px solid rgba(34, 197, 94, 0.3);
                  ">${spot.waveType}</span>
                </div>
              </div>
            `, {
              closeButton: true,
              autoClose: false,
              className: 'custom-popup'
            })
            .on('click', () => {
              onSelectSpot(spot);
            });

          // Highlight selected spot
          if (selectedSpot && selectedSpot.id === spot.id) {
            marker.openPopup();
          }
        });

        // Add custom CSS for popup
        const style = document.createElement('style');
        style.textContent = `
          .custom-popup .leaflet-popup-content-wrapper {
            background: #1a1a1a !important;
            color: white !important;
            border: 1px solid rgba(0, 246, 255, 0.3) !important;
            border-radius: 8px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
          }
          .custom-popup .leaflet-popup-tip {
            background: #1a1a1a !important;
            border: 1px solid rgba(0, 246, 255, 0.3) !important;
          }
          .custom-popup .leaflet-popup-close-button {
            color: #00F6FF !important;
            font-size: 18px !important;
            font-weight: bold !important;
          }
          .custom-popup .leaflet-popup-close-button:hover {
            color: white !important;
          }
        `;
        document.head.appendChild(style);

      } catch (error) {
        console.error('Error initializing map:', error);
        // Fallback: show a simple message
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100%;
              background: #2d2d2d;
              color: white;
              text-align: center;
              padding: 20px;
              border-radius: 12px;
            ">
              <div>
                <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                <h3 style="margin: 0 0 8px 0; color: #00F6FF;">West Sumbawa Surf Spots</h3>
                <p style="margin: 0; color: #cccccc;">Interactive map loading...</p>
              </div>
            </div>
          `;
        }
      }
    };

    initMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [spots, selectedSpot, onSelectSpot]);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full overflow-hidden rounded-xl"
        style={{ minHeight: '400px', background: '#2d2d2d' }}
      />
      
      {/* Map Overlay Info */}
      <div className="absolute top-4 left-4 bg-dark-200/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-dark-400">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-neon-blue" />
          <span className="text-sm font-medium text-white">West Sumbawa Surf Spots</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Click markers to view spot details
        </p>
      </div>

      {/* Selected Spot Info */}
      {selectedSpot && (
        <div className="absolute bottom-4 left-4 right-4 bg-dark-200/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-dark-400">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-white">{selectedSpot.name}</h3>
              <p className="text-sm text-gray-300 mt-1">{selectedSpot.description}</p>
              <div className="flex items-center space-x-2 mt-2">
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
                className="flex items-center space-x-1 text-neon-blue hover:text-neon-blue/80 text-sm transition-colors"
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