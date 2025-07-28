import React, { useState, useEffect } from 'react';
import { Sun, Thermometer, Eye, Droplets, MapPin, RefreshCw, Wind, Waves } from 'lucide-react';
import { fetchWeatherData, WeatherData, getFallbackWeatherData } from '../services/weatherApi';
import { SURF_SPOTS } from '../data/spots';

export default function Weather() {
  const [selectedSpot, setSelectedSpot] = useState(SURF_SPOTS[0]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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

  const getWindyUrl = () => {
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
      overlay: 'wind',
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

  // Calculate UV Index (simplified calculation based on time and cloud cover)
  const calculateUVIndex = () => {
    if (!currentWeather) return 0;
    const hour = new Date().getHours();
    const baseUV = hour >= 10 && hour <= 16 ? 8 : hour >= 8 && hour <= 18 ? 5 : 2;
    const cloudReduction = (currentWeather.cloudCover / 100) * 3;
    return Math.max(0, Math.round(baseUV - cloudReduction));
  };

  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-400/20' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-400/20' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-400', bg: 'bg-red-400/20' };
    return { level: 'Extreme', color: 'text-purple-400', bg: 'bg-purple-400/20' };
  };

  const uvIndex = calculateUVIndex();
  const uvLevel = getUVLevel(uvIndex);

  return (
    <div className="h-full flex flex-col bg-dark-100">
      {/* Interactive Weather Map */}
      <div className="flex-1">
        <div className="h-full card-elegant m-6 overflow-hidden">
          <iframe
            src={getWindyUrl()}
            className="w-full h-full"
            frameBorder="0"
            title="Weather Forecast Map"
          />
        </div>
      </div>

      {/* Weather Information Panel */}
      <div className="bg-dark-200 border-t border-dark-400 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-white bg-clip-text text-transparent mb-2">
              Weather Forecast
            </h1>
            <p className="text-gray-300">
              Real-time conditions for West Sumbawa surf spots
            </p>
          </div>

          {/* Spot Selector */}
          <div className="mb-6 flex items-center justify-center space-x-4">
            <select
              value={selectedSpot.id}
              onChange={(e) => {
                const spot = SURF_SPOTS.find(s => s.id === e.target.value);
                if (spot) setSelectedSpot(spot);
              }}
              className="input-elegant px-4 py-2 rounded-lg max-w-md"
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

          {/* Current Weather Cards */}
          {currentWeather && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <div className="card-elegant p-4 text-center bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
                <Thermometer className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300 mb-1">Air Temp</p>
                <p className="text-lg font-bold text-white">{currentWeather.airTemperature.toFixed(1)}°C</p>
              </div>
              
              <div className="card-elegant p-4 text-center bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
                <Waves className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300 mb-1">Water Temp</p>
                <p className="text-lg font-bold text-white">{currentWeather.waterTemperature.toFixed(1)}°C</p>
              </div>
              
              <div className="card-elegant p-4 text-center bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-cyan-500/30">
                <Wind className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300 mb-1">Wind Speed</p>
                <p className="text-lg font-bold text-white">{currentWeather.windSpeed.toFixed(1)} m/s</p>
              </div>
              
              <div className="card-elegant p-4 text-center bg-gradient-to-br from-teal-500/20 to-green-500/20 border-teal-500/30">
                <Waves className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300 mb-1">Wave Height</p>
                <p className="text-lg font-bold text-white">{currentWeather.waveHeight.toFixed(1)}m</p>
              </div>
              
              <div className="card-elegant p-4 text-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
                <Eye className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300 mb-1">Visibility</p>
                <p className="text-lg font-bold text-white">{currentWeather.visibility.toFixed(1)}km</p>
              </div>
              
              <div className={`card-elegant p-4 text-center bg-gradient-to-br ${uvLevel.bg} border-current/30`}>
                <Sun className={`w-6 h-6 ${uvLevel.color} mx-auto mb-2`} />
                <p className="text-xs text-gray-300 mb-1">UV Index</p>
                <p className="text-lg font-bold text-white">{uvIndex}</p>
                <p className={`text-xs ${uvLevel.color} font-medium`}>{uvLevel.level}</p>
              </div>
            </div>
          )}

          {/* Location Info */}
          <div className="card-elegant p-4 text-center">
            <div className="flex items-center justify-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-neon-blue" />
                <span className="font-medium">{selectedSpot.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>{selectedSpot.coordinates[0].toFixed(4)}, {selectedSpot.coordinates[1].toFixed(4)}</span>
              </div>
              {lastUpdated && (
                <div className="text-xs text-gray-500">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          {/* Weather Tips for Surfers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="card-elegant p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
              <div className="text-center">
                <Wind className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-2">Wind Conditions</h4>
                <p className="text-sm text-gray-300">
                  {currentWeather && currentWeather.windSpeed < 10 ? 'Light winds - great for surfing!' : 
                   currentWeather && currentWeather.windSpeed < 20 ? 'Moderate winds - check direction' : 
                   'Strong winds - be cautious'}
                </p>
              </div>
            </div>
            
            <div className={`card-elegant p-4 bg-gradient-to-br ${uvLevel.bg} border-current/30`}>
              <div className="text-center">
                <Sun className={`w-6 h-6 ${uvLevel.color} mx-auto mb-2`} />
                <h4 className="font-bold text-white mb-2">UV Protection</h4>
                <p className="text-sm text-gray-300">
                  {uvIndex <= 2 ? 'Low UV - minimal protection needed' :
                   uvIndex <= 5 ? 'Moderate UV - use sunscreen' :
                   uvIndex <= 7 ? 'High UV - protection essential' :
                   'Very high UV - avoid midday sun'}
                </p>
              </div>
            </div>
            
            <div className="card-elegant p-4 bg-gradient-to-br from-teal-500/20 to-green-500/20 border-teal-500/30">
              <div className="text-center">
                <Waves className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <h4 className="font-bold text-white mb-2">Wave Conditions</h4>
                <p className="text-sm text-gray-300">
                  {currentWeather && currentWeather.waveHeight < 1 ? 'Small waves - beginner friendly' :
                   currentWeather && currentWeather.waveHeight < 2 ? 'Good waves - perfect for most surfers' :
                   'Large waves - experienced surfers only'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}