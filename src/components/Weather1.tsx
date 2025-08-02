import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Waves, Thermometer, Eye, Droplets, Sun, Moon, MapPin, RefreshCw, Activity, Compass } from 'lucide-react';
import { fetchWeatherData, WeatherData, getFallbackWeatherData } from '../services/weatherApi';
import { SurfSpot } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { 
  getWindCondition, 
  getWaveCondition, 
  getTemperatureCondition, 
  getUVCondition,
  getCloudCondition,
  getVisibilityCondition,
  getBestSurfTimeRecommendation
} from '../utils/weatherDescriptions';

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
    // Show data every 4 hours: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00
    return weatherData.filter((_, index) => index % 4 === 0).slice(0, 6);
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
      {/* Advanced Glass Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-purple-500/20 backdrop-blur-xl"></div>
        <div className={`relative ${themeClasses.cardBg} border-b ${themeClasses.border} p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-3 xs:mb-4 sm:mb-6">
              <div className="flex flex-col items-center space-y-2 xs:space-y-3 sm:space-y-4 mb-3 xs:mb-4 sm:mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-30"></div>
                  <div className={`relative p-2 xs:p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-2xl shadow-2xl`}>
                    <Cloud className="w-4 h-4 xs:w-5 xs:h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-base xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent mb-1 xs:mb-2 sm:mb-2`}>
                    Advanced Weather Station
                  </h1>
                  <p className={`text-xs xs:text-sm sm:text-base lg:text-lg ${themeClasses.textSecondary} px-2 xs:px-3`}>
                    Comprehensive weather analysis for West Sumbawa
                  </p>
                </div>
              </div>

              {/* Enhanced Spot Selector */}
              <div className="flex flex-col gap-2 xs:gap-3 sm:flex-row sm:gap-4 max-w-full xs:max-w-sm sm:max-w-md mx-auto px-2 xs:px-3 sm:px-0">
                <select
                  value={selectedSpot.id}
                  onChange={(e) => {
                    const spot = spots.find(s => s.id === e.target.value);
                    if (spot) setSelectedSpot(spot);
                  }}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-md sm:rounded-xl w-full text-xs xs:text-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm shadow-lg`}
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
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-md sm:rounded-xl flex items-center justify-center space-x-1.5 xs:space-x-2 sm:space-x-2 text-xs xs:text-sm sm:text-sm font-medium transition-all duration-300 shadow-lg backdrop-blur-sm"
                >
                  <RefreshCw className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 space-y-3 xs:space-y-4 sm:space-y-6 max-w-full xs:max-w-sm sm:max-w-6xl mx-auto overflow-x-hidden">
        
        {/* Current Weather Hero Card - Enhanced */}
        {currentWeather && (
          <>
            {/* Best Surf Time Recommendation */}
            <div className="relative overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl mb-3 xs:mb-4 sm:mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 backdrop-blur-xl"></div>
              <div className={`relative ${themeClasses.cardBg} p-3 xs:p-4 sm:p-6 lg:p-8 shadow-2xl border ${themeClasses.border}`}>
                <div className="text-center">
                  <h2 className={`text-sm xs:text-base sm:text-xl lg:text-2xl font-bold ${themeClasses.text} mb-2 xs:mb-3 sm:mb-4 flex items-center justify-center`}>
                    <Activity className={`w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${themeClasses.accent} mr-2 xs:mr-2 sm:mr-3`} />
                    Today's Surf Recommendations
                  </h2>
                  <div className={`${themeClasses.cardBg} p-2 xs:p-3 sm:p-4 lg:p-6 rounded-md xs:rounded-lg sm:rounded-xl border ${themeClasses.border} shadow-lg`}>
                    <p className={`text-xs xs:text-sm sm:text-base lg:text-lg ${themeClasses.text} leading-tight xs:leading-normal sm:leading-relaxed`}>
                      {getBestSurfTimeRecommendation(currentWeather, null)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          <div className="relative overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-purple-500/10 backdrop-blur-xl"></div>
            <div className={`relative ${themeClasses.cardBg} p-3 xs:p-4 sm:p-4 md:p-6 lg:p-8 shadow-2xl border ${themeClasses.border}`}>
              <div className="grid grid-cols-1 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
                {/* Left Side - Main Weather - Enhanced */}
                <div className="text-center lg:text-left">
                  <h2 className={`text-sm xs:text-base sm:text-xl md:text-2xl lg:text-3xl font-bold ${themeClasses.text} mb-2 xs:mb-3 sm:mb-4 flex items-center justify-center lg:justify-start`}>
                    <Activity className={`w-4 h-4 xs:w-4 xs:h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 ${themeClasses.accent} mr-2 xs:mr-2 sm:mr-3`} />
                    Current Conditions
                  </h2>
                  
                  {/* Temperature Description */}
                  <div className={`${themeClasses.cardBg} p-2 xs:p-3 sm:p-4 rounded-md xs:rounded-lg sm:rounded-xl mb-2 xs:mb-3 sm:mb-4 border ${themeClasses.border} shadow-lg`}>
                    <div className="text-left">
                      <h4 className={`font-bold ${themeClasses.accent} mb-1 xs:mb-1.5 sm:mb-2 text-xs xs:text-sm sm:text-sm lg:text-base`}>
                        {getTemperatureCondition(currentWeather.airTemperature).title}
                      </h4>
                      <p className={`text-xs xs:text-xs ${themeClasses.textSecondary} mb-1 xs:mb-1.5 sm:mb-2 leading-tight xs:leading-normal`}>
                        {getTemperatureCondition(currentWeather.airTemperature).description}
                      </p>
                      <p className={`text-xs xs:text-xs ${themeClasses.text} font-medium leading-tight xs:leading-normal`}>
                        💡 {getTemperatureCondition(currentWeather.airTemperature).recommendation}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start space-x-2 xs:space-x-3 sm:space-x-4 mb-3 xs:mb-4 sm:mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-30"></div>
                      <div className={`relative p-2 xs:p-2.5 sm:p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-md xs:rounded-lg sm:rounded-xl`}>
                        <Thermometer className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className={`text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent`}>
                        {currentWeather.airTemperature.toFixed(1)}°C
                      </div>
                      <div className={`text-xs xs:text-sm ${themeClasses.textSecondary}`}>Air Temperature</div>
                    </div>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:gap-3 md:gap-4 mb-3 xs:mb-4">
                    <div className={`${themeClasses.cardBg} p-2 xs:p-3 sm:p-3 md:p-4 rounded-md xs:rounded-lg sm:rounded-xl text-center shadow-lg border ${themeClasses.border}`}>
                      <div className={`text-sm xs:text-base sm:text-base md:text-lg lg:text-xl font-bold ${themeClasses.accent}`}>
                        {currentWeather.waterTemperature.toFixed(1)}°C
                      </div>
                      <div className={`text-xs xs:text-sm ${themeClasses.textSecondary}`}>Water Temp</div>
                    </div>
                    <div className={`${themeClasses.cardBg} p-2 xs:p-3 sm:p-3 md:p-4 rounded-md xs:rounded-lg sm:rounded-xl text-center shadow-lg border ${themeClasses.border}`}>
                      <div className={`text-sm xs:text-base sm:text-base md:text-lg lg:text-xl font-bold ${themeClasses.accent}`}>
                        {currentWeather.cloudCover.toFixed(0)}%
                      </div>
                      <div className={`text-xs xs:text-sm ${themeClasses.textSecondary}`}>Cloud Cover</div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Wind & Waves - Enhanced */}
                <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                  {/* Wind Info - Enhanced */}
                  <div className="relative overflow-hidden rounded-md xs:rounded-lg sm:rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm"></div>
                    <div className={`relative ${themeClasses.cardBg} p-2 xs:p-3 sm:p-4 lg:p-6 border ${themeClasses.border} shadow-lg`}>
                      <div className="flex items-center space-x-2 xs:space-x-2 sm:space-x-3 mb-2 xs:mb-3 sm:mb-4">
                        <Wind className={`w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${themeClasses.accent}`} />
                        <h3 className={`text-sm xs:text-base sm:text-base md:text-lg lg:text-xl font-bold ${themeClasses.text}`}>Wind</h3>
                      </div>
                      
                      {/* Wind Description */}
                      <div className={`${themeClasses.cardBg} p-2 xs:p-2.5 sm:p-3 rounded-md xs:rounded-lg mb-2 xs:mb-3 sm:mb-4 border ${themeClasses.border}`}>
                        <h4 className={`font-bold ${themeClasses.accent} mb-1 xs:mb-1 text-xs xs:text-xs`}>
                          {getWindCondition(currentWeather.windSpeed).title}
                        </h4>
                        <p className={`text-xs xs:text-xs ${themeClasses.textSecondary} mb-1 xs:mb-1 leading-tight xs:leading-normal`}>
                          {getWindCondition(currentWeather.windSpeed).description}
                        </p>
                        <p className={`text-xs xs:text-xs ${themeClasses.text} font-medium`}>
                          💡 {getWindCondition(currentWeather.windSpeed).recommendation}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 xs:gap-2 sm:gap-3">
                        <div>
                          <div className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${themeClasses.accent}`}>
                            {currentWeather.windSpeed.toFixed(1)} m/s
                          </div>
                          <div className={`text-xs xs:text-sm ${themeClasses.textSecondary}`}>Speed</div>
                        </div>
                        <div>
                          <div className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${themeClasses.accent} flex items-center space-x-1 xs:space-x-1`}>
                            <Compass className="w-3 h-3 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                            <span>{getWindDirection(currentWeather.windDirection)}</span>
                          </div>
                          <div className={`text-xs xs:text-sm ${themeClasses.textSecondary}`}>Direction</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wave Info - Enhanced */}
                  <div className="relative overflow-hidden rounded-md xs:rounded-lg sm:rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-sm"></div>
                    <div className={`relative ${themeClasses.cardBg} p-2 xs:p-3 sm:p-4 lg:p-6 border ${themeClasses.border} shadow-lg`}>
                      <div className="flex items-center space-x-2 xs:space-x-2 sm:space-x-3 mb-2 xs:mb-3 sm:mb-4">
                        <Waves className={`w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${themeClasses.accent}`} />
                        <h3 className={`text-sm xs:text-base sm:text-base md:text-lg lg:text-xl font-bold ${themeClasses.text}`}>Waves</h3>
                      </div>
                      
                      {/* Wave Description */}
                      <div className={`${themeClasses.cardBg} p-2 xs:p-2.5 sm:p-3 rounded-md xs:rounded-lg mb-2 xs:mb-3 sm:mb-4 border ${themeClasses.border}`}>
                        <h4 className={`font-bold ${themeClasses.accent} mb-1 xs:mb-1 text-xs xs:text-xs`}>
                          {getWaveCondition(currentWeather.waveHeight).title}
                        </h4>
                        <p className={`text-xs xs:text-xs ${themeClasses.textSecondary} mb-1 xs:mb-1 leading-tight xs:leading-normal`}>
                          {getWaveCondition(currentWeather.waveHeight).description}
                        </p>
                        <p className={`text-xs xs:text-xs ${themeClasses.text} font-medium`}>
                          💡 {getWaveCondition(currentWeather.waveHeight).recommendation}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 xs:gap-2 sm:gap-3">
                        <div>
                          <div className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${themeClasses.accent}`}>
                            {currentWeather.waveHeight.toFixed(1)}m
                          </div>
                          <div className={`text-xs xs:text-sm ${themeClasses.textSecondary}`}>Height</div>
                        </div>
                        <div>
                          <div className={`text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${themeClasses.accent}`}>
                            {currentWeather.wavePeriod.toFixed(0)}s
                          </div>
                          <div className={`text-xs xs:text-sm ${themeClasses.textSecondary}`}>Period</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
        )}

        {/* Weather Map */}
        <div className="relative overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-sm"></div>
          <div className={`relative ${themeClasses.cardBg} shadow-2xl border ${themeClasses.border} overflow-hidden`}>
            <div className={`p-2 xs:p-3 sm:p-4 lg:p-6 border-b ${themeClasses.border}`}>
              <h3 className={`text-sm xs:text-base sm:text-lg lg:text-xl font-bold ${themeClasses.text} text-center`}>Live Weather Map</h3>
            </div>
            <div className="h-48 xs:h-56 sm:h-64 md:h-80 lg:h-96">
              <iframe
                src={getWindyUrl()}
                className="w-full h-full border-0"
                frameBorder="0"
                title="Weather Forecast Map"
              />
            </div>
          </div>
        </div>

        {/* Extended Weather Info */}
        <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-6">
          {[
            { 
              icon: Eye, 
              label: 'Visibility', 
              value: `${currentWeather?.visibility.toFixed(1) || 0}km`, 
              color: 'from-purple-500 to-pink-500',
              condition: currentWeather ? getVisibilityCondition(currentWeather.visibility) : null
            },
            { 
              icon: Droplets, 
              label: 'Precipitation', 
              value: `${currentWeather?.precipitation.toFixed(1) || 0}mm`, 
              color: 'from-blue-500 to-cyan-500',
              condition: null
            },
            { 
              icon: Sun, 
              label: 'UV Index', 
              value: `${uvIndex} - ${uvLevel.level}`, 
              color: 'from-yellow-500 to-orange-500',
              condition: getUVCondition(uvIndex)
            },
            { 
              icon: Cloud, 
              label: 'Cloud Cover', 
              value: `${currentWeather?.cloudCover.toFixed(0) || 0}%`, 
              color: 'from-gray-500 to-slate-500',
              condition: currentWeather ? getCloudCondition(currentWeather.cloudCover) : null
            }
          ].map((item, index) => (
            <div key={index} className="relative overflow-hidden rounded-md xs:rounded-lg sm:rounded-xl group">
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <div className={`relative ${themeClasses.cardBg} p-2 xs:p-3 sm:p-4 lg:p-6 text-center shadow-lg border ${themeClasses.border} backdrop-blur-sm`}>
                <div className="relative mb-2 xs:mb-2 sm:mb-3">
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-lg blur-lg opacity-30`}></div>
                  <div className={`relative p-1.5 xs:p-2 sm:p-2 bg-gradient-to-r ${item.color} rounded-md xs:rounded-lg`}>
                    <item.icon className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white mx-auto" />
                  </div>
                </div>
                <div className={`text-xs xs:text-sm font-bold ${themeClasses.text} mb-1 xs:mb-1`}>{item.value}</div>
                <div className={`text-xs xs:text-xs ${themeClasses.textSecondary}`}>{item.label}</div>
                
                {/* Condition Description */}
                {item.condition && (
                  <div className={`${themeClasses.cardBg} p-1.5 xs:p-2 sm:p-2 rounded-md xs:rounded-lg border ${themeClasses.border} text-left mt-1.5 xs:mt-2`}>
                    <h5 className={`font-bold ${themeClasses.accent} mb-1 xs:mb-1 text-xs xs:text-xs`}>
                      {item.condition.title}
                    </h5>
                    <p className={`text-xs xs:text-xs ${themeClasses.textSecondary} mb-1 xs:mb-1 leading-tight xs:leading-normal`}>
                      {item.condition.description}
                    </p>
                    <p className={`text-xs xs:text-xs ${themeClasses.text} font-medium`}>
                      💡 {item.condition.recommendation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 24-Hour Forecast - Enhanced */}
        <div className="relative overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm"></div>
          <div className={`relative ${themeClasses.cardBg} shadow-2xl border ${themeClasses.border}`}>
            <div className={`p-2 xs:p-3 sm:p-4 lg:p-6 border-b ${themeClasses.border}`}>
              <h3 className={`text-sm xs:text-base sm:text-lg lg:text-xl font-bold ${themeClasses.text} text-center flex items-center justify-center space-x-2 xs:space-x-2 sm:space-x-3`}>
                <Activity className={`w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${themeClasses.accent}`} />
                <span>24-Hour Forecast</span>
              </h3>
            </div>
            <div className="p-2 xs:p-3 sm:p-4 lg:p-6">
              {/* Mobile: Horizontal Scroll - Ultra Responsive */}
              <div className="sm:hidden overflow-hidden">
                <div className="overflow-x-auto pb-2 xs:pb-2">
                  <div className="flex gap-2 xs:gap-2" style={{ minWidth: 'max-content' }}>
                    {getHourlyForecast().map((hour, index) => (
                      <div key={index} className="relative overflow-hidden rounded-md xs:rounded-lg flex-shrink-0 min-w-[70px] xs:min-w-[80px] max-w-[70px] xs:max-w-[80px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm"></div>
                        <div className={`relative ${themeClasses.cardBg} p-2 xs:p-2.5 border ${themeClasses.border} shadow-lg`}>
                          <div className="text-center">
                            <p className={`text-xs xs:text-xs ${themeClasses.textSecondary} mb-1.5 xs:mb-2 font-semibold truncate`}>
                              {new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </p>
                            <div className="space-y-1.5 xs:space-y-2">
                              <div className="flex flex-col items-center space-y-1 xs:space-y-1">
                                <Thermometer className="w-3 h-3 xs:w-3 xs:h-3 text-orange-500" />
                                <span className={`text-xs xs:text-xs ${themeClasses.text} font-bold truncate`}>{hour.airTemperature.toFixed(0)}°C</span>
                              </div>
                              <div className="flex flex-col items-center space-y-1 xs:space-y-1">
                                <Wind className="w-3 h-3 xs:w-3 xs:h-3 text-cyan-500" />
                                <span className={`text-xs xs:text-xs ${themeClasses.textSecondary} font-medium truncate`}>{hour.windSpeed.toFixed(0)}m/s</span>
                              </div>
                              <div className="flex flex-col items-center space-y-1 xs:space-y-1">
                                <Waves className="w-3 h-3 xs:w-3 xs:h-3 text-blue-500" />
                                <span className={`text-xs xs:text-xs ${themeClasses.textSecondary} font-medium truncate`}>{hour.waveHeight.toFixed(1)}m</span>
                              </div>
                              <div className="flex flex-col items-center space-y-1 xs:space-y-1">
                                <Cloud className="w-3 h-3 xs:w-3 xs:h-3 text-gray-500" />
                                <span className={`text-xs xs:text-xs ${themeClasses.textSecondary} font-medium truncate`}>{hour.cloudCover.toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tablet: Grid 3 columns */}
              <div className="hidden sm:grid md:hidden grid-cols-3 gap-3">
                {getHourlyForecast().map((hour, index) => (
                  <div key={index} className="relative overflow-hidden rounded-xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all"></div>
                    <div className={`relative ${themeClasses.cardBg} p-3 border ${themeClasses.border} shadow-lg`}>
                      <div className="text-center">
                        <p className={`text-sm ${themeClasses.textSecondary} mb-2 font-medium`}>
                          {new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-1.5">
                            <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                            <span className={`text-sm ${themeClasses.text} font-medium`}>{hour.airTemperature.toFixed(0)}°C</span>
                          </div>
                          <div className="flex items-center justify-center space-x-1.5">
                            <Wind className="w-3.5 h-3.5 text-cyan-500" />
                            <span className={`text-sm ${themeClasses.textSecondary}`}>{hour.windSpeed.toFixed(0)} m/s</span>
                          </div>
                          <div className="flex items-center justify-center space-x-1.5">
                            <Waves className="w-3.5 h-3.5 text-blue-500" />
                            <span className={`text-sm ${themeClasses.textSecondary}`}>{hour.waveHeight.toFixed(1)}m</span>
                          </div>
                          <div className="flex items-center justify-center space-x-1.5">
                            <Cloud className="w-3.5 h-3.5 text-gray-500" />
                            <span className={`text-sm ${themeClasses.textSecondary}`}>{hour.cloudCover.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Grid 6 columns */}
              <div className="hidden md:grid lg:grid-cols-6 gap-4">
                {getHourlyForecast().map((hour, index) => (
                  <div key={index} className="relative overflow-hidden rounded-xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all"></div>
                    <div className={`relative ${themeClasses.cardBg} p-4 border ${themeClasses.border} shadow-lg`}>
                      <div className="text-center">
                        <p className={`text-sm ${themeClasses.textSecondary} mb-3 font-medium`}>
                          {new Date(hour.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center justify-center space-x-2">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span className={`text-sm ${themeClasses.text} font-medium`}>{hour.airTemperature.toFixed(0)}°C</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            <Wind className="w-4 h-4 text-cyan-500" />
                            <span className={`text-sm ${themeClasses.textSecondary}`}>{hour.windSpeed.toFixed(0)} m/s</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            <Waves className="w-4 h-4 text-blue-500" />
                            <span className={`text-sm ${themeClasses.textSecondary}`}>{hour.waveHeight.toFixed(1)}m</span>
                          </div>
                          <div className="flex items-center justify-center space-x-2">
                            <Cloud className="w-4 h-4 text-gray-500" />
                            <span className={`text-sm ${themeClasses.textSecondary}`}>{hour.cloudCover.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Update Info - Enhanced to match Tides style */}
        <div className="relative overflow-hidden rounded-lg xs:rounded-xl sm:rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-slate-500/5 backdrop-blur-sm"></div>
          <div className={`relative ${themeClasses.cardBg} shadow-2xl border ${themeClasses.border}`}>
            <div className={`p-2 xs:p-3 sm:p-4 lg:p-6 border-b ${themeClasses.border}`}>
              <h3 className={`text-sm xs:text-base sm:text-lg lg:text-xl font-bold ${themeClasses.text} text-center flex items-center justify-center space-x-2 xs:space-x-2 sm:space-x-3`}>
                <MapPin className={`w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${themeClasses.accent}`} />
                <span>Location Info</span>
              </h3>
            </div>
            <div className="p-2 xs:p-3 sm:p-4 lg:p-6">
              <div className="grid grid-cols-1 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
                {/* Location Name */}
                <div className="text-center">
                  <div className={`${themeClasses.accent} font-semibold mb-1 xs:mb-1 sm:mb-2 text-xs xs:text-sm sm:text-sm lg:text-base`}>Surf Spot</div>
                  <div className={`${themeClasses.text} text-xs xs:text-sm sm:text-sm lg:text-base font-medium`}>{selectedSpot.name}</div>
                </div>
                
                {/* Coordinates */}
                <div className="text-center">
                  <div className={`${themeClasses.accent} font-semibold mb-1 xs:mb-1 sm:mb-2 text-xs xs:text-sm sm:text-sm lg:text-base`}>Coordinates</div>
                  <div className={`${themeClasses.textSecondary} text-xs xs:text-sm sm:text-sm lg:text-base font-mono`}>
                    {selectedSpot.coordinates[0].toFixed(4)}, {selectedSpot.coordinates[1].toFixed(4)}
                  </div>
                </div>
                
                {/* Last Updated */}
                <div className="text-center">
                  <div className={`${themeClasses.accent} font-semibold mb-1 xs:mb-1 sm:mb-2 text-xs xs:text-sm sm:text-sm lg:text-base`}>Last Updated</div>
                  <div className={`${themeClasses.textSecondary} text-xs xs:text-sm sm:text-sm lg:text-base`}>
                    {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'}
                  </div>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="mt-2 xs:mt-3 sm:mt-6 pt-2 xs:pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <p className={`${themeClasses.textSecondary} text-xs xs:text-sm sm:text-sm lg:text-base leading-normal xs:leading-relaxed sm:leading-relaxed`}>
                    Weather data is updated every 6 hours with the latest meteorological information from reliable sources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}