import React from 'react';
import { Menu, X, MapPin, Waves, Settings } from 'lucide-react';
import { SurfSpot } from '../types';

interface HeaderProps {
  toggleMaps: () => void;
  showMaps: boolean;
  toggleTide: () => void;
  showTide: boolean;
  toggleAdmin: () => void;
  showAdmin: boolean;
  resetToHome: () => void;
  showHome: boolean;
  toggleMobileMenu: () => void;
  showMobileMenu: boolean;
  toggleMobileSpots: () => void;
  showMobileSpots: boolean;
  spots: SurfSpot[];
  onSelectSpot: (spot: SurfSpot) => void;
}

export default function Header({
  toggleMaps,
  showMaps,
  toggleTide,
  showTide,
  toggleAdmin,
  showAdmin,
  resetToHome,
  showHome,
  toggleMobileMenu,
  showMobileMenu,
  toggleMobileSpots,
  showMobileSpots,
  spots,
  onSelectSpot
}: HeaderProps) {
  return (
    <header className="header-elegant fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={resetToHome}
          >
            <div className="p-2 bg-gradient-to-br from-neon-blue to-primary-600 rounded-lg shadow-lg group-hover:shadow-neon-blue/50 transition-all duration-300">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue to-white bg-clip-text text-transparent">
                Sumbawa Surf Guide
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">West Sumbawa</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            <button
              onClick={resetToHome}
              className={`btn-elegant px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                showHome ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/50' : ''
              }`}
            >
              Home
            </button>
            
            <button
              onClick={toggleMaps}
              className={`btn-elegant px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                showMaps ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/50' : ''
              }`}
            >
              Maps
            </button>
            
            <button
              onClick={toggleTide}
              className={`btn-elegant px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                showTide ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/50' : ''
              }`}
            >
              Tides
            </button>
            
            <button
              onClick={toggleAdmin}
              className={`btn-elegant px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                showAdmin ? 'bg-neon-blue/20 text-neon-blue border-neon-blue/50' : ''
              }`}
            >
              Admin
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden btn-elegant p-2 rounded-lg transition-all duration-300"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-2 p-4 card-elegant rounded-lg">
            <div className="space-y-2">
              <button
                onClick={() => {
                  resetToHome();
                  toggleMobileMenu();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                  showHome ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-300 hover:text-white hover:bg-dark-400'
                }`}
              >
                Home
              </button>
              
              <button
                onClick={() => {
                  toggleMaps();
                  toggleMobileMenu();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                  showMaps ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-300 hover:text-white hover:bg-dark-400'
                }`}
              >
                Maps
              </button>
              
              <button
                onClick={() => {
                  toggleTide();
                  toggleMobileMenu();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                  showTide ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-300 hover:text-white hover:bg-dark-400'
                }`}
              >
                Tides
              </button>
              
              <button
                onClick={() => {
                  toggleAdmin();
                  toggleMobileMenu();
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                  showAdmin ? 'bg-neon-blue/20 text-neon-blue' : 'text-gray-300 hover:text-white hover:bg-dark-400'
                }`}
              >
                Admin
              </button>

              {/* Surf Spots for Mobile */}
              <div>
                <button
                  onClick={toggleMobileSpots}
                  className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-400 transition-all duration-300 flex items-center justify-between font-medium"
                >
                  <span>Surf Spots</span>
                  <span className={`transform transition-transform ${showMobileSpots ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {showMobileSpots && (
                  <div className="ml-4 mt-2 space-y-1 max-h-60 overflow-y-auto">
                    {spots.map((spot) => (
                      <button
                        key={spot.id}
                        onClick={() => {
                          onSelectSpot(spot);
                          toggleMobileMenu();
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-dark-400 transition-all duration-300 flex items-center space-x-2"
                      >
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{spot.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}