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
        
        // Create map with better initial view
        const map = L.map(mapRef.current!, {
          center: [-8.8, 116.7], // West Sumbawa coordinates
          zoom: 10,
          zoomControl: true,
          scrollWheelZoom: true,
          attributionControl: false,
        });

        mapInstanceRef.current = map;

        // Add OpenStreetMap tile layer with better styling
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        // Custom marker icon with better styling
        const createCustomIcon = (isSelected: boolean = false) => {
          return L.divIcon({
            html: `
              <div style="
                position: relative;
                width: 32px;
                height: 32px;
              ">
                <div style="
                  background: ${isSelected ? 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)' : 'linear-gradient(135deg, #00F6FF 0%, #007FFF 100%)'};
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  position: absolute;
                  top: 4px;
                  left: 4px;
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
                    top: -8px;
                    left: -8px;
                    width: 48px;
                    height: 48px;
                    border: 2px solid #FF6B6B;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                  "></div>
                ` : ''}
              </div>
            `,
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });
        };

        // Add CSS for pulse animation
        const style = document.createElement('style');
        style.textContent = `
          @keyframes pulse {
            0% {
              transform: scale(0.8);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.5;
            }
            100% {
              transform: scale(0.8);
              opacity: 1;
            }
          }
          .custom-popup .leaflet-popup-content-wrapper {
            background: #1a1a1a !important;
            color: white !important;
            border: 1px solid rgba(0, 246, 255, 0.3) !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
            padding: 0 !important;
          }
          .custom-popup .leaflet-popup-content {
            margin: 0 !important;
            padding: 16px !important;
            font-family: 'Titillium Web', sans-serif !important;
          }
          .custom-popup .leaflet-popup-tip {
            background: #1a1a1a !important;
            border: 1px solid rgba(0, 246, 255, 0.3) !important;
          }
          .custom-popup .leaflet-popup-close-button {
            color: #00F6FF !important;
            font-size: 18px !important;
            font-weight: bold !important;
            right: 8px !important;
            top: 8px !important;
          }
          .custom-popup .leaflet-popup-close-button:hover {
            color: white !important;
          }
        `;
        document.head.appendChild(style);

        // Store markers for updates
        const markers: any[] = [];

        // Add markers for each spot
        spots.forEach((spot) => {
          const isSelected = selectedSpot?.id === spot.id;
          const marker = L.marker([spot.coordinates[0], spot.coordinates[1]], {
            icon: createCustomIcon(isSelected)
          })
            .addTo(map)
            .bindPopup(`
              <div style="min-width: 250px;">
                <div style="
                  background: linear-gradient(135deg, #00F6FF 0%, #007FFF 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  font-weight: bold;
                  font-size: 18px;
                  margin-bottom: 8px;
                ">${spot.name}</div>
                
                <p style="
                  color: #cccccc;
                  margin: 0 0 12px 0;
                  line-height: 1.5;
                  font-size: 14px;
                ">${spot.description}</p>
                
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
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
                
                <div style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding-top: 8px;
                  border-top: 1px solid rgba(255, 255, 255, 0.1);
                ">
                  <span style="color: #888; font-size: 12px;">
                    ${spot.coordinates[0].toFixed(4)}, ${spot.coordinates[1].toFixed(4)}
                  </span>
                  <a href="${spot.forecastUrl}" target="_blank" style="
                    color: #00F6FF;
                    text-decoration: none;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                  ">
                    Forecast →
                  </a>
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

          markers.push({ marker, spot });

          // Open popup for selected spot
          if (isSelected) {
            marker.openPopup();
          }
        });

        // Update markers when selection changes
        const updateMarkers = () => {
          markers.forEach(({ marker, spot }) => {
            const isSelected = selectedSpot?.id === spot.id;
            marker.setIcon(createCustomIcon(isSelected));
          });
        };

        // Store update function for external use
        (map as any).updateMarkers = updateMarkers;

      } catch (error) {
        console.error('Error initializing map:', error);
        // Enhanced fallback display
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100%;
              background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
              color: white;
              text-align: center;
              padding: 40px 20px;
              border-radius: 12px;
              border: 1px solid rgba(0, 246, 255, 0.3);
            ">
              <div style="
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, #00F6FF 0%, #007FFF 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 24px;
                box-shadow: 0 8px 32px rgba(0, 246, 255, 0.3);
              ">
                <div style="font-size: 32px;">🗺️</div>
              </div>
              <h3 style="
                margin: 0 0 12px 0; 
                color: #00F6FF;
                font-size: 24px;
                font-weight: bold;
              ">West Sumbawa Surf Spots</h3>
              <p style="
                margin: 0 0 24px 0; 
                color: #cccccc;
                font-size: 16px;
                line-height: 1.5;
              ">Interactive map is loading...</p>
              <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 12px;
                width: 100%;
                max-width: 600px;
              ">
                ${spots.slice(0, 6).map(spot => `
                  <div style="
                    background: rgba(0, 246, 255, 0.1);
                    border: 1px solid rgba(0, 246, 255, 0.3);
                    border-radius: 8px;
                    padding: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                  " onclick="window.selectSpot('${spot.id}')">
                    <div style="font-weight: bold; margin-bottom: 4px;">${spot.name}</div>
                    <div style="font-size: 12px; color: #888;">${spot.skillLevel}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
          
          // Add click handlers for fallback spots
          (window as any).selectSpot = (spotId: string) => {
            const spot = spots.find(s => s.id === spotId);
            if (spot) onSelectSpot(spot);
          };
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
  }, [spots, onSelectSpot]);

  // Update markers when selectedSpot changes
  useEffect(() => {
    if (mapInstanceRef.current && (mapInstanceRef.current as any).updateMarkers) {
      (mapInstanceRef.current as any).updateMarkers();
    }
  }, [selectedSpot]);

  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-full overflow-hidden rounded-xl border border-dark-400"
        style={{ minHeight: '400px', background: '#1a1a1a' }}
      />
      
      {/* Map Overlay Info */}
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
            <div className="flex-1">
              <h3 className="font-bold text-lg text-white mb-1">{selectedSpot.name}</h3>
              <p className="text-sm text-gray-300 mb-2 line-clamp-2">{selectedSpot.description}</p>
              <div className="flex items-center space-x-2">
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
                <span>Forecast</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}