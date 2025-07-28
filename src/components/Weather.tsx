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
      <div className="min-h-screen flex items-center justify-center bg-dark-100 p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100">
      {/* Header - Fully Responsive */}
      <div className="bg-dark-200 border-b border-dark-400 p-4 lg:p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-neon-blue to-white bg-clip-text text-transparent mb-2">
            Weather Forecast
          </h1>
          <p className="text-sm lg:text-base text-gray-300 mb-4">
            Real-time conditions for West Sumbawa surf spots
          </p>

          {/* Spot Selector - Responsive */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <select
              value={selectedSpot.id}
              onChange={(e) => {
                const spot = spots.find(s => s.id === e.target.value);
                if (spot) setSelectedSpot(spot);
              }}
              className="input-elegant px-3 py-2 rounded-lg w-full text-sm flex-1"
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
              className="btn-elegant px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Container */}
      <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Weather Map - Responsive */}
        <div className="h-64 lg:h-80 card-elegant overflow-hidden">
          <iframe
            src={getWindyUrl()}
            className="w-full h-full border-0"
            frameBorder="0"
            title="Weather Forecast Map"
          />
        </div>

        {/* Current Weather Table - Mobile Responsive */}
        {currentWeather && (
          <div className="card-elegant p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-bold text-white mb-4 text-center">Current Conditions</h2>
            
            {/* Mobile: Stack vertically, Desktop: Table */}
            <div className="block lg:hidden space-y-3">
              {[
                { icon: Thermometer, label: 'Air Temp', value: `${currentWeather.airTemperature.toFixed(1)}°C`, color: 'text-orange-400' },
                { icon: Waves, label: 'Water Temp', value: `${currentWeather.waterTemperature.toFixed(1)}°C`, color: 'text-blue-400' },
                { icon: Wind, label: 'Wind Speed', value: `${currentWeather.windSpeed.toFixed(1)} m/s`, color: 'text-cyan-400' },
                { icon: Waves, label: 'Wave Height', value: `${currentWeather.waveHeight.toFixed(1)}m`, color: 'text-teal-400' },
                { icon: Eye, label: 'Visibility', value: `${currentWeather.visibility.toFixed(1)}km`, color: 'text-purple-400' },
                { icon: Sun, label: 'UV Index', value: `${uvIndex} - ${uvLevel.level}`, color: uvLevel.color }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-300 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-gray-300 text-sm">{item.label}</span>
                  </div>
                  <span className="text-white font-semibold text-sm">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Desktop: Table Layout */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-400">
                    <th className="text-left py-3 px-4 text-gray-300 font-semibold">Metric</th>
                    <th className="text-center py-3 px-4 text-gray-300 font-semibold">Value</th>
                    <th className="text-right py-3 px-4 text-gray-300 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dark-400/50">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <Thermometer className="w-5 h-5 text-orange-400" />
                      <span className="text-white">Air Temperature</span>
                    </td>
                    <td className="py-3 px-4 text-center text-white font-semibold">{currentWeather.airTemperature.toFixed(1)}°C</td>
                    <td className="py-3 px-4 text-right text-orange-400">Perfect</td>
                  </tr>
                  <tr className="border-b border-dark-400/50">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <Waves className="w-5 h-5 text-blue-400" />
                      <span className="text-white">Water Temperature</span>
                    </td>
                    <td className="py-3 px-4 text-center text-white font-semibold">{currentWeather.waterTemperature.toFixed(1)}°C</td>
                    <td className="py-3 px-4 text-right text-blue-400">Ideal</td>
                  </tr>
                  <tr className="border-b border-dark-400/50">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <Wind className="w-5 h-5 text-cyan-400" />
                      <span className="text-white">Wind Speed</span>
                    </td>
                    <td className="py-3 px-4 text-center text-white font-semibold">{currentWeather.windSpeed.toFixed(1)} m/s</td>
                    <td className="py-3 px-4 text-right text-cyan-400">
                      {currentWeather.windSpeed < 10 ? 'Good' : 'Strong'}
                    </td>
                  </tr>
                  <tr className="border-b border-dark-400/50">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <Waves className="w-5 h-5 text-teal-400" />
                      <span className="text-white">Wave Height</span>
                    </td>
                    <td className="py-3 px-4 text-center text-white font-semibold">{currentWeather.waveHeight.toFixed(1)}m</td>
                    <td className="py-3 px-4 text-right text-teal-400">
                      {currentWeather.waveHeight < 2 ? 'Perfect' : 'Large'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <Sun className={`w-5 h-5 ${uvLevel.color}`} />
                      <span className="text-white">UV Index</span>
                    </td>
                    <td className="py-3 px-4 text-center text-white font-semibold">{uvIndex}</td>
                    <td className={`py-3 px-4 text-right ${uvLevel.color}`}>{uvLevel.level}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hourly Forecast - Responsive Table */}
        <div className="card-elegant p-4 lg:p-6">
          <h3 className="text-lg font-bold text-white mb-4 text-center flex items-center justify-center">
            <Activity className="w-5 h-5 text-neon-blue mr-2" />
            12-Hour Forecast
          </h3>
          
          {/* Mobile: Horizontal Scroll Cards */}
          <div className="block lg:hidden">
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {getHourlyForecast().map((hour, index) => (
                <div key={index} className="flex-shrink-0 bg-dark-300 rounded-lg p-3 border border-dark-400 min-w-[120px]">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-1">
                        <Thermometer className="w-3 h-3 text-orange-400" />
                        <span className="text-xs text-white">{hour.airTemperature.toFixed(0)}°C</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Wind className="w-3 h-3 text-cyan-400" />
                        <span className="text-xs text-gray-300">{hour.windSpeed.toFixed(0)} m/s</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Waves className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-gray-300">{hour.waveHeight.toFixed(1)}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Table Layout */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-400">
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Time</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-semibold">Air Temp</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-semibold">Wind</th>
                  <th className="text-center py-3 px-4 text-gray-300 font-semibold">Waves</th>
                  <th className="text-right py-3 px-4 text-gray-300 font-semibold">Conditions</th>
                </tr>
              </thead>
              <tbody>
                {getHourlyForecast().map((hour, index) => (
                  <tr key={index} className="border-b border-dark-400/50 hover:bg-dark-300/50">
                    <td className="py-3 px-4 text-white font-medium">
                      {new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Thermometer className="w-4 h-4 text-orange-400" />
                        <span className="text-white">{hour.airTemperature.toFixed(0)}°C</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Wind className="w-4 h-4 text-cyan-400" />
                        <span className="text-white">{hour.windSpeed.toFixed(0)} m/s</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Waves className="w-4 h-4 text-blue-400" />
                        <span className="text-white">{hour.waveHeight.toFixed(1)}m</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-green-400">
                      {hour.waveHeight > 1.5 ? 'Excellent' : 'Good'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Location Info - Responsive */}
        <div className="card-elegant p-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-300">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-neon-blue" />
              <span className="font-medium text-sm">{selectedSpot.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">{selectedSpot.coordinates[0].toFixed(4)}, {selectedSpot.coordinates[1].toFixed(4)}</span>
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
  );
}