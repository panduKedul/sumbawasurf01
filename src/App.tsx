import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from '../frontend/components/Header';
import Map from '../frontend/components/Map';
import Maps from '../frontend/components/Maps';
import TideDemo from '../frontend/components/TideDemo';
import SpotList from '../frontend/components/SpotList';
import SpotDetails from '../frontend/components/SpotDetails';
import Footer from '../frontend/components/Footer';
import UserDashboard from '../frontend/components/UserDashboard';
import AdminPanel from '../frontend/components/AdminPanel';
import Login from '../frontend/pages/Login';
import Register from '../frontend/pages/Register';
import { SURF_SPOTS } from '../frontend/utils/spots';
import { fetchSpotsFromDatabase } from '../frontend/utils/spots';
import { SurfSpot } from '../frontend/types';
import { AuthProvider } from '../frontend/contexts/AuthContext';
import { useAdmin } from '../frontend/hooks/useAdmin';
import { useAuth } from '../frontend/contexts/AuthContext';

function AppContent() {
  const [spots, setSpots] = useState<SurfSpot[]>(SURF_SPOTS);
  const [selectedSpot, setSelectedSpot] = useState<SurfSpot | null>(null);
  const [showMaps, setShowMaps] = useState(false);
  const [showTide, setShowTide] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSpots, setShowMobileSpots] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  // Load spots from database on component mount
  useEffect(() => {
    const loadSpots = async () => {
      try {
        const databaseSpots = await fetchSpotsFromDatabase();
        setSpots(databaseSpots);
      } catch (error) {
        console.warn('Failed to load spots from database, using static data:', error);
        setSpots(SURF_SPOTS);
      }
    };
    loadSpots();
  }, []);

  const handleSpotsUpdate = async () => {
    try {
      const updatedSpots = await fetchSpotsFromDatabase();
      setSpots(updatedSpots);
    } catch (error) {
      console.warn('Failed to update spots from database:', error);
      // Keep current spots if update fails
    }
  };

  const showHome = !showMaps && !showTide && !showUserDashboard && !showAdminPanel;

  const handleSpotSelect = (spot: SurfSpot) => {
    setSelectedSpot(spot);
    setShowMaps(false);
    setShowTide(false);
    setShowAdminPanel(false);
  };

  const toggleMaps = () => {
    setShowMaps(!showMaps);
    setShowTide(false);
    setSelectedSpot(null);
    setShowUserDashboard(false);
    setShowAdminPanel(false);
  };

  const toggleTide = () => {
    setShowMaps(false);
    setShowTide(!showTide);
    setSelectedSpot(null);
    setShowUserDashboard(false);
    setShowAdminPanel(false);
  };

  const toggleUserDashboard = () => {
    setShowMaps(false);
    setShowTide(false);
    setShowUserDashboard(!showUserDashboard);
    setSelectedSpot(null);
    setShowMobileMenu(false);
    setShowMobileSpots(false);
    setShowAdminPanel(false);
  };

  const toggleAdminPanel = () => {
    setShowMaps(false);
    setShowTide(false);
    setShowUserDashboard(false);
    setShowAdminPanel(!showAdminPanel);
    setSelectedSpot(null);
    setShowMobileMenu(false);
    setShowMobileSpots(false);
  };

  const resetToHome = () => {
    setShowMaps(false);
    setShowTide(false);
    setSelectedSpot(null);
    setShowMobileMenu(false);
    setShowMobileSpots(false);
    setShowUserDashboard(false);
    setShowAdminPanel(false);
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
        showHome={showHome}
        toggleUserDashboard={toggleUserDashboard}
        showUserDashboard={showUserDashboard}
        toggleAdminPanel={isAdmin ? toggleAdminPanel : undefined}
        showAdminPanel={showAdminPanel}
        toggleMobileMenu={toggleMobileMenu}
        showMobileMenu={showMobileMenu}
        toggleMobileSpots={toggleMobileSpots}
        showMobileSpots={showMobileSpots}
        spots={spots}
        onSelectSpot={handleSpotSelect}
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
          ) : showUserDashboard ? (
            <UserDashboard />
          ) : showAdminPanel ? (
            <AdminPanel onSpotsUpdate={handleSpotsUpdate} />
          ) : (
            /* Default view with map and spot details */
            <div className="flex flex-col flex-1">
              <div className={`${selectedSpot ? 'h-[35vh]' : 'h-[50vh]'} md:h-[45vh] lg:h-[50vh] relative mt-0`}>
                <Map spots={spots} onSelectSpot={handleSpotSelect} selectedSpot={selectedSpot} />
              </div>
              
              <div className="flex-1 bg-dark-200 overflow-auto px-4 md:px-0">
                {selectedSpot ? (
                  <SpotDetails spot={selectedSpot} />
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
                          <div className="text-2xl font-bold text-neon-blue">11</div>
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
                        <h3 className="text-lg font-semibold text-neon-blue mb-3">Create Your Free Account</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                          <div className="flex items-start space-x-2">
                            <div className="text-neon-blue mt-1">★</div>
                            <p className="text-gray-300 text-sm">Save your favorite surf spots for quick access</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="text-neon-blue mt-1">★</div>
                            <p className="text-gray-300 text-sm">Receive custom alerts for perfect surf conditions</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="text-neon-blue mt-1">★</div>
                            <p className="text-gray-300 text-sm">Get personalized spot recommendations</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="text-neon-blue mt-1">★</div>
                            <p className="text-gray-300 text-sm">Access exclusive local surf reports</p>
                          </div>
                        </div>
                        {!user && (
                          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register" className="px-6 py-2 bg-neon-blue text-dark-100 font-medium rounded-md hover:bg-opacity-90 transition-colors text-center">
                              Register
                            </Link>
                            <Link to="/login" className="px-6 py-2 border border-neon-blue text-neon-blue font-medium rounded-md hover:bg-neon-blue hover:bg-opacity-10 transition-colors text-center">
                              Sign In
                            </Link>
                          </div>
                        )}
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
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<AppContent />} />
        </Routes>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#2D2D2D',
            color: '#fff',
            borderRadius: '8px',
            border: '1px solid #363636',
          },
        }} />
      </AuthProvider>
    </Router>
  );
}

export default App;