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
        return <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />;
      case 'low':
        return <TrendingDown className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400" />;
      default:
        return <Waves className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />;
    }
  };

  const getPhaseIcon = (time: string) => {
    const hour = new Date(time).getHours();
    if (hour >= 6 && hour < 18) {
      return <Sun className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400" />;
    } else {
      return <Moon className="w-3 h-3 lg:w-4 lg:h-4 text-blue-300" />;
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
      <div className="min-h-screen flex items-center justify-center bg-dark-100 p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading tide data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100 overflow-x-hidden">
      {/* Header with Spot Image - Mobile First */}
      <div className="relative h-32 lg:h-48">
        <img
          src={selectedSpot.imageUrl}
          alt={selectedSpot.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Header Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-3 lg:p-4">
          <div className="flex items-center space-x-2 lg:space-x-3 mb-2 lg:mb-3">
            <div className="p-1.5 lg:p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg backdrop-blur-sm">
              <Waves className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-white drop-shadow-lg">
                Tide Information
              </h1>
              <p className="text-xs lg:text-sm text-gray-200 mt-1 drop-shadow">
                {selectedSpot.name}
              </p>
            </div>
          </div>

          {/* Spot Selector - Mobile First */}
          <div className="flex flex-col lg:flex-row items-center gap-2 w-full max-w-md mx-auto">
            <select
              value={selectedSpot.id}
              onChange={(e) => {
                const spot = spots.find(s => s.id === e.target.value);
                if (spot) setSelectedSpot(spot);
              }}
              className="input-elegant px-2 py-1.5 lg:px-3 lg:py-2 rounded-lg w-full backdrop-blur-sm text-xs lg:text-sm"
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
              className="btn-elegant px-2 py-1.5 lg:px-3 lg:py-2 rounded-lg flex items-center justify-center space-x-1 lg:space-x-2 backdrop-blur-sm text-xs lg:text-sm w-full lg:w-auto"
            >
              <RefreshCw className={`w-3 h-3 lg:w-4 lg:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Location Info - Mobile Friendly */}
          <div className="flex flex-col items-center space-y-1 text-gray-200 mt-2 lg:mt-3">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs lg:text-sm">{selectedSpot.coordinates[0].toFixed(4)}, {selectedSpot.coordinates[1].toFixed(4)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
              <span className="text-xs">{new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          
          {lastUpdated && (
            <p className="text-xs text-gray-300 mt-1 lg:mt-2 drop-shadow">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Main Content - Mobile First Container */}
      <div className="bg-dark-200">
        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6 max-w-4xl mx-auto">
          
          {/* Today's Tides - Mobile Grid */}
          <div>
            <h3 className="text-base lg:text-xl font-bold text-white mb-3 lg:mb-4 text-center flex items-center justify-center">
              <Activity className="w-4 h-4 lg:w-5 lg:h-5 text-neon-blue mr-2" />
              Today's Tides
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
              {todayTides.map((tide, index) => (
                <div
                  key={index}
                  className={`card-elegant p-3 lg:p-6 transition-all duration-300 hover:scale-105 ${
                    tide.type === 'high'
                      ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30'
                      : 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30'
                  }`}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 lg:space-x-2 mb-2">
                      {getTideIcon(tide.type)}
                      {getPhaseIcon(tide.time)}
                    </div>
                    
                    <h3 className={`text-sm lg:text-lg font-bold mb-1 lg:mb-2 ${
                      tide.type === 'high' ? 'text-blue-400' : 'text-orange-400'
                    }`}>
                      {formatTime(tide.time)}
                    </h3>
                    
                    <p className="text-sm lg:text-lg font-bold text-white mb-1 lg:mb-2">
                      {getTideHeight(tide.height)}
                    </p>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tide.type === 'high'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}>
                      {tide.type === 'high' ? 'High' : 'Low'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tide Chart Visualization - Mobile Responsive */}
          <div className="card-elegant p-3 lg:p-6">
            <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4 text-center flex items-center justify-center">
              <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 text-neon-blue mr-2" />
              24-Hour Tide Chart
            </h3>
            
            <div className="relative h-32 lg:h-48 bg-dark-300 rounded-xl p-3 lg:p-4 border border-dark-400">
              <div className="absolute inset-3 lg:inset-4">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400">
                  <span>2.0m</span>
                  <span>1.5m</span>
                  <span>1.0m</span>
                  <span>0.5m</span>
                  <span>0.0m</span>
                </div>
                
                {/* Chart area */}
                <div className="ml-6 lg:ml-8 h-full relative">
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
                          <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full mb-1 lg:mb-2 shadow-lg ${
                            tide.type === 'high' ? 'bg-blue-400' : 'bg-orange-400'
                          }`} />
                          <div className="text-xs text-gray-400 text-center">
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

          {/* Weekly Tide Overview - Mobile Horizontal Scroll */}
          <div className="card-elegant p-3 lg:p-6">
            <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4 text-center">7-Day Overview</h3>
            <div className="overflow-x-auto">
              <div className="flex space-x-2 lg:space-x-3 pb-2" style={{ minWidth: 'max-content' }}>
                {Object.entries(weeklyTides).map(([date, tides], dayIndex) => (
                  <div key={dayIndex} className="flex-shrink-0 bg-dark-300 rounded-lg p-2 lg:p-3 border border-dark-400 min-w-[110px] lg:min-w-[130px]">
                    <h4 className="text-center font-bold text-white mb-2 text-xs lg:text-sm">{formatDateShort(date)}</h4>
                    <div className="space-y-1">
                      {tides.map((tide, tideIndex) => (
                        <div key={tideIndex} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-1">
                            {getTideIcon(tide.type)}
                            <span className="text-gray-300 text-xs">{formatTime(tide.time)}</span>
                          </div>
                          <span className={`font-semibold text-xs ${
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

          {/* Upcoming Tides - Mobile Cards */}
          <div className="card-elegant p-3 lg:p-6">
            <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4 text-center">Upcoming Tides</h3>
            
            {/* Mobile: Stack vertically */}
            <div className="space-y-2 lg:space-y-3">
              {upcomingTides.map((tide, index) => (
                <div key={index} className="bg-dark-300 rounded-lg p-3 border border-dark-400">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTideIcon(tide.type)}
                      <span className={`font-medium text-sm ${
                        tide.type === 'high' ? 'text-blue-400' : 'text-orange-400'
                      }`}>
                        {tide.type === 'high' ? 'High' : 'Low'} Tide
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">{tide.height.toFixed(1)}m</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{formatDate(tide.time)}</span>
                    <span>{formatTime(tide.time)}</span>
                    {getPhaseIcon(tide.time)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Surf Spot Information - Mobile Responsive */}
          <div className="card-elegant p-3 lg:p-6 bg-gradient-to-br from-dark-300 to-dark-400">
            <h3 className="text-base lg:text-lg font-bold text-white mb-3 lg:mb-4 text-center">
              {selectedSpot.name} - Surf Information
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3 mb-3 lg:mb-4">
              <div className="text-center">
                <div className="text-neon-blue font-semibold mb-1 text-xs lg:text-sm">Wave Type</div>
                <div className="text-gray-300 text-xs">{selectedSpot.waveType}</div>
              </div>
              <div className="text-center">
                <div className="text-neon-blue font-semibold mb-1 text-xs lg:text-sm">Skill Level</div>
                <div className="text-gray-300 text-xs">{selectedSpot.skillLevel}</div>
              </div>
              <div className="text-center">
                <div className="text-neon-blue font-semibold mb-1 text-xs lg:text-sm">Best Season</div>
                <div className="text-gray-300 text-xs">{selectedSpot.bestSeason}</div>
              </div>
              <div className="text-center">
                <div className="text-neon-blue font-semibold mb-1 text-xs lg:text-sm">Tide Conditions</div>
                <div className="text-gray-300 text-xs">{selectedSpot.tideConditions}</div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs lg:text-sm leading-relaxed">
                {selectedSpot.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}