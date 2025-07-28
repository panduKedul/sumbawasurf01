import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Waves, Thermometer, Eye, Droplets, MapPin, RefreshCw } from 'lucide-react';
import { fetchWeatherData, WeatherData, getFallbackWeatherData } from '../services/weatherApi';
import { SURF_SPOTS } from '../data/spots';

export default function Weather() {
  const [activeMap, setActiveMap] = useState('wind');
  const [selectedSpot, setSelectedSpot] = useState(SURF_SPOTS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
      id: 'temp',
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
      id: 'rain',
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

  useEffect(() => {
    loadWeatherData();
  }, [selectedSpot]);

  const loadWeatherData = async () => {
    setLoading(true);
    try {
      const data = await fetchWeatherData(selectedSpot.coordinates[0], selectedSpot.coordinates[1]);
      if (data.length > 0) {
        setWeatherData(data);
      } else {
        // Use fallback data if API fails
        setWeatherData(getFallbackWeatherData());
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading weather data:', error);
      setWeatherData(getFallbackWeatherData());
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const getCurrentWeather = () => {
    if (weatherData.length === 0) return null;
    return weatherData[0];
  };

  const getWindyUrl = (layer: string) => {
    const baseUrl = 'https://embed.windy.com/embed2.html';
    const params = new URLSearchParams({
      lat: selectedSpot.coordinates[0].toString(),
      lon: selectedSpot.coordinates[1].toString(),
      detailLat: selectedSpot.coordinates[0].toString(),
      detailLon: selectedSpot.coordinates[1].toString(),
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

  const currentWeather = getCurrentWeather();

  return (
    <div className="h-full flex flex-col bg-dark-100">
      {/* Header */}
      <div className="p-6 bg-dark-200 border-b border-dark-400">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-white bg-clip-text text-transparent mb-2">
              Weather Forecast
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Real-time weather conditions and forecasts for West Sumbawa surf spots
            </p>
          </div>

          {/* Spot Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Surf Spot
            </label>
            <div className="flex items-center space-x-4">
              <select
                value={selectedSpot.id}
                onChange={(e) => {
                  const spot = SURF_SPOTS.find(s => s.id === e.target.value);
                  if (spot) setSelectedSpot(spot);
                }}
                className="input-elegant px-4 py-2 rounded-lg flex-1 max-w-md"
              >
                {SURF_SPOTS.map((spot) => (
                  <option key={spot.id} value={spot.id}>
                    {spot.name}
                  </option>
                ))}
              </select>
              <button
                onClick={loadWeatherData}
                disabled={loading}
                className="btn-elegant px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Current Weather Summary */}
          {currentWeather && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <div className="card-elegant p-4 text-center">
                <Thermometer className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">Air Temp</p>
                <p className="text-lg font-bold text-white">{currentWeather.airTemperature.toFixed(1)}°C</p>
              </div>
              <div className="card-elegant p-4 text-center">
                <Waves className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">Water Temp</p>
                <p className="text-lg font-bold text-white">{currentWeather.waterTemperature.toFixed(1)}°C</p>
              </div>
              <div className="card-elegant p-4 text-center">
                <Wind className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">Wind</p>
                <p className="text-lg font-bold text-white">{currentWeather.windSpeed.toFixed(1)} m/s</p>
              </div>
              <div className="card-elegant p-4 text-center">
                <Waves className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">Wave Height</p>
                <p className="text-lg font-bold text-white">{currentWeather.waveHeight.toFixed(1)}m</p>
              </div>
              <div className="card-elegant p-4 text-center">
                <Cloud className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">Clouds</p>
                <p className="text-lg font-bold text-white">{currentWeather.cloudCover.toFixed(0)}%</p>
              </div>
              <div className="card-elegant p-4 text-center">
                <Eye className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-gray-400 mb-1">Visibility</p>
                <p className="text-lg font-bold text-white">{currentWeather.visibility.toFixed(1)}km</p>
              </div>
            </div>
          )}

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
              {lastUpdated && (
                <p className="text-xs text-gray-500 mt-2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
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