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
    return weatherData.slice(0, 12);
  };

  if (!selectedSpot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-100 p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100 w-full overflow-x-hidden">
      {/* Header - Mobile First */}
      <div className="bg-dark-200 border-b border-dark-400 p-3 sm:p-4 lg:p-6 w-full">
        <div className="w-full max-w-none sm:max-w-2xl lg:max-w-4xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-neon-blue to-white bg-clip-text text-transparent mb-2">
            Weather Forecast
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-300 mb-4 px-2">
            Real-time conditions for West Sumbawa surf spots
          </p>

          {/* Spot Selector - Full Width Mobile */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3 w-full">
            <select
              value={selectedSpot.id}
              onChange={(e) => {
                const spot = spots.find(s => s.id === e.target.value);
                if (spot) setSelectedSpot(spot);
              }}
              className="input-elegant px-3 py-2 rounded-lg w-full sm:flex-1 sm:max-w-xs text-xs sm:text-sm"
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
              className="btn-elegant px-3 py-2 rounded-lg flex items-center justify-center space-x-2 text-xs sm:text-sm w-full sm:w-auto"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile First Container */}
      <div className="w-full px-2 sm:px-4 lg:px-6 py-4 lg:py-6 space-y-4 lg:space-y-6 max-w-none sm:max-w-2xl lg:max-w-4xl mx-auto">
        
        {/* Weather Map - Responsive Height */}
        <div className="h-48 sm:h-64 lg:h-80 card-elegant overflow-hidden w-full">
          <iframe
            src={getWindyUrl()}
            className="w-full h-full border-0"
            frameBorder="0"
            title="Weather Forecast Map"
          />
        </div>

        {/* Current Weather - Mobile Cards */}
        {currentWeather && (
          <div className="card-elegant p-3 sm:p-4 lg:p-6 w-full">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 text-center">
              Current Conditions
            </h2>
            
            {/* Mobile: Vertical Stack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: Thermometer, label: 'Air Temp', value: `${currentWeather.airTemperature.toFixed(1)}°C`, color: 'text-orange-400' },
                { icon: Waves, label: 'Water Temp', value: `${currentWeather.waterTemperature.toFixed(1)}°C`, color: 'text-blue-400' },
                { icon: Wind, label: 'Wind Speed', value: `${currentWeather.windSpeed.toFixed(1)} m/s`, color: 'text-cyan-400' },
                { icon: Waves, label: 'Wave Height', value: `${currentWeather.waveHeight.toFixed(1)}m`, color: 'text-teal-400' },
                { icon: Eye, label: 'Visibility', value: `${currentWeather.visibility.toFixed(1)}km`, color: 'text-purple-400' },
                { icon: Sun, label: 'UV Index', value: `${uvIndex} - ${uvLevel.level}`, color: uvLevel.color }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-dark-300 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color} flex-shrink-0`} />
                    <span className="text-gray-300 text-xs sm:text-sm truncate">{item.label}</span>
                  </div>
                  <span className="text-white font-semibold text-xs sm:text-sm ml-2 flex-shrink-0">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hourly Forecast - Mobile Horizontal Scroll */}
        <div className="card-elegant p-3 sm:p-4 lg:p-6 w-full">
          <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 text-center flex items-center justify-center">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-neon-blue mr-2" />
            12-Hour Forecast
          </h3>
          
          {/* Mobile: Horizontal Scroll */}
          <div className="overflow-x-auto -mx-1">
            <div className="flex space-x-2 sm:space-x-3 pb-2 px-1" style={{ minWidth: 'max-content' }}>
              {getHourlyForecast().map((hour, index) => (
                <div key={index} className="flex-shrink-0 bg-dark-300 rounded-lg p-2 sm:p-3 border border-dark-400 min-w-[100px] sm:min-w-[120px]">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-2 font-medium">
                      {new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </p>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex items-center justify-center space-x-1">
                        <Thermometer className="w-3 h-3 text-orange-400 flex-shrink-0" />
                        <span className="text-xs text-white font-medium">{hour.airTemperature.toFixed(0)}°C</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Wind className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span className="text-xs text-gray-300">{hour.windSpeed.toFixed(0)} m/s</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Waves className="w-3 h-3 text-blue-400 flex-shrink-0" />
                        <span className="text-xs text-gray-300">{hour.waveHeight.toFixed(1)}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Info - Mobile Friendly */}
        <div className="card-elegant p-3 sm:p-4 text-center w-full">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-center sm:space-y-0 sm:space-x-4 text-gray-300">
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-neon-blue flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm truncate">{selectedSpot.name}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
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