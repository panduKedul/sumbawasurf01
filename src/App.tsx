import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Map from './components/Map';
import Maps from './components/Maps';
import TideDemo from './components/TideDemo';
import SpotList from './components/SpotList';
import SpotDetails from './components/SpotDetails';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { loadSpots } from './data/spots';
import { SurfSpot } from './types';

function AppContent() {
  const [spots, setSpots] = useState<SurfSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<SurfSpot | null>(null);
  const [showMaps, setShowMaps] = useState(false);
  const [showTide, setShowTide] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSpots, setShowMobileSpots] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSpotsData();
  }, []);

  const loadSpotsData = async () => {
    try {
      setLoading(true);
      const spotsData = await loadSpots();
      setSpots(spotsData);
    } catch (error) {
      console.error('Error loading spots:', error);
    } finally {
      setLoading(false);
    }
  };

  const showHome = !showMaps && !showTide && !showAdmin;

  const handleSpotSelect = (spot: SurfSpot) => {
    setSelectedSpot(spot);
    setShowMaps(false);
    setShowTide(false);
    setShowAdmin(false);
  };

  const toggleMaps = () => {
    setShowMaps(!showMaps);
    setShowTide(false);
    setShowAdmin(false);
    setSelectedSpot(null);
  };

  const toggleTide = () => {
    setShowMaps(false);
    setShowTide(!showTide);
    setShowAdmin(false);
    setSelectedSpot(null);
  };

  const toggleAdmin = () => {
    setShowMaps(false);
    setShowTide(false);
    setShowAdmin(!showAdmin);
    setSelectedSpot(null);
  };

  const resetToHome = () => {
    setShowMaps(false);
    setShowTide(false);
    setShowAdmin(false);
    setSelectedSpot(null);
    setShowMobileMenu(false);
    setShowMobileSpots(false);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    if (!showMobileMenu) {
      setShowMobileSpots(false);
    }
  };

  const toggleMobileSpots = () => {
    setShowMobileSpots(!showMobileSpots);
  };

  const MainContent = () => (
    <div 
      className="min-h-screen flex flex-col bg-dark-100 text-gray-100 pt-16"
      onClick={() => {
        if (showMobileMenu) {
          setShowMobileMenu(false);
          setShowMobileSpots(false);
        }
      }}
      onTouchStart={() => {
        if (showMobileMenu) {
          setShowMobileMenu(false);
          setShowMobileSpots(false);
        }
      }}
    >
      <Header 
        toggleMaps={toggleMaps}
        showMaps={showMaps}
        toggleTide={toggleTide}
        showTide={showTide}
        resetToHome={resetToHome}
        toggleAdmin={toggleAdmin}
        showAdmin={showAdmin}
        showHome={showHome}
        toggleMobileMenu={toggleMobileMenu}
        showMobileMenu={showMobileMenu}
        toggleMobileSpots={toggleMobileSpots}
        showMobileSpots={showMobileSpots}
        spots={spots}
        onSelectSpot={handleSpotSelect}
      />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{ duration: 4000 }}
      />
      <main className={`flex flex-1 overflow-hidden mt-0 transition-all duration-300 ${showMobileMenu ? 'blur-sm' : ''}`}>
        {/* Desktop Sidebar */}
        <div className={`hidden md:flex w-80 lg:w-96 bg-dark-200 border-r border-dark-400 shadow-xl flex-shrink-0 flex-col mt-0 transition-all duration-300 ${showMobileMenu ? 'blur-[2px] pointer-events-none' : ''}`}>
          <SpotList spots={spots} onSelectSpot={handleSpotSelect} selectedSpot={selectedSpot} />
        </div>

        <div className={`flex-1 flex flex-col transition-all duration-300 ${showMobileMenu ? 'blur-[2px] pointer-events-none' : ''}`}>
          {showMaps ? (
            <Maps />
          ) : showTide ? (
            <TideDemo />
          ) : showAdmin ? (
            <AdminPanel 
              spots={spots} 
              onSpotsUpdate={loadSpotsData} 
            />
          ) : (
            /* Default view with map and spot details */
            <div className="flex flex-col flex-1">
              <div className={`${selectedSpot ? 'h-[35vh]' : 'h-[50vh]'} md:h-[45vh] lg:h-[50vh] relative mt-0`}>
                <Map spots={spots} onSelectSpot={handleSpotSelect} selectedSpot={selectedSpot} />
              </div>
              
              <div className="flex-1 bg-dark-200 overflow-auto px-4 md:px-0">
                {selectedSpot ? (
                  <SpotDetails spot={selectedSpot} />
                ) : loading ? (
                  <div className="flex items-center justify-center min-h-full p-4 md:p-6 text-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading surf spots...</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-full p-4 md:p-6 text-center animate-fadeIn bg-gradient-radial from-dark-300 to-dark-100">
                    <div className="max-w-xl w-full">
                      <div className="mb-6">
                        <h1 className="text-2xl md:text-4xl font-bold text-neon-blue mb-2">Welcome to Sumbawa Surf Guide</h1>
                        <h2 className="text-lg md:text-2xl font-semibold text-white mb-4">Your Ultimate West Sumbawa Surf Companion</h2>
                      </div>
                      <p className="text-base text-gray-400 mb-6">
                        Discover the best surf spots in West Sumbawa with detailed information about wave conditions, 
                        tide times, weather forecasts, and local insights. Select a surf spot from the map or spots menu 
                        to explore world-class breaks from Super Suck to Scar Reef.
                      </p>
                      <div className="flex justify-center mb-8">
                        <div className="w-32 h-1 bg-neon-blue rounded animate-glow"></div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-dark-400 p-4 rounded-lg border border-dark-500">
                          <div className="text-2xl font-bold text-neon-blue">{spots.length}</div>
                          <div className="text-sm text-gray-400">Surf Spots</div>
                        </div>
                        <div className="bg-dark-400 p-4 rounded-lg border border-dark-500">
                          <div className="text-2xl font-bold text-neon-blue">24/7</div>
                          <div className="text-sm text-gray-400">Forecasts</div>
                        </div>
                        <div className="bg-dark-400 p-4 rounded-lg border border-dark-500">
                          <div className="text-2xl font-bold text-neon-blue">Live</div>
                          <div className="text-sm text-gray-400">Tide Data</div>
                        </div>
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-dark-400 p-4 rounded-lg border border-dark-500 text-left">
                          <h3 className="text-neon-blue font-semibold mb-2">🗺️ Interactive Maps</h3>
                          <p className="text-gray-300 text-sm">Explore surf spots with detailed maps, wind and wave forecasts</p>
                        </div>
                        <div className="bg-dark-400 p-4 rounded-lg border border-dark-500 text-left">
                          <h3 className="text-neon-blue font-semibold mb-2">🌊 Tide Information</h3>
                          <p className="text-gray-300 text-sm">Real-time tide data and predictions for all surf locations</p>
                        </div>
                        <div className="bg-dark-400 p-4 rounded-lg border border-dark-500 text-left">
                          <h3 className="text-neon-blue font-semibold mb-2">📊 Surf Forecasts</h3>
                          <p className="text-gray-300 text-sm">Detailed wave height, wind, and weather predictions</p>
                        </div>
                        <div className="bg-dark-400 p-4 rounded-lg border border-dark-500 text-left">
                          <h3 className="text-neon-blue font-semibold mb-2">📍 Local Insights</h3>
                          <p className="text-gray-300 text-sm">Skill levels, best seasons, and local surf conditions</p>
                        </div>
                      </div>

                      <div className="bg-dark-300 p-6 rounded-lg border border-dark-400">
                        <h3 className="text-lg font-semibold text-neon-blue mb-3">Explore Sumbawa Surf Spots</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                          <div className="flex items-start space-x-2">
                            <div className="text-neon-blue mt-1">★</div>
                            <p className="text-gray-300 text-sm">Discover 11 world-class surf spots</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="text-neon-blue mt-1">★</div>
                            <p className="text-gray-300 text-sm">Real-time weather and tide information</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="text-neon-blue mt-1">★</div>
                            <p className="text-gray-300 text-sm">Interactive maps and forecasts</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="text-neon-blue mt-1">★</div>
                            <p className="text-gray-300 text-sm">Detailed spot information and guides</p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-sm">
                            {spots.length > 0 ? 'Click on any surf spot to start exploring' : 'Loading surf spots...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );

  return <MainContent />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;