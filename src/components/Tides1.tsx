import React, { useState, useEffect } from 'react';
import { Waves, Clock, TrendingUp, TrendingDown, MapPin, RefreshCw, Sun, Moon, Activity, BarChart3, Navigation, Anchor } from 'lucide-react';
import { fetchTideData, TideData, getFallbackTideData } from '../services/weatherApi';
import { SurfSpot } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface Tides1Props {
  spots: SurfSpot[];
}

export default function Tides1({ spots }: Tides1Props) {
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

  const getNextTide = () => {
    const now = new Date();
    return tideData.find(tide => new Date(tide.time) > now);
  };

  const getCurrentTideStatus = () => {
    const now = new Date();
    const todayTides = getTodayTides();
    const currentTime = now.getTime();
    
    for (let i = 0; i < todayTides.length - 1; i++) {
      const currentTide = new Date(todayTides[i].time).getTime();
      const nextTide = new Date(todayTides[i + 1].time).getTime();
      
      if (currentTime >= currentTide && currentTime <= nextTide) {
        const progress = (currentTime - currentTide) / (nextTide - currentTide);
        return {
          current: todayTides[i],
          next: todayTides[i + 1],
          progress: progress * 100,
          status: progress < 0.5 ? 'rising' : 'falling'
        };
      }
    }
    return null;
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
        return <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />;
      case 'low':
        return <TrendingDown className="w-4 h-4 lg:w-5 lg:h-5 text-orange-500" />;
      default:
        return <Waves className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />;
    }
  };

  const getPhaseIcon = (time: string) => {
    const hour = new Date(time).getHours();
    if (hour >= 6 && hour < 18) {
      return <Sun className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500" />;
    } else {
      return <Moon className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400" />;
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
  const nextTide = getNextTide();
  const currentStatus = getCurrentTideStatus();
  const weeklyTides = getWeeklyTides();

  if (!selectedSpot) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg} pt-16`}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`${themeClasses.textSecondary} text-sm`}>Loading tide data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} pt-16 overflow-x-hidden`}>
      {/* Advanced Glass Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-teal-500/20 backdrop-blur-xl"></div>
        <div className={`relative ${themeClasses.cardBg} border-b ${themeClasses.border} p-3 sm:p-4 md:p-6 lg:p-8`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <div className="flex flex-col items-center space-y-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-30"></div>
                  <div className={`relative p-3 sm:p-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl shadow-2xl`}>
                    <Anchor className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-600 via-blue-500 to-teal-600 bg-clip-text text-transparent mb-2`}>
                    Marine Tide Station
                  </h1>
                  <p className={`text-sm sm:text-base lg:text-lg ${themeClasses.textSecondary}`}>
                    Advanced tidal analysis and predictions
                  </p>
                </div>
              </div>

              {/* Enhanced Spot Selector */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                <select
                  value={selectedSpot.id}
                  onChange={(e) => {
                    const spot = spots.find(s => s.id === e.target.value);
                    if (spot) setSelectedSpot(spot);
                  }}
                  className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} px-4 py-3 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 backdrop-blur-sm shadow-lg`}
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
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 text-sm font-medium transition-all duration-300 shadow-lg backdrop-blur-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        
        {/* Current Tide Status Hero */}
        {currentStatus && (
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-teal-500/10 backdrop-blur-xl"></div>
            <div className={`relative ${themeClasses.cardBg} p-4 sm:p-6 lg:p-8 shadow-2xl border ${themeClasses.border}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Left Side - Current Status */}
                <div className="text-center lg:text-left">
                  <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${themeClasses.text} mb-4 flex items-center justify-center lg:justify-start`}>
                    <Navigation className={`w-6 h-6 lg:w-8 lg:h-8 ${themeClasses.accent} mr-3`} />
                    Current Tide Status
                  </h2>
                  <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                    <div className="relative">
                      <div className={`absolute inset-0 ${
                        currentStatus.status === 'rising' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                      } rounded-xl blur-lg opacity-30`}></div>
                      <div className={`relative p-3 ${
                        currentStatus.status === 'rising' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                      } rounded-xl`}>
                        {getTideIcon(currentStatus.current.type)}
                      </div>
                    </div>
                    <div>
                      <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${
                        currentStatus.status === 'rising' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                      } bg-clip-text text-transparent`}>
                        {currentStatus.status === 'rising' ? 'Rising' : 'Falling'}
                      </div>
                      <div className={`text-sm lg:text-base ${themeClasses.textSecondary}`}>
                        {currentStatus.progress.toFixed(0)}% to next tide
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className={`w-full bg-gray-200 rounded-full h-3 lg:h-4 mb-6`}>
                    <div 
                      className={`h-3 lg:h-4 rounded-full transition-all duration-300 ${
                        currentStatus.status === 'rising' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                      }`}
                      style={{ width: `${currentStatus.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`${themeClasses.cardBg} p-4 rounded-xl text-center shadow-lg border ${themeClasses.border}`}>
                      <div className={`text-lg sm:text-xl font-bold ${themeClasses.accent}`}>
                        {getTideHeight(currentStatus.current.height)}
                      </div>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>Current Level</div>
                    </div>
                    <div className={`${themeClasses.cardBg} p-4 rounded-xl text-center shadow-lg border ${themeClasses.border}`}>
                      <div className={`text-lg sm:text-xl font-bold ${themeClasses.accent}`}>
                        {getTideHeight(currentStatus.next.height)}
                      </div>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>Next Level</div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Next Tide Info */}
                <div className="space-y-4">
                  {nextTide && (
                    <div className="relative overflow-hidden rounded-xl">
                      <div className={`absolute inset-0 ${
                        nextTide.type === 'high' ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10' : 'bg-gradient-to-br from-orange-500/10 to-red-500/10'
                      } backdrop-blur-sm`}></div>
                      <div className={`relative ${themeClasses.cardBg} p-4 lg:p-6 border ${themeClasses.border} shadow-lg`}>
                        <div className="flex items-center space-x-3 mb-4">
                          <Navigation className={`w-5 h-5 lg:w-6 lg:h-6 ${themeClasses.accent}`} />
                          <h3 className={`text-lg lg:text-xl font-bold ${themeClasses.text}`}>Next Tide</h3>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl lg:text-2xl font-bold mb-3 ${
                            nextTide.type === 'high' ? 'text-blue-600' : 'text-orange-600'
                          }`}>
                            {formatTime(nextTide.time)}
                          </div>
                          <div className={`text-lg lg:text-xl font-bold ${themeClasses.text} mb-3`}>
                            {getTideHeight(nextTide.height)}
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            nextTide.type === 'high'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {nextTide.type === 'high' ? 'High Tide' : 'Low Tide'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Surf Conditions */}
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 backdrop-blur-sm"></div>
                    <div className={`relative ${themeClasses.cardBg} p-4 lg:p-6 border ${themeClasses.border} shadow-lg`}>
                      <div className="flex items-center space-x-3 mb-4">
                        <Waves className={`w-5 h-5 lg:w-6 lg:h-6 ${themeClasses.accent}`} />
                        <h3 className={`text-lg lg:text-xl font-bold ${themeClasses.text}`}>Surf Conditions</h3>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg lg:text-xl font-bold ${themeClasses.accent} mb-3`}>
                          {selectedSpot.tideConditions}
                        </div>
                        <div className={`text-sm lg:text-base ${themeClasses.textSecondary}`}>
                          Best for {selectedSpot.skillLevel}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Today's Tides Timeline */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-sm"></div>
          <div className={`relative ${themeClasses.cardBg} shadow-2xl border ${themeClasses.border}`}>
            <div className={`p-4 lg:p-6 border-b ${themeClasses.border}`}>
              <h3 className={`text-lg lg:text-xl font-bold ${themeClasses.text} text-center flex items-center justify-center space-x-3`}>
                <Clock className={`w-5 h-5 lg:w-6 lg:h-6 ${themeClasses.accent}`} />
                <span>Today's Tide Timeline</span>
              </h3>
            </div>
            
            <div className="p-4 lg:p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {todayTides.map((tide, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-xl group"
                  >
                    <div className={`absolute inset-0 ${
                      tide.type === 'high'
                        ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
                        : 'bg-gradient-to-br from-orange-500/10 to-red-500/10'
                    } backdrop-blur-sm group-hover:opacity-20 transition-opacity`}></div>
                    <div className={`relative ${themeClasses.cardBg} p-4 lg:p-6 text-center shadow-lg border ${
                      tide.type === 'high' ? 'border-blue-200' : 'border-orange-200'
                    }`}>
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        {getTideIcon(tide.type)}
                        {getPhaseIcon(tide.time)}
                      </div>
                      
                      <h3 className={`text-lg lg:text-xl font-bold mb-2 ${
                        tide.type === 'high' ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {formatTime(tide.time)}
                      </h3>
                      
                      <p className={`text-xl lg:text-2xl font-bold ${themeClasses.text} mb-3`}>
                        {getTideHeight(tide.height)}
                      </p>
                      
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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
          </div>
        </div>

        {/* Tide Chart Visualization */}
        <div className={`${themeClasses.cardBg} rounded-md sm:rounded-lg md:rounded-xl shadow-sm overflow-hidden`}>
          <div className={`p-1.5 sm:p-2 md:p-3 border-b ${themeClasses.border}`}>
            <h3 className={`text-xs sm:text-sm md:text-base font-bold ${themeClasses.text} text-center flex items-center justify-center space-x-1`}>
              <BarChart3 className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.accent}`} />
              <span>24-Hour Tide Chart</span>
            </h3>
          </div>
          
          <div className="p-1.5 sm:p-2 md:p-3">
            <div className={`relative h-20 sm:h-24 md:h-32 lg:h-40 ${themeClasses.cardBg} rounded-md p-1.5 sm:p-2 border ${themeClasses.border} shadow-inner`}>
              <div className="absolute inset-1.5 sm:inset-2">
                {/* Y-axis labels */}
                <div className={`absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs ${themeClasses.textSecondary}`}>
                  <span>2.5m</span>
                  <span>2.0m</span>
                  <span>1.5m</span>
                  <span>1.0m</span>
                  <span>0.5m</span>
                  <span>0.0m</span>
                </div>
                
                {/* Chart area */}
                <div className="ml-3 sm:ml-4 md:ml-6 h-full relative">
                  {/* Grid lines */}
                  <div className="absolute inset-0">
                    {[0, 20, 40, 60, 80, 100].map((percent) => (
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
                      const heightPercent = (tide.height / 2.5) * 100;
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center"
                          style={{ height: `${heightPercent}%` }}
                        >
                          <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full mb-0.5 sm:mb-1 shadow-sm ${
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
        </div>

        {/* Weekly Tide Overview */}
        <div className={`${themeClasses.cardBg} rounded-md sm:rounded-lg md:rounded-xl shadow-sm overflow-hidden`}>
          <div className={`p-1.5 sm:p-2 md:p-3 border-b ${themeClasses.border}`}>
            <h3 className={`text-xs sm:text-sm md:text-base font-bold ${themeClasses.text} text-center`}>7-Day Tide Overview</h3>
          </div>
          <div className="p-1.5 sm:p-2 md:p-3">
            <div className="overflow-x-auto">
              <div className="flex space-x-1 pb-2" style={{ minWidth: 'max-content' }}>
                {Object.entries(weeklyTides).map(([date, tides], dayIndex) => (
                  <div key={dayIndex} className={`flex-shrink-0 ${themeClasses.cardBg} rounded-md p-1.5 sm:p-2 border ${themeClasses.border} min-w-[70px] sm:min-w-[90px] md:min-w-[110px] shadow-sm`}>
                    <h4 className={`text-center font-bold ${themeClasses.text} mb-1 text-xs`}>{formatDateShort(date)}</h4>
                    <div className="space-y-0.5 sm:space-y-1">
                      {tides.map((tide, tideIndex) => (
                        <div key={tideIndex} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-0.5">
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
        </div>

        {/* Surf Spot Information */}
        <div className={`${themeClasses.cardBg} rounded-md sm:rounded-lg md:rounded-xl shadow-sm overflow-hidden`}>
          <div className={`p-1.5 sm:p-2 md:p-3 border-b ${themeClasses.border}`}>
            <h3 className={`text-xs sm:text-sm md:text-base font-bold ${themeClasses.text} text-center`}>
              {selectedSpot.name} - Marine Information
            </h3>
          </div>
          <div className="p-1.5 sm:p-2 md:p-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 mb-2 sm:mb-3">
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
        </div>

        {/* Location & Update Info */}
        <div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-slate-500/5 backdrop-blur-sm"></div>
          <div className={`relative ${themeClasses.cardBg} p-4 lg:p-6 text-center shadow-lg border ${themeClasses.border}`}>
            <div className={`flex flex-col space-y-2 ${themeClasses.textSecondary}`}>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className={`w-4 h-4 lg:w-5 lg:h-5 ${themeClasses.accent}`} />
                <span className={`font-medium text-sm lg:text-base ${themeClasses.text}`}>{selectedSpot.name}</span>
              </div>
              <div className="text-xs lg:text-sm">
                {selectedSpot.coordinates[0].toFixed(4)}, {selectedSpot.coordinates[1].toFixed(4)}
              </div>
              {lastUpdated && (
                <div className="text-xs lg:text-sm">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}