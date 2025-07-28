import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminProvider } from './contexts/AdminContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Map from './components/Map';
import Weather from './components/Weather';
import Tides from './components/Tides';
import SpotList from './components/SpotList';
import SpotDetails from './components/SpotDetails';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import Weather1 from './components/Weather1';
import Tides1 from './components/Tides1';
import Footer from './components/Footer';
import { loadSpots } from './data/spots';
import { SurfSpot } from './types';
import { useAdmin } from './contexts/AdminContext';
import { useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { isAdminLoggedIn, showAdminLogin } = useAdmin();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
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
  };

  const toggleWeather = () => {
    if (!showWeather) {
      setShowWeather(true);
      setShowTides(false);
      setShowAdmin(false);
      setSelectedSpot(null);
    }
  };

  const toggleTides = () => {
    if (!showTides) {
      setShowWeather(false);
      setShowTides(true);
      setShowAdmin(false);
      setSelectedSpot(null);
    }
  };

  const toggleAdmin = () => {
    if (isAdminLoggedIn && !showAdmin) {
      setShowWeather(false);
      setShowTides(false);
      setShowAdmin(true);
      setSelectedSpot(null);
    }
  };

  const resetToHome = () => {
    if (!showHome) {
      setShowWeather(false);
      setShowTides(false);
      setShowAdmin(false);
      setSelectedSpot(null);
    }
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
      className={`min-h-screen flex flex-col ${themeClasses.bg} ${themeClasses.text} pt-16 relative ${showMobileMenu ? 'overflow-hidden' : ''}`}
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
      
      <main className={`flex flex-1 overflow-hidden mt-0 transition-all duration-300 ${showMobileMenu ? 'pointer-events-none blur-sm' : ''}`}>
        {/* Desktop Sidebar */}
        <div className={`hidden lg:flex w-80 xl:w-96 ${themeClasses.cardBg} border-r ${themeClasses.border} shadow-xl flex-shrink-0 flex-col mt-0 ${showMobileMenu ? 'pointer-events-none' : ''}`}>
          <SpotList spots={spots} onSelectSpot={handleSpotSelect} selectedSpot={selectedSpot} />
        </div>

        <div className={`flex-1 flex flex-col ${showMobileMenu ? 'pointer-events-none' : ''}`}>
          {showWeather ? (
            <Weather1 spots={spots} />
          ) : showTides ? (
           <Tides1 spots={spots} />
          ) : showAdmin && isAdminLoggedIn ? (
            <AdminPanel 
              spots={spots} 
              onSpotsUpdate={loadSpotsData} 
            />
          ) : (
            /* Default view with map and spot details */
            <div className={`flex flex-col flex-1 ${themeClasses.cardBg} ${showMobileMenu ? 'pointer-events-none' : ''}`}>
              {/* Welcome Section with Map */}
              <div className={`p-3 lg:p-8 text-center ${themeClasses.bg}`}>
                <div className="max-w-4xl mx-auto mb-4 lg:mb-6 flex flex-col items-center">
                  <h1 className={`text-lg sm:text-xl lg:text-4xl font-bold ${themeClasses.accent} mb-2 text-center`}>Welcome to Sumbawa Surf Guide</h1>
                  <h2 className={`text-sm sm:text-base lg:text-2xl font-semibold ${themeClasses.text} mb-3 lg:mb-4 text-center`}>Your Ultimate West Sumbawa Surf Companion</h2>
                  <p className={`text-xs sm:text-sm lg:text-base ${themeClasses.textSecondary} mb-4 lg:mb-6 text-center max-w-2xl mx-auto`}>
                    Discover the best surf spots in West Sumbawa with detailed information about wave conditions, 
                    tide times, weather forecasts, and local insights.
                  </p>
                </div>
                
                {/* Interactive Map */}
                <div className={`h-[30vh] lg:h-[50vh] rounded-xl overflow-hidden shadow-2xl border ${themeClasses.border} mb-4 lg:mb-6 max-w-4xl mx-auto`}>
                  <Map spots={spots} onSelectSpot={handleSpotSelect} selectedSpot={selectedSpot} />
                </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto p-3 lg:p-6">
                {selectedSpot ? (
                  <SpotDetails spot={selectedSpot} />
                ) : loading ? (
                  <div className="flex items-center justify-center p-4 sm:p-8 text-center">
                    <div className="text-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className={themeClasses.textSecondary}>Loading surf spots...</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 sm:p-6 text-center animate-fadeIn">
                    <div className="max-w-2xl mx-auto">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
                        <div className={`${themeClasses.cardBg} p-2 sm:p-3 lg:p-4 rounded-lg border ${themeClasses.border} text-center shadow-lg`}>
                          <div className={`text-base sm:text-lg lg:text-2xl font-bold ${themeClasses.accent}`}>{spots.length}</div>
                          <div className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>Surf Spots</div>
                        </div>
                        <div className={`${themeClasses.cardBg} p-2 sm:p-3 lg:p-4 rounded-lg border ${themeClasses.border} text-center shadow-lg`}>
                          <div className={`text-base sm:text-lg lg:text-2xl font-bold ${themeClasses.accent}`}>24/7</div>
                          <div className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>Forecasts</div>
                        </div>
                        <div className={`${themeClasses.cardBg} p-2 sm:p-3 lg:p-4 rounded-lg border ${themeClasses.border} text-center shadow-lg`}>
                          <div className={`text-base sm:text-lg lg:text-2xl font-bold ${themeClasses.accent}`}>Live</div>
                          <div className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>Tide Data</div>
                        </div>
                      </div>

                      {/* Features Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
                        <div className={`${themeClasses.cardBg} p-2 sm:p-3 lg:p-4 rounded-lg border ${themeClasses.border} text-center shadow-lg`}>
                          <h3 className={`${themeClasses.accent} font-semibold mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base`}>🗺️ Interactive Maps</h3>
                          <p className={`${themeClasses.textSecondary} text-xs sm:text-sm`}>Explore surf spots with detailed maps, wind and wave forecasts</p>
                        </div>
                        <div className={`${themeClasses.cardBg} p-2 sm:p-3 lg:p-4 rounded-lg border ${themeClasses.border} text-center shadow-lg`}>
                          <h3 className={`${themeClasses.accent} font-semibold mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base`}>🌊 Tide Information</h3>
                          <p className={`${themeClasses.textSecondary} text-xs sm:text-sm`}>Real-time tide data and predictions for all surf locations</p>
                        </div>
                        <div className={`${themeClasses.cardBg} p-2 sm:p-3 lg:p-4 rounded-lg border ${themeClasses.border} text-center shadow-lg`}>
                          <h3 className={`${themeClasses.accent} font-semibold mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base`}>📊 Surf Forecasts</h3>
                          <p className={`${themeClasses.textSecondary} text-xs sm:text-sm`}>Detailed wave height, wind, and weather predictions</p>
                        </div>
                        <div className={`${themeClasses.cardBg} p-2 sm:p-3 lg:p-4 rounded-lg border ${themeClasses.border} text-center shadow-lg`}>
                          <h3 className={`${themeClasses.accent} font-semibold mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base`}>📍 Local Insights</h3>
                          <p className={`${themeClasses.textSecondary} text-xs sm:text-sm`}>Skill levels, best seasons, and local surf conditions</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className={`${themeClasses.textSecondary} text-xs sm:text-sm`}>
                          {spots.length > 0 ? 'Click on any surf spot above to start exploring' : 'Loading surf spots...'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                </div>
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
    <ThemeProvider>
      <AdminProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppContent />} />
          </Routes>
        </Router>
      </AdminProvider>
    </ThemeProvider>
  );
}

export default App;