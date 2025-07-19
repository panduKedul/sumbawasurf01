import React, { useState } from 'react';
import { Waves, Clock, Calendar, TrendingUp, TrendingDown, Minus, MapPin, Sun, Moon } from 'lucide-react';

export default function TideDemo() {
  const [selectedStation, setSelectedStation] = useState('sumbawa');

  const tideStations = [
    {
      id: 'sumbawa',
      name: 'Sumbawa Besar',
      location: 'West Sumbawa',
      coordinates: '8°28\'S 117°25\'E',
      distance: '0 km'
    },
    {
      id: 'lombok',
      name: 'Lombok Strait',
      location: 'East Lombok',
      coordinates: '8°45\'S 116°05\'E',
      distance: '45 km'
    },
    {
      id: 'bima',
      name: 'Bima Bay',
      location: 'East Sumbawa',
      coordinates: '8°27\'S 118°44\'E',
      distance: '120 km'
    }
  ];

  const tideData = {
    sumbawa: [
      { time: '06:15', height: 0.3, type: 'Low', phase: 'morning' },
      { time: '12:30', height: 1.8, type: 'High', phase: 'afternoon' },
      { time: '18:45', height: 0.2, type: 'Low', phase: 'evening' },
      { time: '00:20', height: 1.9, type: 'High', phase: 'night' }
    ],
    lombok: [
      { time: '05:45', height: 0.4, type: 'Low', phase: 'morning' },
      { time: '12:00', height: 1.7, type: 'High', phase: 'afternoon' },
      { time: '18:15', height: 0.3, type: 'Low', phase: 'evening' },
      { time: '23:50', height: 1.8, type: 'High', phase: 'night' }
    ],
    bima: [
      { time: '06:30', height: 0.2, type: 'Low', phase: 'morning' },
      { time: '13:00', height: 2.0, type: 'High', phase: 'afternoon' },
      { time: '19:15', height: 0.1, type: 'Low', phase: 'evening' },
      { time: '01:00', height: 2.1, type: 'High', phase: 'night' }
    ]
  };

  const currentTides = tideData[selectedStation as keyof typeof tideData];
  const currentStation = tideStations.find(s => s.id === selectedStation);

  const getTideIcon = (type: string) => {
    switch (type) {
      case 'High':
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case 'Low':
        return <TrendingDown className="w-5 h-5 text-orange-400" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'morning':
        return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'afternoon':
        return <Sun className="w-4 h-4 text-orange-400" />;
      case 'evening':
        return <Sun className="w-4 h-4 text-red-400" />;
      case 'night':
        return <Moon className="w-4 h-4 text-blue-300" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTideHeight = (height: number) => {
    return `${height.toFixed(1)}m`;
  };

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

          {/* Station Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {tideStations.map((station) => (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station.id)}
                className={`card-elegant p-6 transition-all duration-300 hover:scale-105 ${
                  selectedStation === station.id
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 border-blue-400/50'
                    : 'hover:border-neon-blue/30'
                }`}
              >
                <div className="text-center">
                  <div className={`mx-auto mb-3 p-3 rounded-xl ${
                    selectedStation === station.id 
                      ? 'bg-white/20' 
                      : 'bg-dark-400'
                  }`}>
                    <MapPin className="w-5 h-5 mx-auto" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{station.name}</h3>
                  <p className="text-sm opacity-80 mb-1">{station.location}</p>
                  <p className="text-xs opacity-60">{station.distance} away</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Current Station Info */}
          <div className="card-elegant p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">{currentStation?.name}</h2>
            <div className="flex items-center justify-center space-x-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{currentStation?.coordinates}</span>
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
          </div>

          {/* Tide Times Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentTides.map((tide, index) => (
              <div
                key={index}
                className={`card-elegant p-6 transition-all duration-300 hover:scale-105 ${
                  tide.type === 'High'
                    ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30'
                    : 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30'
                }`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    {getTideIcon(tide.type)}
                    {getPhaseIcon(tide.phase)}
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-2 ${
                    tide.type === 'High' ? 'text-blue-400' : 'text-orange-400'
                  }`}>
                    {tide.time}
                  </h3>
                  
                  <p className="text-3xl font-bold text-white mb-2">
                    {getTideHeight(tide.height)}
                  </p>
                  
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    tide.type === 'High'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  }`}>
                    {tide.type} Tide
                  </span>
                </div>
              </div>
            ))}
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
                    {currentTides.map((tide, index) => {
                      const heightPercent = (tide.height / 2.0) * 100;
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center"
                          style={{ height: `${heightPercent}%` }}
                        >
                          <div className={`w-4 h-4 rounded-full mb-2 shadow-lg ${
                            tide.type === 'High' ? 'bg-blue-400' : 'bg-orange-400'
                          }`} />
                          <div className="text-xs text-gray-400 text-center">
                            <div className="font-medium">{tide.time}</div>
                            <div>{getTideHeight(tide.height)}</div>
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