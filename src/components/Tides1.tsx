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
      {/* Hero Header */}
      <div className={`${themeClasses.cardBg} border-b ${themeClasses.border} p-4 lg:p-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className={`p-3 ${themeClasses.headerBg} rounded-xl shadow-sm`}>
                <Anchor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl lg:text-4xl font-bold ${themeClasses.accent}`}>
                  Marine Tide Station
                </h1>
                <p className={`text-sm lg:text-lg ${themeClasses.textSecondary}`}>
                  Advanced tidal analysis and predictions
                </p>
              </div>
            </div>

            {/* Spot Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <select
                value={selectedSpot.id}
                onChange={(e) => {
                  const spot = spots.find(s => s.id === e.target.value);
                  if (spot) setSelectedSpot(spot);
                }}
                className={`${themeClasses.cardBg} ${themeClasses.border} ${themeClasses.text} px-4 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                className={`${themeClasses.button} px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm w-full sm:w-auto transition-all duration-300 shadow-sm`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
        
        {/* Current Tide Status Hero */}
        {currentStatus && (
          <div className={`${themeClasses.cardBg} rounded-2xl shadow-sm overflow-hidden`}>
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Current Status */}
                <div className="text-center lg:text-left">
                  <h2 className={`text-lg lg:text-2xl font-bold ${themeClasses.text} mb-4`}>Current Tide Status</h2>
                  <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                    <div className={`p-4 ${themeClasses.headerBg} rounded-xl`}>
                      {getTideIcon(currentStatus.current.type)}
                    </div>
                    <div>
                      <div className={`text-2xl lg:text-4xl font-bold ${themeClasses.accent}`}>
                        {currentStatus.status === 'rising' ? 'Rising' : 'Falling'}
                      </div>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>
                        {currentStatus.progress.toFixed(0)}% to next tide
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className={`w-full bg-gray-200 rounded-full h-3 mb-4`}>
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        currentStatus.status === 'rising' ? 'bg-blue-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${currentStatus.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${themeClasses.text}`}>
                        {getTideHeight(currentStatus.current.height)}
                      </div>
                      <div className={`text-xs ${themeClasses.textSecondary}`}>Current Level</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${themeClasses.text}`}>
                        {getTideHeight(currentStatus.next.height)}
                      </div>
                      <div className={`text-xs ${themeClasses.textSecondary}`}>Next Level</div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Next Tide Info */}
                <div className="space-y-4">
                  {nextTide && (
                    <div className={`${themeClasses.cardBg} p-4 rounded-xl border ${themeClasses.border}`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <Navigation className={`w-5 h-5 ${themeClasses.accent}`} />
                        <h3 className={`font-bold ${themeClasses.text}`}>Next Tide</h3>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold mb-2 ${
                          nextTide.type === 'high' ? 'text-blue-600' : 'text-orange-600'
                        }`}>
                          {formatTime(nextTide.time)}
                        </div>
                        <div className={`text-lg font-bold ${themeClasses.text} mb-2`}>
                          {getTideHeight(nextTide.height)}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          nextTide.type === 'high'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {nextTide.type === 'high' ? 'High Tide' : 'Low Tide'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Surf Conditions */}
                  <div className={`${themeClasses.cardBg} p-4 rounded-xl border ${themeClasses.border}`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <Waves className={`w-5 h-5 ${themeClasses.accent}`} />
                      <h3 className={`font-bold ${themeClasses.text}`}>Surf Conditions</h3>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${themeClasses.accent} mb-2`}>
                        {selectedSpot.tideConditions}
                      </div>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>
                        Best for {selectedSpot.skillLevel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Today's Tides Timeline */}
        <div className={`${themeClasses.cardBg} rounded-2xl shadow-sm overflow-hidden`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-bold ${themeClasses.text} text-center flex items-center justify-center space-x-2`}>
              <Clock className={`w-5 h-5 ${themeClasses.accent}`} />
              <span>Today's Tide Timeline</span>
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {todayTides.map((tide, index) => (
                <div
                  key={index}
                  className={`${themeClasses.cardBg} p-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm border-2 ${
                    tide.type === 'high'
                      ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50'
                      : 'border-orange-200 bg-gradient-to-br from-orange-50 to-red-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      {getTideIcon(tide.type)}
                      {getPhaseIcon(tide.time)}
                    </div>
                    
                    <h3 className={`text-lg font-bold mb-2 ${
                      tide.type === 'high' ? 'text-blue-600' : 'text-orange-600'
                    }`}>
                      {formatTime(tide.time)}
                    </h3>
                    
                    <p className={`text-xl font-bold ${themeClasses.text} mb-2`}>
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

        {/* Tide Chart Visualization */}
        <div className={`${themeClasses.cardBg} rounded-2xl shadow-sm overflow-hidden`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-bold ${themeClasses.text} text-center flex items-center justify-center space-x-2`}>
              <BarChart3 className={`w-5 h-5 ${themeClasses.accent}`} />
              <span>24-Hour Tide Chart</span>
            </h3>
          </div>
          
          <div className="p-6">
            <div className={`relative h-48 lg:h-64 ${themeClasses.cardBg} rounded-xl p-4 border ${themeClasses.border} shadow-inner`}>
              <div className="absolute inset-4">
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
                <div className="ml-8 h-full relative">
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
                          <div className={`w-4 h-4 rounded-full mb-2 shadow-lg ${
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
        <div className={`${themeClasses.cardBg} rounded-2xl shadow-sm overflow-hidden`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-bold ${themeClasses.text} text-center`}>7-Day Tide Overview</h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <div className="flex space-x-3 pb-2" style={{ minWidth: 'max-content' }}>
                {Object.entries(weeklyTides).map(([date, tides], dayIndex) => (
                  <div key={dayIndex} className={`flex-shrink-0 ${themeClasses.cardBg} rounded-xl p-3 border ${themeClasses.border} min-w-[140px] shadow-sm`}>
                    <h4 className={`text-center font-bold ${themeClasses.text} mb-3 text-sm`}>{formatDateShort(date)}</h4>
                    <div className="space-y-2">
                      {tides.map((tide, tideIndex) => (
                        <div key={tideIndex} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
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
        <div className={`${themeClasses.cardBg} rounded-2xl shadow-sm overflow-hidden`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className={`text-lg font-bold ${themeClasses.text} text-center`}>
              {selectedSpot.name} - Marine Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className={`${themeClasses.accent} font-semibold mb-1 text-sm`}>Wave Type</div>
                <div className={`${themeClasses.textSecondary} text-sm`}>{selectedSpot.waveType}</div>
              </div>
              <div className="text-center">
                <div className={`${themeClasses.accent} font-semibold mb-1 text-sm`}>Skill Level</div>
                <div className={`${themeClasses.textSecondary} text-sm`}>{selectedSpot.skillLevel}</div>
              </div>
              <div className="text-center">
                <div className={`${themeClasses.accent} font-semibold mb-1 text-sm`}>Best Season</div>
                <div className={`${themeClasses.textSecondary} text-sm`}>{selectedSpot.bestSeason}</div>
              </div>
              <div className="text-center">
                <div className={`${themeClasses.accent} font-semibold mb-1 text-sm`}>Tide Conditions</div>
                <div className={`${themeClasses.textSecondary} text-sm`}>{selectedSpot.tideConditions}</div>
              </div>
            </div>
            <div className="text-center">
              <p className={`${themeClasses.textSecondary} text-sm leading-relaxed`}>
                {selectedSpot.description}
              </p>
            </div>
          </div>
        </div>

        {/* Location & Update Info */}
        <div className={`${themeClasses.cardBg} p-4 rounded-xl text-center shadow-sm`}>
          <div className={`flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 ${themeClasses.textSecondary}`}>
            <div className="flex items-center space-x-2">
              <MapPin className={`w-4 h-4 ${themeClasses.accent}`} />
              <span className={`font-medium text-sm ${themeClasses.text}`}>{selectedSpot.name}</span>
            </div>
            <div className="text-sm">
              {selectedSpot.coordinates[0].toFixed(4)}, {selectedSpot.coordinates[1].toFixed(4)}
            </div>
            {lastUpdated && (
              <div className="text-sm">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}