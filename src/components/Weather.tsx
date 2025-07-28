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

  const getHourlyForecast = () => {
    return weatherData.slice(0, 12);
  };

  if (!selectedSpot) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg} pt-16`}>
        <div className="text-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${themeClasses.textSecondary} text-xs sm:text-sm`}>Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} pt-16 overflow-x-hidden`}>
      {/* Mobile-First Header */}
      <div className={`${themeClasses.cardBg} border-b ${themeClasses.border} p-2 sm:p-3 md:p-4 lg:p-6`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col items-center space-y-2 mb-3 sm:mb-4">
            <div className={`p-1.5 sm:p-2 ${themeClasses.headerBg} rounded-md sm:rounded-lg shadow-sm`}>
              <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-sm sm:text-base md:text-lg lg:text-3xl font-bold ${themeClasses.accent}`}>
                Weather Forecast
              </h1>
              <p className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>
                Real-time conditions for West Sumbawa
              </p>
            </div>
          </div>

          {/* Mobile-Optimized Spot Selector */}
          <div className="flex flex-col space-y-1.5 sm:space-y-2 max-w-xs sm:max-w-sm mx-auto">
            <select
              value={selectedSpot.id}
              onChange={(e) => {
                const spot = spots.find(s => s.id === e.target.value);
                if (spot) setSelectedSpot(spot);
              }}
              className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg w-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              className={`${themeClasses.button} px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg flex items-center justify-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm w-full transition-all duration-300 shadow-sm`}
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 space-y-2 sm:space-y-3 md:space-y-4 max-w-4xl mx-auto">
        
        {/* Weather Map - Mobile Optimized */}
        <div className={`h-32 sm:h-40 md:h-48 lg:h-64 ${themeClasses.cardBg} rounded-md sm:rounded-lg md:rounded-xl overflow-hidden shadow-sm`}>
          <iframe
            src={getWindyUrl()}
            className="w-full h-full border-0"
            frameBorder="0"
            title="Weather Forecast Map"
          />
        </div>

        {/* Current Weather Cards - Mobile First */}
        {currentWeather && (
          <div className={`${themeClasses.cardBg} p-2 sm:p-3 md:p-4 lg:p-6 rounded-md sm:rounded-lg md:rounded-xl shadow-sm`}>
            <h2 className={`text-xs sm:text-sm md:text-base lg:text-xl font-bold ${themeClasses.text} mb-2 sm:mb-3 text-center flex items-center justify-center`}>
              <Activity className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${themeClasses.accent} mr-1 sm:mr-2`} />
              Current Conditions
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 sm:gap-2 md:gap-3">
              {[
                { icon: Thermometer, label: 'Air Temp', value: `${currentWeather.airTemperature.toFixed(1)}°C`, color: 'text-orange-500' },
                { icon: Waves, label: 'Water Temp', value: `${currentWeather.waterTemperature.toFixed(1)}°C`, color: 'text-blue-500' },
                { icon: Wind, label: 'Wind Speed', value: `${currentWeather.windSpeed.toFixed(1)} m/s`, color: 'text-cyan-500' },
                { icon: Waves, label: 'Wave Height', value: `${currentWeather.waveHeight.toFixed(1)}m`, color: 'text-teal-500' },
                { icon: Eye, label: 'Visibility', value: `${currentWeather.visibility.toFixed(1)}km`, color: 'text-purple-500' },
                { icon: Droplets, label: 'Humidity', value: `${currentWeather.humidity?.toFixed(0) || 65}%`, color: 'text-blue-400' }
              ].map((item, index) => (
                <div key={index} className={`${themeClasses.cardBg} p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg text-center shadow-sm border ${themeClasses.border}`}>
                  <item.icon className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${item.color} mx-auto mb-1`} />
                  <span className={`${themeClasses.textSecondary} text-xs block mb-0.5 sm:mb-1`}>{item.label}</span>
                  <span className={`${themeClasses.text} font-semibold text-xs sm:text-sm`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12-Hour Forecast - Mobile Optimized */}
        <div className={`${themeClasses.cardBg} p-2 sm:p-3 md:p-4 lg:p-6 rounded-md sm:rounded-lg md:rounded-xl shadow-sm`}>
          <h3 className={`text-xs sm:text-sm md:text-base lg:text-xl font-bold ${themeClasses.text} mb-2 sm:mb-3 text-center flex items-center justify-center`}>
            <Activity className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${themeClasses.accent} mr-1 sm:mr-2`} />
            12-Hour Forecast
          </h3>
          
          <div className="overflow-x-auto">
            <div className="flex gap-1 sm:gap-2 pb-2" style={{ minWidth: 'max-content' }}>
              {getHourlyForecast().map((hour, index) => (
                <div key={index} className={`flex-shrink-0 ${themeClasses.cardBg} rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-3 border ${themeClasses.border} min-w-[60px] sm:min-w-[80px] md:min-w-[90px] shadow-sm`}>
                  <div className="text-center">
                    <p className={`text-xs ${themeClasses.textSecondary} mb-1 sm:mb-2 font-medium`}>
                      {new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </p>
                    <div className="space-y-0.5 sm:space-y-1">
                      <div className="flex items-center justify-center space-x-0.5 sm:space-x-1">
                        <Thermometer className="w-2 h-2 sm:w-3 sm:h-3 text-orange-500" />
                        <span className={`text-xs ${themeClasses.text} font-medium`}>{hour.airTemperature.toFixed(0)}°C</span>
                      </div>
                      <div className="flex items-center justify-center space-x-0.5 sm:space-x-1">
                        <Wind className="w-2 h-2 sm:w-3 sm:h-3 text-cyan-500" />
                        <span className={`text-xs ${themeClasses.textSecondary}`}>{hour.windSpeed.toFixed(0)} m/s</span>
                      </div>
                      <div className="flex items-center justify-center space-x-0.5 sm:space-x-1">
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

        {/* Location Info - Mobile Optimized */}
        <div className={`${themeClasses.cardBg} p-2 sm:p-3 md:p-4 rounded-md sm:rounded-lg md:rounded-xl text-center shadow-sm`}>
          <div className={`flex flex-col space-y-1 sm:space-y-2 ${themeClasses.textSecondary}`}>
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <MapPin className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.accent}`} />
              <span className={`font-medium text-xs sm:text-sm ${themeClasses.text}`}>{selectedSpot.name}</span>
            </div>
            <div className="text-xs">
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