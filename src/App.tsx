import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminProvider } from './contexts/AdminContext';
import Header from './components/Header';
import Map from './components/Map';
import Weather from './components/Weather';
import Tides from './components/Tides';
import SpotList from './components/SpotList';
import SpotDetails from './components/SpotDetails';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import Footer from './components/Footer';
import { loadSpots } from './data/spots';
import { SurfSpot } from './types';
import { useAdmin } from './contexts/AdminContext';

function AppContent() {
  const { isAdminLoggedIn, showAdminLogin } = useAdmin();
  const [spots, setSpots] = useState<SurfSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<SurfSpot | null>(null);
  const [showWeather, setShowWeather] = useState(false);
  const [showTides, setShowTides] = useState(false);
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
      setSpots(spotsData);
    } catch (error) {
      console.error('Error loading spots:', error);
    } finally {
      setLoading(false);
    }
  };

  const showHome = !showWeather && !showTides && !showAdmin;

  const handleSpotSelect = (spot: SurfSpot) => {
    setSelectedSpot(spot);
    setShowWeather(false);
    setShowTides(false);
    setShowAdmin(false);
    setShowAdmin(false);
  };

  const toggleWeather = () => {
    setShowWeather(!showWeather);
    setShowTides(false);
    setShowAdmin(false);
    setShowAdmin(false);
    setSelectedSpot(null);
  };

  const toggleTides = () => {
    setShowWeather(false);
    setShowTides(!showTides);
    setShowAdmin(false);
    setSelectedSpot(null);
  };

  const toggleAdmin = () => {
    if (isAdminLoggedIn) {
      setShowWeather(false);
      setShowTides(false);
      setShowAdmin(!showAdmin);
      setSelectedSpot(null);
    }
  };

  const resetToHome = () => {
    setShowWeather(false);
    setShowTides(false);
    setShowAdmin(false);
    setSelectedSpot(null);
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
        toggleWeather={toggleWeather}
        showWeather={showWeather}
        toggleTides={toggleTides}
        showTides={showTides}
        toggleAdmin={toggleAdmin}
        showAdmin={showAdmin}
        resetToHome={resetToHome}
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

      {/* Admin Login Modal */}
      {showAdminLogin && <AdminLogin />}
      
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
          {showWeather ? (
            <Weather spots={spots} />
          ) : showTides ? (
            <Tides spots={spots} />
          ) : showAdmin && isAdminLoggedIn ? (
            <AdminPanel 
              spots={spots} 
              onSpotsUpdate={loadSpotsData} 
            />
          ) : (
            /* Default view with map and spot details */
            <div className="flex flex-col flex-1 bg-dark-200">
              {/* Welcome Section with Map */}
              <div className="p-4 md:p-6 text-center bg-gradient-radial from-dark-300 to-dark-100">
                <div className="max-w-4xl mx-auto mb-6">
                  <h1 className="text-2xl md:text-4xl font-bold text-neon-blue mb-2">Welcome to Sumbawa Surf Guide</h1>
                  <h2 className="text-lg md:text-2xl font-semibold text-white mb-4">Your Ultimate West Sumbawa Surf Companion</h2>
                  <p className="text-base text-gray-400 mb-6">
                    Discover the best surf spots in West Sumbawa with detailed information about wave conditions, 
                    tide times, weather forecasts, and local insights.
                  </p>
                </div>
                
                {/* Interactive Map */}
                <div className="h-[35vh] sm:h-[40vh] md:h-[50vh] rounded-xl overflow-hidden shadow-2xl border border-dark-400 mb-6 w-full max-w-6xl mx-auto">
                  <Map spots={spots} onSelectSpot={handleSpotSelect} selectedSpot={selectedSpot} />
                </div>
              </div>
              
              <div className="flex-1 overflow-auto px-4 md:px-6">
                {selectedSpot ? (
                  <SpotDetails spot={selectedSpot} />
                ) : loading ? (
                  <div className="flex items-center justify-center p-8 text-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading surf spots...</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 md:p-6 text-center animate-fadeIn">
                    <div className="max-w-xl w-full">
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

                      <div className="text-center">
                        <p className="text-gray-400 text-sm">
                          {spots.length > 0 ? 'Click on any surf spot above to start exploring' : 'Loading surf spots...'}
                        </p>
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
    <AdminProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;