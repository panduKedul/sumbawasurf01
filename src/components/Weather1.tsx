import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Waves, Thermometer, Eye, Droplets, Sun, Moon, MapPin, RefreshCw, Activity, Compass } from 'lucide-react';
import { fetchWeatherData, WeatherData, getFallbackWeatherData } from '../services/weatherApi';
import { SurfSpot } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface Weather1Props {
  spots: SurfSpot[];
}

export default function Weather1({ spots }: Weather1Props) {
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

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
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
      zoom: '10',
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
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-500', bg: 'bg-green-100' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-500', bg: 'bg-orange-100' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-500', bg: 'bg-red-100' };
    return { level: 'Extreme', color: 'text-purple-500', bg: 'bg-purple-100' };
  };

  const uvIndex = calculateUVIndex();
  const uvLevel = getUVLevel(uvIndex);

  const getHourlyForecast = () => {
    return weatherData.slice(0, 24);
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
      {/* Hero Header */}
      <div className={`${themeClasses.cardBg} border-b ${themeClasses.border} p-2 sm:p-3 md:p-4 lg:p-6`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <div className="flex flex-col items-center space-y-3 mb-4">
              <div className={`p-1.5 sm:p-2 ${themeClasses.headerBg} rounded-md sm:rounded-lg shadow-sm`}>
                <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-sm sm:text-base md:text-lg lg:text-3xl font-bold ${themeClasses.accent}`}>
                  Advanced Weather Station
                </h1>
                <p className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>
                  Comprehensive weather analysis for West Sumbawa
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
      </div>

      {/* Main Content */}
      <div className="p-2 sm:p-3 md:p-4 lg:p-6 space-y-2 sm:space-y-3 md:space-y-4 max-w-4xl mx-auto">
        
        {/* Current Weather Hero Card */}
        {currentWeather && (
          <div className={`${themeClasses.cardBg} rounded-md sm:rounded-lg md:rounded-xl shadow-sm overflow-hidden`}>
            <div className="p-2 sm:p-3 md:p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                {/* Left Side - Main Weather */}
                <div className="text-center">
                  <h2 className={`text-xs sm:text-sm md:text-base lg:text-xl font-bold ${themeClasses.text} mb-1 sm:mb-2`}>Current Conditions</h2>
                  <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 md:space-x-3 mb-2 sm:mb-3">
                    <div className={`p-1 sm:p-1.5 md:p-2 ${themeClasses.headerBg} rounded-md`}>
                      <Thermometer className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <div className={`text-base sm:text-lg md:text-2xl lg:text-3xl font-bold ${themeClasses.accent}`}>
                        {currentWeather.airTemperature.toFixed(1)}°C
                      </div>
                      <div className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>Air Temperature</div>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-3">
                    <div className="text-center">
                      <div className={`text-xs sm:text-sm font-bold ${themeClasses.text}`}>
                        {currentWeather.waterTemperature.toFixed(1)}°C
                      </div>
                      <div className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>Water Temp</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xs sm:text-sm font-bold ${themeClasses.text}`}>
                        {currentWeather.cloudCover.toFixed(0)}%
                      </div>
                      <div className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>Cloud Cover</div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Wind & Waves */}
                <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                  {/* Wind Info */}
                  <div className={`${themeClasses.cardBg} p-1.5 sm:p-2 md:p-3 rounded-md border ${themeClasses.border}`}>
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                      <Wind className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.accent}`} />
                      <h3 className={`text-xs sm:text-sm font-bold ${themeClasses.text}`}>Wind Conditions</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-1 sm:gap-2">
                      <div>
                        <div className={`text-xs sm:text-sm font-bold ${themeClasses.accent}`}>
                          {currentWeather.windSpeed.toFixed(1)} m/s
                        </div>
                        <div className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>Speed</div>
                      </div>
                      <div>
                        <div className={`text-xs sm:text-sm font-bold ${themeClasses.accent} flex items-center justify-center space-x-0.5 sm:space-x-1`}>
                          <Compass className="w-2 h-2 sm:w-3 sm:h-3" />
                          <span>{getWindDirection(currentWeather.windDirection)}</span>
                        </div>
                        <div className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>Direction</div>
                      </div>
                    </div>
                  </div>

                  {/* Wave Info */}
                  <div className={`${themeClasses.cardBg} p-1.5 sm:p-2 md:p-3 rounded-md border ${themeClasses.border}`}>
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                      <Waves className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.accent}`} />
                      <h3 className={`text-xs sm:text-sm font-bold ${themeClasses.text}`}>Wave Conditions</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-1 sm:gap-2">
                      <div>
                        <div className={`text-xs sm:text-sm font-bold ${themeClasses.accent}`}>
                          {currentWeather.waveHeight.toFixed(1)}m
                        </div>
                        <div className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>Height</div>
                      </div>
                      <div>
                        <div className={`text-xs sm:text-sm font-bold ${themeClasses.accent}`}>
                          {currentWeather.wavePeriod.toFixed(0)}s
                        </div>
                        <div className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>Period</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather Map */}
        <div className={`${themeClasses.cardBg} rounded-md sm:rounded-lg md:rounded-xl overflow-hidden shadow-sm`}>
          <div className={`p-1.5 sm:p-2 md:p-3 border-b ${themeClasses.border}`}>
            <h3 className={`text-xs sm:text-sm md:text-base font-bold ${themeClasses.text} text-center`}>Live Weather Map</h3>
          </div>
          <div className="h-24 sm:h-32 md:h-40 lg:h-48">
            <iframe
              src={getWindyUrl()}
              className="w-full h-full border-0"
              frameBorder="0"
              title="Weather Forecast Map"
            />
          </div>
        </div>

        {/* Extended Weather Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2">
          {[
            { icon: Eye, label: 'Visibility', value: `${currentWeather?.visibility.toFixed(1) || 0}km`, color: 'text-purple-500' },
            { icon: Droplets, label: 'Precipitation', value: `${currentWeather?.precipitation.toFixed(1) || 0}mm`, color: 'text-blue-500' },
            { icon: Sun, label: 'UV Index', value: `${uvIndex} - ${uvLevel.level}`, color: uvLevel.color },
            { icon: Activity, label: 'Pressure', value: '1013 hPa', color: 'text-green-500' }
          ].map((item, index) => (
            <div key={index} className={`${themeClasses.cardBg} p-1.5 sm:p-2 rounded-md text-center shadow-sm border ${themeClasses.border}`}>
              <item.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${item.color} mx-auto mb-0.5 sm:mb-1`} />
              <div className={`text-xs font-bold ${themeClasses.text} mb-1`}>{item.value}</div>
              <div className={`text-xs ${themeClasses.textSecondary}`}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* 24-Hour Forecast */}
        <div className={`${themeClasses.cardBg} rounded-md sm:rounded-lg md:rounded-xl shadow-sm overflow-hidden`}>
          <div className={`p-1.5 sm:p-2 md:p-3 border-b ${themeClasses.border}`}>
            <h3 className={`text-xs sm:text-sm md:text-base font-bold ${themeClasses.text} text-center flex items-center justify-center space-x-1`}>
              <Activity className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.accent}`} />
              <span>24-Hour Detailed Forecast</span>
            </h3>
          </div>
          
          <div className="p-1.5 sm:p-2 md:p-3">
            <div className="overflow-x-auto">
              <div className="flex gap-1 sm:gap-2 pb-2" style={{ minWidth: 'max-content' }}>
                {getHourlyForecast().map((hour, index) => (
                  <div key={index} className={`flex-shrink-0 ${themeClasses.cardBg} rounded-md p-1.5 sm:p-2 border ${themeClasses.border} min-w-[60px] sm:min-w-[80px] md:min-w-[90px] shadow-sm`}>
                    <div className="text-center">
                      <p className={`text-xs ${themeClasses.textSecondary} mb-1 font-medium`}>
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
                        <div className="flex items-center justify-center space-x-0.5 sm:space-x-1">
                          <Cloud className="w-2 h-2 sm:w-3 sm:h-3 text-gray-500" />
                          <span className={`text-xs ${themeClasses.textSecondary}`}>{hour.cloudCover.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Update Info */}
        <div className={`${themeClasses.cardBg} p-2 sm:p-3 rounded-md sm:rounded-lg text-center shadow-sm`}>
          <div className={`flex flex-col space-y-1 sm:space-y-2 ${themeClasses.textSecondary}`}>
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              <MapPin className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.accent}`} />
              <span className={`font-medium text-xs sm:text-sm ${themeClasses.text}`}>{selectedSpot.name}</span>
            </div>
            <div className="text-xs sm:text-sm">
              {selectedSpot.coordinates[0].toFixed(4)}, {selectedSpot.coordinates[1].toFixed(4)}
            </div>
            {lastUpdated && (
              <div className="text-xs">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}