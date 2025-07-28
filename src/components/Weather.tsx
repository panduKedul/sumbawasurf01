import React, { useState, useEffect } from 'react';
import { Sun, Thermometer, Eye, Droplets, MapPin, RefreshCw, Wind, Waves, Cloud, Activity } from 'lucide-react';
import { fetchWeatherData, WeatherData, getFallbackWeatherData } from '../services/weatherApi';
import { SurfSpot } from '../types';

interface WeatherProps {
  spots: SurfSpot[];
}

export default function Weather({ spots }: WeatherProps) {
  const [selectedSpot, setSelectedSpot] = useState(spots[0]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (spots.length > 0 && !selectedSpot) {
      setSelectedSpot(spots[0]);
    }
  }, [spots, selectedSpot]);

  useEffect(() => {
    if (selectedSpot) {
      loadWeatherData();
    }
  }, [selectedSpot]);

  const loadWeatherData = async () => {
    if (!selectedSpot) return;
    
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
    if (!selectedSpot) return '';
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
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-400/20', border: 'border-green-400/30' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/30' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-400/20', border: 'border-orange-400/30' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-400', bg: 'bg-red-400/20', border: 'border-red-400/30' };
    return { level: 'Extreme', color: 'text-purple-400', bg: 'bg-purple-400/20', border: 'border-purple-400/30' };
  };

  const uvIndex = calculateUVIndex();
  const uvLevel = getUVLevel(uvIndex);

  const getHourlyForecast = () => {
    return weatherData.slice(0, 12); // Next 12 hours
  };

  if (!selectedSpot) {
    return (
      <div className="h-full flex items-center justify-center bg-dark-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-dark-100 overflow-y-auto">
      {/* Header */}
      <div className="bg-dark-200 border-b border-dark-400 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-white bg-clip-text text-transparent mb-2">
            Weather Forecast
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Real-time conditions for West Sumbawa surf spots
          </p>

          {/* Spot Selector */}
          <div className="flex items-center justify-center space-x-4">
            <select
              value={selectedSpot.id}
              onChange={(e) => {
                const spot = spots.find(s => s.id === e.target.value);
                if (spot) setSelectedSpot(spot);
              }}
              className="input-elegant px-4 py-2 rounded-lg max-w-md"
            >
              {spots.map((spot) => (
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
      </div>

      {/* Interactive Weather Map */}
      <div className="flex-1 p-6 max-w-7xl mx-auto">
        <div className="h-[50vh] card-elegant overflow-hidden mb-6 w-full">
          <iframe
            src={getWindyUrl()}
            className="w-full h-full"
            frameBorder="0"
            title="Weather Forecast Map"
          />
        </div>

        <div className="space-y-6 w-full">
          {/* Current Weather Overview */}
          {currentWeather && (
            <div className="card-elegant p-6">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Current Conditions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                
                <div className={`card-elegant p-4 text-center bg-gradient-to-br ${uvLevel.bg} ${uvLevel.border}`}>
                  <Sun className={`w-6 h-6 ${uvLevel.color} mx-auto mb-2`} />
                  <p className="text-xs text-gray-300 mb-1">UV Index</p>
                  <p className="text-lg font-bold text-white">{uvIndex}</p>
                  <p className={`text-xs ${uvLevel.color} font-medium`}>{uvLevel.level}</p>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Weather Information */}
          {currentWeather && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wind Information */}
              <div className="card-elegant p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Wind className="w-5 h-5 text-cyan-400 mr-2" />
                  Wind Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Speed:</span>
                    <span className="text-white font-semibold">{currentWeather.windSpeed.toFixed(1)} m/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Direction:</span>
                    <span className="text-white font-semibold">{currentWeather.windDirection.toFixed(0)}°</span>
                  </div>
                  <div className="w-full bg-dark-400 rounded-full h-2">
                    <div 
                      className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((currentWeather.windSpeed / 25) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {currentWeather.windSpeed < 5 ? 'Light breeze - perfect for surfing' :
                     currentWeather.windSpeed < 10 ? 'Moderate wind - good conditions' :
                     currentWeather.windSpeed < 15 ? 'Fresh wind - check direction' :
                     'Strong wind - be cautious'}
                  </p>
                </div>
              </div>

              {/* Wave Information */}
              <div className="card-elegant p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Waves className="w-5 h-5 text-blue-400 mr-2" />
                  Wave Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Height:</span>
                    <span className="text-white font-semibold">{currentWeather.waveHeight.toFixed(1)}m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Period:</span>
                    <span className="text-white font-semibold">{currentWeather.wavePeriod.toFixed(1)}s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Direction:</span>
                    <span className="text-white font-semibold">{currentWeather.waveDirection.toFixed(0)}°</span>
                  </div>
                  <div className="w-full bg-dark-400 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((currentWeather.waveHeight / 4) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {currentWeather.waveHeight < 1 ? 'Small waves - beginner friendly' :
                     currentWeather.waveHeight < 2 ? 'Good waves - perfect for most surfers' :
                     currentWeather.waveHeight < 3 ? 'Large waves - experienced surfers' :
                     'Very large waves - experts only'}
                  </p>
                </div>
              </div>

              {/* UV Index Details */}
              <div className={`card-elegant p-6 bg-gradient-to-br ${uvLevel.bg} ${uvLevel.border}`}>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Sun className={`w-5 h-5 ${uvLevel.color} mr-2`} />
                  UV Index Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Current UV:</span>
                    <span className={`font-bold ${uvLevel.color}`}>{uvIndex} - {uvLevel.level}</span>
                  </div>
                  <div className="w-full bg-dark-400 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${uvLevel.color.replace('text-', 'bg-')}`}
                      style={{ width: `${Math.min((uvIndex / 11) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-300">
                    {uvIndex <= 2 && 'Minimal protection needed. Safe to be outside.'}
                    {uvIndex > 2 && uvIndex <= 5 && 'Moderate risk. Seek shade during midday hours.'}
                    {uvIndex > 5 && uvIndex <= 7 && 'High risk. Protection essential. Avoid midday sun.'}
                    {uvIndex > 7 && uvIndex <= 10 && 'Very high risk. Extra protection required.'}
                    {uvIndex > 10 && 'Extreme risk. Avoid sun exposure.'}
                  </div>
                </div>
              </div>

              {/* Additional Weather Info */}
              <div className="card-elegant p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Cloud className="w-5 h-5 text-gray-400 mr-2" />
                  Additional Info
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Cloud Cover:</span>
                    <span className="text-white font-semibold">{currentWeather.cloudCover.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Precipitation:</span>
                    <span className="text-white font-semibold">{currentWeather.precipitation.toFixed(1)}mm</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Visibility:</span>
                    <span className="text-white font-semibold">{currentWeather.visibility.toFixed(1)}km</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hourly Forecast */}
          <div className="card-elegant p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 text-neon-blue mr-2" />
              12-Hour Forecast
            </h3>
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {getHourlyForecast().map((hour, index) => (
                  <div key={index} className="flex-shrink-0 bg-dark-300 rounded-lg p-4 border border-dark-400 min-w-[120px]">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <div className="space-y-2">
                        <div>
                          <Thermometer className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                          <p className="text-sm font-semibold text-white">{hour.airTemperature.toFixed(0)}°C</p>
                        </div>
                        <div>
                          <Wind className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-300">{hour.windSpeed.toFixed(0)} m/s</p>
                        </div>
                        <div>
                          <Waves className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-300">{hour.waveHeight.toFixed(1)}m</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
}