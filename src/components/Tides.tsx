import React, { useState, useEffect } from 'react';
import { Waves, Clock, Calendar, TrendingUp, TrendingDown, MapPin, RefreshCw, Sun, Moon, Activity, BarChart3 } from 'lucide-react';
import { fetchTideData, TideData, getFallbackTideData } from '../services/weatherApi';
import { SurfSpot } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface TidesProps {
  spots: SurfSpot[];
}

export default function Tides({ spots }: TidesProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedSpot, setSelectedSpot] = useState(spots[0]);
  const [tideData, setTideData] = useState<TideData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (spots.length > 0 && !selectedSpot) {
      setSelectedSpot(spots[0]);
    }
  }, [spots, selectedSpot]);

  useEffect(() => {
    if (selectedSpot) {
      loadTideData();
    }
  }, [selectedSpot]);

  const loadTideData = async () => {
    if (!selectedSpot) return;
    
    setLoading(true);
    try {
      const data = await fetchTideData(selectedSpot.coordinates[0], selectedSpot.coordinates[1]);
      if (data.length > 0) {
        setTideData(data);
      } else {
        setTideData(getFallbackTideData());
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading tide data:', error);
      setTideData(getFallbackTideData());
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const getTodayTides = () => {
    const today = new Date();
    const todayStr = today.toDateString();
    return tideData.filter(tide => new Date(tide.time).toDateString() === todayStr);
  };

  const getUpcomingTides = () => {
    const now = new Date();
    return tideData.filter(tide => new Date(tide.time) > now).slice(0, 8);
  };

  const getWeeklyTides = () => {
    const grouped: { [key: string]: TideData[] } = {};
    tideData.slice(0, 28).forEach(tide => {
      const date = new Date(tide.time).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(tide);
    });
    return grouped;
  };

  const getTideIcon = (type: string) => {
    switch (type) {
      case 'high':
        return <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-500" />;
      case 'low':
        return <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-500" />;
      default:
        return <Waves className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-500" />;
    }
  };

  const getPhaseIcon = (time: string) => {
    const hour = new Date(time).getHours();
    if (hour >= 6 && hour < 18) {
      return <Sun className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-yellow-500" />;
    } else {
      return <Moon className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 text-blue-400" />;
    }
  };

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (timeStr: string) => {
    return new Date(timeStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateShort = (timeStr: string) => {
    return new Date(timeStr).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric'
    });
  };

  const getTideHeight = (height: number) => {
    return `${height.toFixed(1)}m`;
  };

  const todayTides = getTodayTides();
  const upcomingTides = getUpcomingTides();
  const weeklyTides = getWeeklyTides();

  if (!selectedSpot) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg} pt-16`}>
        <div className="text-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${themeClasses.textSecondary} text-xs sm:text-sm`}>Loading tide data...</p>
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
              <Waves className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-sm sm:text-base md:text-lg lg:text-3xl font-bold ${themeClasses.accent}`}>
                Tide Information
              </h1>
              <p className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>
                Real-time tide data for West Sumbawa
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
              onClick={loadTideData}
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
        
        {/* Today's Tides - Mobile Optimized */}
        <div className={`${themeClasses.cardBg} p-2 sm:p-3 md:p-4 lg:p-6 rounded-md sm:rounded-lg md:rounded-xl shadow-sm`}>
          <h3 className={`text-xs sm:text-sm md:text-base lg:text-xl font-bold ${themeClasses.text} mb-2 sm:mb-3 text-center flex items-center justify-center`}>
            <Activity className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${themeClasses.accent} mr-1 sm:mr-2`} />
            Today's Tides
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 md:gap-3">
            {todayTides.map((tide, index) => (
              <div
                key={index}
                className={`${themeClasses.cardBg} p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg transition-all duration-300 hover:scale-105 shadow-sm border ${
                  tide.type === 'high'
                    ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50'
                    : 'border-orange-200 bg-gradient-to-br from-orange-50 to-red-50'
                }`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 mb-1 sm:mb-2">
                    {getTideIcon(tide.type)}
                    {getPhaseIcon(tide.time)}
                  </div>
                  
                  <h3 className={`text-xs font-bold mb-0.5 sm:mb-1 ${
                    tide.type === 'high' ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {formatTime(tide.time)}
                  </h3>
                  
                  <p className={`text-xs sm:text-sm font-bold ${themeClasses.text} mb-1`}>
                    {getTideHeight(tide.height)}
                  </p>
                  
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                    tide.type === 'high'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {tide.type === 'high' ? 'High' : 'Low'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 24-Hour Tide Chart - Mobile Optimized */}
        <div className={`${themeClasses.cardBg} p-2 sm:p-3 md:p-4 lg:p-6 rounded-md sm:rounded-lg md:rounded-xl shadow-sm`}>
          <h3 className={`text-xs sm:text-sm md:text-base lg:text-xl font-bold ${themeClasses.text} mb-2 sm:mb-3 text-center flex items-center justify-center`}>
            <BarChart3 className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${themeClasses.accent} mr-1 sm:mr-2`} />
            24-Hour Tide Chart
          </h3>
          
          <div className={`relative h-24 sm:h-32 md:h-40 lg:h-48 ${themeClasses.cardBg} rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-3 border ${themeClasses.border} shadow-inner`}>
            <div className="absolute inset-1.5 sm:inset-2 md:inset-3">
              {/* Y-axis labels */}
              <div className={`absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs ${themeClasses.textSecondary}`}>
                <span>2.0m</span>
                <span>1.5m</span>
                <span>1.0m</span>
                <span>0.5m</span>
                <span>0.0m</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-4 sm:ml-6 md:ml-8 h-full relative">
                {/* Grid lines */}
                <div className="absolute inset-0">
                  {[0, 25, 50, 75, 100].map((percent) => (
                    <div
                      key={percent}
                      className={`absolute w-full border-t ${themeClasses.border}`}
                      style={{ top: `${percent}%` }}
                    />
                  ))}
                </div>
                
                {/* Tide points */}
                <div className="absolute inset-0 flex items-end justify-between">
                  {todayTides.slice(0, 4).map((tide, index) => {
                    const heightPercent = (tide.height / 2.0) * 100;
                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center"
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 rounded-full mb-0.5 sm:mb-1 shadow-sm ${
                          tide.type === 'high' ? 'bg-blue-500' : 'bg-orange-500'
                        }`} />
                        <div className={`text-xs ${themeClasses.textSecondary} text-center`}>
                          <div className="font-medium">{formatTime(tide.time)}</div>
                          <div>{tide.height.toFixed(1)}m</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Overview - Mobile Optimized */}
        <div className={`${themeClasses.cardBg} p-2 sm:p-3 md:p-4 lg:p-6 rounded-md sm:rounded-lg md:rounded-xl shadow-sm`}>
          <h3 className={`text-xs sm:text-sm md:text-base lg:text-xl font-bold ${themeClasses.text} mb-2 sm:mb-3 text-center`}>7-Day Overview</h3>
          <div className="overflow-x-auto">
            <div className="flex space-x-1 sm:space-x-2 pb-2" style={{ minWidth: 'max-content' }}>
              {Object.entries(weeklyTides).map(([date, tides], dayIndex) => (
                <div key={dayIndex} className={`flex-shrink-0 ${themeClasses.cardBg} rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-3 border ${themeClasses.border} min-w-[70px] sm:min-w-[90px] md:min-w-[110px] shadow-sm`}>
                  <h4 className={`text-center font-bold ${themeClasses.text} mb-1 sm:mb-2 text-xs`}>{formatDateShort(date)}</h4>
                  <div className="space-y-0.5 sm:space-y-1">
                    {tides.map((tide, tideIndex) => (
                      <div key={tideIndex} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-0.5 sm:space-x-1">
                          {getTideIcon(tide.type)}
                          <span className={`${themeClasses.textSecondary}`}>{formatTime(tide.time)}</span>
                        </div>
                        <span className={`font-semibold ${
                          tide.type === 'high' ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          {tide.height.toFixed(1)}m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tides - Mobile Optimized */}
        <div className={`${themeClasses.cardBg} p-2 sm:p-3 md:p-4 lg:p-6 rounded-md sm:rounded-lg md:rounded-xl shadow-sm`}>
          <h3 className={`text-xs sm:text-sm md:text-base lg:text-xl font-bold ${themeClasses.text} mb-2 sm:mb-3 text-center`}>Upcoming Tides</h3>
          
          <div className="space-y-1 sm:space-y-2">
            {upcomingTides.map((tide, index) => (
              <div key={index} className={`${themeClasses.cardBg} rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-3 border ${themeClasses.border} shadow-sm`}>
                <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {getTideIcon(tide.type)}
                    <span className={`font-medium text-xs ${
                      tide.type === 'high' ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {tide.type === 'high' ? 'High' : 'Low'} Tide
                    </span>
                  </div>
                  <span className={`text-xs sm:text-sm font-bold ${themeClasses.text}`}>{tide.height.toFixed(1)}m</span>
                </div>
                <div className={`flex items-center justify-between text-xs ${themeClasses.textSecondary}`}>
                  <span>{formatDate(tide.time)}</span>
                  <span>{formatTime(tide.time)}</span>
                  {getPhaseIcon(tide.time)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Surf Spot Information - Mobile Optimized */}
        <div className={`${themeClasses.cardBg} p-2 sm:p-3 md:p-4 lg:p-6 rounded-md sm:rounded-lg md:rounded-xl shadow-sm border ${themeClasses.border}`}>
          <h3 className={`text-xs sm:text-sm md:text-base lg:text-xl font-bold ${themeClasses.text} mb-2 sm:mb-3 text-center`}>
            {selectedSpot.name} - Surf Information
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 md:gap-3 mb-2 sm:mb-3">
            <div className="text-center">
              <div className={`${themeClasses.accent} font-semibold mb-0.5 sm:mb-1 text-xs`}>Wave Type</div>
              <div className={`${themeClasses.textSecondary} text-xs`}>{selectedSpot.waveType}</div>
            </div>
            <div className="text-center">
              <div className={`${themeClasses.accent} font-semibold mb-0.5 sm:mb-1 text-xs`}>Skill Level</div>
              <div className={`${themeClasses.textSecondary} text-xs`}>{selectedSpot.skillLevel}</div>
            </div>
            <div className="text-center">
              <div className={`${themeClasses.accent} font-semibold mb-0.5 sm:mb-1 text-xs`}>Best Season</div>
              <div className={`${themeClasses.textSecondary} text-xs`}>{selectedSpot.bestSeason}</div>
            </div>
            <div className="text-center">
              <div className={`${themeClasses.accent} font-semibold mb-0.5 sm:mb-1 text-xs`}>Tide Conditions</div>
              <div className={`${themeClasses.textSecondary} text-xs`}>{selectedSpot.tideConditions}</div>
            </div>
          </div>
          <div className="text-center">
            <p className={`${themeClasses.textSecondary} text-xs leading-relaxed`}>
              {selectedSpot.description}
            </p>
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