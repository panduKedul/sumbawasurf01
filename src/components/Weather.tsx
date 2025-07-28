import React, { useState, useEffect } from 'react';
import { Sun, Thermometer, Eye, Droplets, MapPin, RefreshCw, Wind, Waves, Cloud, Activity } from 'lucide-react';
import { fetchWeatherData, WeatherData, getFallbackWeatherData } from '../services/weatherApi';
import { SurfSpot } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface WeatherProps {
  spots: SurfSpot[];
}

export default function Weather({ spots }: WeatherProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
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
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-200' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-100', border: 'border-yellow-200' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-200' };
    return { level: 'Extreme', color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-200' };
  };

  const uvIndex = calculateUVIndex();
  const uvLevel = getUVLevel(uvIndex);

  const getHourlyForecast = () => {
    return weatherData.slice(0, 12);
  };

  if (!selectedSpot) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg} pt-16`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${themeClasses.textSecondary} text-sm`}>Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} pt-16 overflow-x-hidden`}>
      {/* Header */}
      <div className={`${themeClasses.cardBg} border-b ${themeClasses.border} p-3 sm:p-4 lg:p-6`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <div className={`p-2 ${themeClasses.headerBg} rounded-lg shadow-lg`}>
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-lg sm:text-xl lg:text-3xl font-bold ${themeClasses.accent}`}>
                Weather Forecast
              </h1>
              <p className={`text-xs sm:text-sm lg:text-base ${themeClasses.textSecondary}`}>
                Real-time conditions for West Sumbawa
              </p>
            </div>
          </div>

          {/* Spot Selector */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 max-w-md mx-auto">
            <select
              value={selectedSpot.id}
              onChange={(e) => {
                const spot = spots.find(s => s.id === e.target.value);
                if (spot) setSelectedSpot(spot);
              }}
              className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} px-3 py-2 rounded-lg w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className={`${themeClasses.button} px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-xs sm:text-sm w-full sm:w-auto transition-all duration-300 shadow-lg`}
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto">
        
        {/* Weather Map */}
        <div className={`h-48 sm:h-64 lg:h-80 ${themeClasses.cardBg} rounded-xl overflow-hidden shadow-xl`}>
          <iframe
            src={getWindyUrl()}
            className="w-full h-full border-0"
            frameBorder="0"
            title="Weather Forecast Map"
          />
        </div>

        {/* Current Weather Cards */}
        {currentWeather && (
          <div className={`${themeClasses.cardBg} p-3 sm:p-4 lg:p-6 rounded-xl shadow-xl`}>
            <h2 className={`text-base sm:text-lg lg:text-xl font-bold ${themeClasses.text} mb-3 sm:mb-4 text-center flex items-center justify-center`}>
              <Activity className={`w-4 h-4 sm:w-5 sm:h-5 ${themeClasses.accent} mr-2`} />
              Current Conditions
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              {[
                { icon: Thermometer, label: 'Air Temp', value: `${currentWeather.airTemperature.toFixed(1)}°C`, color: 'text-orange-500' },
                { icon: Waves, label: 'Water Temp', value: `${currentWeather.waterTemperature.toFixed(1)}°C`, color: 'text-blue-500' },
                { icon: Wind, label: 'Wind Speed', value: `${currentWeather.windSpeed.toFixed(1)} m/s`, color: 'text-cyan-500' },
                { icon: Waves, label: 'Wave Height', value: `${currentWeather.waveHeight.toFixed(1)}m`, color: 'text-teal-500' },
                { icon: Eye, label: 'Visibility', value: `${currentWeather.visibility.toFixed(1)}km`, color: 'text-purple-500' },
                { icon: Sun, label: 'UV Index', value: `${uvIndex} - ${uvLevel.level}`, color: uvLevel.color }
              ].map((item, index) => (
                <div key={index} className={`${themeClasses.cardBg} p-2 sm:p-3 lg:p-4 rounded-lg text-center shadow-md border ${themeClasses.border}`}>
                  <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${item.color} mx-auto mb-1 sm:mb-2`} />
                  <span className={`${themeClasses.textSecondary} text-xs block mb-1`}>{item.label}</span>
                  <span className={`${themeClasses.text} font-semibold text-xs sm:text-sm`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hourly Forecast */}
        <div className={`${themeClasses.cardBg} p-3 sm:p-4 lg:p-6 rounded-xl shadow-xl`}>
          <h3 className={`text-base sm:text-lg lg:text-xl font-bold ${themeClasses.text} mb-3 sm:mb-4 text-center flex items-center justify-center`}>
            <Activity className={`w-4 h-4 sm:w-5 sm:h-5 ${themeClasses.accent} mr-2`} />
            12-Hour Forecast
          </h3>
          
          <div className="overflow-x-auto">
            <div className="flex gap-2 sm:gap-3 pb-2" style={{ minWidth: 'max-content' }}>
              {getHourlyForecast().map((hour, index) => (
                <div key={index} className={`flex-shrink-0 ${themeClasses.cardBg} rounded-lg p-2 sm:p-3 border ${themeClasses.border} min-w-[80px] sm:min-w-[100px] shadow-md`}>
                  <div className="text-center">
                    <p className={`text-xs ${themeClasses.textSecondary} mb-2 font-medium`}>
                      {new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </p>
                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex items-center justify-center space-x-1">
                        <Thermometer className="w-2 h-2 sm:w-3 sm:h-3 text-orange-500" />
                        <span className={`text-xs ${themeClasses.text} font-medium`}>{hour.airTemperature.toFixed(0)}°C</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Wind className="w-2 h-2 sm:w-3 sm:h-3 text-cyan-500" />
                        <span className={`text-xs ${themeClasses.textSecondary}`}>{hour.windSpeed.toFixed(0)} m/s</span>
                      </div>
                      <div className="flex items-center justify-center space-x-1">
                        <Waves className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
                        <span className={`text-xs ${themeClasses.textSecondary}`}>{hour.waveHeight.toFixed(1)}m</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className={`${themeClasses.cardBg} p-3 sm:p-4 rounded-xl text-center shadow-xl`}>
          <div className={`flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 ${themeClasses.textSecondary}`}>
            <div className="flex items-center space-x-2">
              <MapPin className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.accent}`} />
              <span className={`font-medium text-xs sm:text-sm ${themeClasses.text}`}>{selectedSpot.name}</span>
            </div>
            <div className="text-xs sm:text-sm">
              {selectedSpot.coordinates[0].toFixed(4)}, {selectedSpot.coordinates[1].toFixed(4)}
            </div>
            {lastUpdated && (
              <div className="text-xs">
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}