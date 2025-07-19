import React, { useState } from 'react';
import { Cloud, Wind, Waves, Thermometer, Eye, Droplets } from 'lucide-react';

export default function Maps() {
  const [activeMap, setActiveMap] = useState('wind');

  const mapTypes = [
    {
      id: 'wind',
      name: 'Wind',
      icon: Wind,
      description: 'Real-time wind patterns and forecasts',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'waves',
      name: 'Waves',
      icon: Waves,
      description: 'Wave height and swell direction',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      id: 'temperature',
      name: 'Temperature',
      icon: Thermometer,
      description: 'Air and water temperature',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'visibility',
      name: 'Visibility',
      icon: Eye,
      description: 'Weather visibility conditions',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'precipitation',
      name: 'Rain',
      icon: Droplets,
      description: 'Precipitation and rainfall',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'clouds',
      name: 'Clouds',
      icon: Cloud,
      description: 'Cloud coverage and patterns',
      color: 'from-gray-500 to-slate-500'
    }
  ];

  const getWindyUrl = (layer: string) => {
    const baseUrl = 'https://embed.windy.com/embed2.html';
    const params = new URLSearchParams({
      lat: '-8.8',
      lon: '116.7',
      detailLat: '-8.8',
      detailLon: '116.7',
      width: '100%',
      height: '100%',
      zoom: '9',
      level: 'surface',
      overlay: layer,
      product: 'ecmwf',
      menu: '',
      message: '',
      marker: '',
      calendar: 'now',
      pressure: '',
      type: 'map',
      location: 'coordinates',
      detail: '',
      metricWind: 'default',
      metricTemp: 'default',
      radarRange: '-1'
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="h-full flex flex-col bg-dark-100">
      {/* Header */}
      <div className="p-6 bg-dark-200 border-b border-dark-400">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-white bg-clip-text text-transparent mb-2">
              Weather Maps
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Real-time weather conditions and forecasts for West Sumbawa surf spots
            </p>
          </div>

          {/* Map Type Selector */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mapTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveMap(type.id)}
                  className={`group relative card-elegant p-4 transition-all duration-300 hover:scale-105 ${
                    activeMap === type.id
                      ? `bg-gradient-to-br ${type.color} shadow-lg shadow-current/25 text-white border-current/50`
                      : 'hover:border-neon-blue/30'
                  }`}
                >
                  <div className="text-center">
                    <div className={`mx-auto mb-3 p-3 rounded-xl ${
                      activeMap === type.id 
                        ? 'bg-white/20' 
                        : 'bg-dark-400 group-hover:bg-dark-300'
                    }`}>
                      <IconComponent className="w-5 h-5 mx-auto" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{type.name}</h3>
                    <p className="text-xs opacity-80">{type.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map Display */}
      <div className="flex-1 p-6">
        <div className="h-full max-w-7xl mx-auto">
          <div className="h-full card-elegant overflow-hidden">
            <iframe
              src={getWindyUrl(activeMap)}
              className="w-full h-full"
              frameBorder="0"
              title={`${mapTypes.find(t => t.id === activeMap)?.name} Weather Map`}
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-dark-200 border-t border-dark-400">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="card-elegant p-4">
              <h4 className="font-bold text-white mb-2">Real-time Data</h4>
              <p className="text-sm text-gray-400">Updated every 6 hours with latest weather conditions</p>
            </div>
            <div className="card-elegant p-4">
              <h4 className="font-bold text-white mb-2">7-Day Forecast</h4>
              <p className="text-sm text-gray-400">Extended weather predictions for surf planning</p>
            </div>
            <div className="card-elegant p-4">
              <h4 className="font-bold text-white mb-2">Interactive Maps</h4>
              <p className="text-sm text-gray-400">Zoom and explore detailed weather patterns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}