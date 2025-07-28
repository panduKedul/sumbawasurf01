import React, { useState, useEffect } from 'react';
import { Waves, Clock, Calendar, TrendingUp, TrendingDown, MapPin, RefreshCw, Sun, Moon, Activity, BarChart3 } from 'lucide-react';
import { fetchTideData, TideData, getFallbackTideData } from '../services/weatherApi';
import { SurfSpot } from '../types';

interface TidesProps {
  spots: SurfSpot[];
}

export default function Tides({ spots }: TidesProps) {
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
    tideData.slice(0, 28).forEach(tide => { // 4 tides per day for 7 days
      const date = new Date(tide.time).toDateString();
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(tide);
    });
    return grouped;
  };

  const getTideIcon = (type: string) => {
    switch (type) {
      case 'high':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'low':
        return <TrendingDown className="w-5 h-5 text-orange-400" />;
      default:
        return <Waves className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPhaseIcon = (time: string) => {
    const hour = new Date(time).getHours();
    if (hour >= 6 && hour < 18) {
      return <Sun className="w-4 h-4 text-yellow-400" />;
    } else {
      return <Moon className="w-4 h-4 text-blue-300" />;
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

  const todayTides = getTodayTides();
  const upcomingTides = getUpcomingTides();
  const weeklyTides = getWeeklyTides();

  if (!selectedSpot) {
    return (
      <div className="h-full flex items-center justify-center bg-dark-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tide data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-dark-100 overflow-hidden">
      {/* Header with Spot Image - Responsive */}
      <div className="relative h-28 sm:h-32 md:h-40 lg:h-48 flex-shrink-0">
        <img
          src={selectedSpot.imageUrl}
          alt={selectedSpot.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Header Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2 sm:p-3 md:p-4">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <div className="p-1 sm:p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg backdrop-blur-sm">
              <Waves className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                Tide Information
              </h1>
              <p className="text-xs sm:text-sm text-gray-200 mt-1 drop-shadow">
                {selectedSpot.name}
              </p>
            </div>
          </div>

          {/* Spot Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-2 max-w-xs sm:max-w-sm md:max-w-md mx-auto w-full">
            <select
              value={selectedSpot.id}
              onChange={(e) => {
                const spot = spots.find(s => s.id === e.target.value);
                if (spot) setSelectedSpot(spot);
              }}
              className="input-elegant px-2 py-1 sm:px-3 sm:py-2 rounded-lg w-full backdrop-blur-sm text-xs sm:text-sm flex-1"
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
              className="btn-elegant px-2 py-1 sm:px-3 sm:py-2 rounded-lg flex items-center justify-center space-x-1 sm:space-x-2 backdrop-blur-sm text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Location Info */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 text-gray-200 mt-2 sm:mt-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{selectedSpot.coordinates[0].toFixed(4)}, {selectedSpot.coordinates[1].toFixed(4)}</span>
            </div>
            <div className="flex items-center space-x-2 hidden sm:flex">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          
          {lastUpdated && (
            <p className="text-xs text-gray-300 mt-1 drop-shadow hidden md:block">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-dark-200 min-h-0">
        <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Today's Tides */}
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4 text-center flex items-center justify-center">
                <Activity className="w-4 h-4 sm:w-5 h-5 text-neon-blue mr-2" />
                Today's Tides
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {todayTides.map((tide, index) => (
                  <div
                    key={index}
                    className={`card-elegant p-3 sm:p-4 md:p-6 transition-all duration-300 hover:scale-105 ${
                      tide.type === 'high'
                        ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30'
                        : 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30'
                    }`}
                  >
                    <div className="text-center min-h-0">
                      <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                        {getTideIcon(tide.type)}
                        {getPhaseIcon(tide.time)}
                      </div>
                      
                      <h3 className={`text-sm sm:text-base md:text-lg font-bold mb-1 ${
                        tide.type === 'high' ? 'text-blue-400' : 'text-orange-400'
                      }`}>
                        <div className="truncate">{formatTime(tide.time)}</div>
                      </h3>
                      
                      <p className="text-sm sm:text-base md:text-lg font-bold text-white mb-1">
                        <div className="truncate">{getTideHeight(tide.height)}</div>
                      </p>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tide.type === 'high'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      }`}>
                        <div className="truncate">{tide.type === 'high' ? 'High' : 'Low'}</div>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tide Chart Visualization */}
            <div className="card-elegant p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 text-center flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-neon-blue mr-2" />
                24-Hour Tide Chart
              </h3>
              
              <div className="relative h-32 sm:h-40 md:h-48 bg-dark-300 rounded-xl p-2 sm:p-4 border border-dark-400">
                <div className="absolute inset-2 sm:inset-4">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
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
                          className="absolute w-full border-t border-dark-400"
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
                            <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full mb-2 shadow-lg ${
                              tide.type === 'high' ? 'bg-blue-400' : 'bg-orange-400'
                            }`} />
                            <div className="text-xs text-gray-400 text-center hidden md:block">
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

            {/* Weekly Tide Overview */}
            <div className="card-elegant p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 text-center">7-Day Overview</h3>
              <div className="overflow-x-auto">
                <div className="flex space-x-2 pb-2" style={{ minWidth: 'max-content' }}>
                  {Object.entries(weeklyTides).map(([date, tides], dayIndex) => (
                    <div key={dayIndex} className="flex-shrink-0 bg-dark-300 rounded-lg p-2 sm:p-3 border border-dark-400 min-w-[110px] sm:min-w-[130px] md:min-w-[150px]">
                      <h4 className="text-center font-bold text-white mb-2 text-xs sm:text-sm">{formatDateShort(date)}</h4>
                      <div className="space-y-1">
                        {tides.map((tide, tideIndex) => (
                          <div key={tideIndex} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              {getTideIcon(tide.type)}
                              <span className="text-gray-300">{formatTime(tide.time)}</span>
                            </div>
                            <span className={`font-semibold ${
                              tide.type === 'high' ? 'text-blue-400' : 'text-orange-400'
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

            {/* Upcoming Tides Table */}
            <div className="card-elegant p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 text-center">Upcoming Tides</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[350px] sm:min-w-[400px]">
                  <thead>
                    <tr className="border-b border-dark-400">
                      <th className="text-left py-2 px-2 text-gray-300 font-semibold text-xs">Date & Time</th>
                      <th className="text-center py-2 px-2 text-gray-300 font-semibold text-xs">Type</th>
                      <th className="text-right py-2 px-2 text-gray-300 font-semibold text-xs">Height</th>
                      <th className="text-center py-2 px-2 text-gray-300 font-semibold text-xs hidden sm:table-cell">Phase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingTides.map((tide, index) => (
                      <tr key={index} className="border-b border-dark-400/50 hover:bg-dark-300/50 transition-colors">
                        <td className="py-2 px-2">
                          <div>
                            <div className="font-semibold text-white text-xs">{formatDate(tide.time)}</div>
                            <div className="text-xs text-gray-400">{formatTime(tide.time)}</div>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {getTideIcon(tide.type)}
                            <span className={`font-medium text-xs ${
                              tide.type === 'high' ? 'text-blue-400' : 'text-orange-400'
                            }`}>
                              {tide.type === 'high' ? 'High' : 'Low'}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-right">
                          <span className="text-xs sm:text-sm font-bold text-white">{tide.height.toFixed(1)}m</span>
                        </td>
                        <td className="py-2 px-2 text-center hidden sm:table-cell">
                          {getPhaseIcon(tide.time)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Surf Spot Information */}
            <div className="card-elegant p-3 sm:p-4 md:p-6 bg-gradient-to-br from-dark-300 to-dark-400">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3 text-center">
                {selectedSpot.name} - Surf Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
                <div className="text-center">
                  <div className="text-neon-blue font-semibold mb-1 text-xs sm:text-sm">Wave Type</div>
                  <div className="text-gray-300 text-xs truncate">{selectedSpot.waveType}</div>
                </div>
                <div className="text-center">
                  <div className="text-neon-blue font-semibold mb-1 text-xs sm:text-sm">Skill Level</div>
                  <div className="text-gray-300 text-xs truncate">{selectedSpot.skillLevel}</div>
                </div>
                <div className="text-center">
                  <div className="text-neon-blue font-semibold mb-1 text-xs sm:text-sm">Best Season</div>
                  <div className="text-gray-300 text-xs truncate">{selectedSpot.bestSeason}</div>
                </div>
                <div className="text-center">
                  <div className="text-neon-blue font-semibold mb-1 text-xs sm:text-sm">Tide Conditions</div>
                  <div className="text-gray-300 text-xs truncate">{selectedSpot.tideConditions}</div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {selectedSpot.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}