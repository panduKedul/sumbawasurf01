import React, { useState, useEffect } from 'react';
import { Waves, Clock, Calendar, TrendingUp, TrendingDown, MapPin, RefreshCw, Sun, Moon } from 'lucide-react';
import { fetchTideData, TideData, getFallbackTideData } from '../services/weatherApi';
import { SURF_SPOTS } from '../data/spots';

export default function Tides() {
  const [selectedSpot, setSelectedSpot] = useState(SURF_SPOTS[0]);
  const [tideData, setTideData] = useState<TideData[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadTideData();
  }, [selectedSpot]);

  const loadTideData = async () => {
    setLoading(true);
    try {
      const data = await fetchTideData(selectedSpot.coordinates[0], selectedSpot.coordinates[1]);
      if (data.length > 0) {
        setTideData(data);
      } else {
        // Use fallback data if API fails
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

  const todayTides = getTodayTides();
  const upcomingTides = getUpcomingTides();

  return (
    <div className="h-full flex flex-col bg-dark-100">
      {/* Header */}
      <div className="p-6 bg-dark-200 border-b border-dark-400">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Tide Information
              </h1>
              <p className="text-lg text-gray-300 mt-2">
                Real-time tide data for West Sumbawa surf spots
              </p>
            </div>
          </div>

          {/* Spot Selector */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <select
              value={selectedSpot.id}
              onChange={(e) => {
                const spot = SURF_SPOTS.find(s => s.id === e.target.value);
                if (spot) setSelectedSpot(spot);
              }}
              className="input-elegant px-4 py-2 rounded-lg max-w-md"
            >
              {SURF_SPOTS.map((spot) => (
                <option key={spot.id} value={spot.id}>
                  {spot.name}
                </option>
              ))}
            </select>
            <button
              onClick={loadTideData}
              disabled={loading}
              className="btn-elegant px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Current Station Info */}
          <div className="card-elegant p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2">{selectedSpot.name}</h2>
            <div className="flex items-center justify-center space-x-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{selectedSpot.coordinates[0].toFixed(4)}, {selectedSpot.coordinates[1].toFixed(4)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
            {lastUpdated && (
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Today's Tides */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Today's Tides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {todayTides.map((tide, index) => (
                <div
                  key={index}
                  className={`card-elegant p-6 transition-all duration-300 hover:scale-105 ${
                    tide.type === 'high'
                      ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30'
                      : 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30'
                  }`}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      {getTideIcon(tide.type)}
                      {getPhaseIcon(tide.time)}
                    </div>
                    
                    <h3 className={`text-2xl font-bold mb-2 ${
                      tide.type === 'high' ? 'text-blue-400' : 'text-orange-400'
                    }`}>
                      {formatTime(tide.time)}
                    </h3>
                    
                    <p className="text-3xl font-bold text-white mb-2">
                      {tide.height.toFixed(1)}m
                    </p>
                    
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      tide.type === 'high'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}>
                      {tide.type === 'high' ? 'High Tide' : 'Low Tide'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tides */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Upcoming Tides</h3>
            <div className="card-elegant p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingTides.map((tide, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-dark-300 rounded-lg border border-dark-400 hover:border-neon-blue/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getTideIcon(tide.type)}
                      <div>
                        <p className="font-bold text-white">
                          {formatDate(tide.time)} - {formatTime(tide.time)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {tide.type === 'high' ? 'High Tide' : 'Low Tide'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">
                        {tide.height.toFixed(1)}m
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tide Chart Visualization */}
          <div className="card-elegant p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">24-Hour Tide Chart</h3>
            
            <div className="relative h-64 bg-dark-300 rounded-xl p-6 border border-dark-400">
              <div className="absolute inset-6">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-sm text-gray-400">
                  <span>2.0m</span>
                  <span>1.5m</span>
                  <span>1.0m</span>
                  <span>0.5m</span>
                  <span>0.0m</span>
                </div>
                
                {/* Chart area */}
                <div className="ml-12 h-full relative">
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
                          <div className={`w-4 h-4 rounded-full mb-2 shadow-lg ${
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

          {/* Surfing Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-elegant p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h4 className="font-bold text-white mb-2">Best Surf Times</h4>
                <p className="text-sm text-gray-300">
                  Mid to high tide typically offers the best surf conditions for most spots
                </p>
              </div>
            </div>
            
            <div className="card-elegant p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <div className="text-center">
                <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <h4 className="font-bold text-white mb-2">Tide Changes</h4>
                <p className="text-sm text-gray-300">
                  Plan your sessions around tide changes for optimal wave quality
                </p>
              </div>
            </div>
            
            <div className="card-elegant p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/30">
              <div className="text-center">
                <Waves className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h4 className="font-bold text-white mb-2">Safety First</h4>
                <p className="text-sm text-gray-300">
                  Always check local conditions and respect the ocean's power
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}