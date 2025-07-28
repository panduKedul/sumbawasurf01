import React from 'react';
import { Menu, X, MapPin, Waves, Settings, Lock, Sun, Moon } from 'lucide-react';
import { SurfSpot } from '../types';
import { useAdmin } from '../contexts/AdminContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  toggleWeather: () => void;
  showWeather: boolean;
  toggleTides: () => void;
  showTides: boolean;
  toggleAdmin: () => void;
  showAdmin: boolean;
  resetToHome: () => void;
  showHome: boolean;
  toggleMobileMenu: () => void;
  showMobileMenu: boolean;
  spots: SurfSpot[];
  onSelectSpot: (spot: SurfSpot) => void;
}

export default function Header({
  toggleWeather,
  showWeather,
  toggleTides,
  showTides,
  toggleAdmin,
  showAdmin,
  resetToHome,
  showHome,
  toggleMobileMenu,
  showMobileMenu,
  spots,
  onSelectSpot
}: HeaderProps) {
  const { isAdminLoggedIn, toggleAdminLogin } = useAdmin();
  const { theme, toggleTheme, getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [showMobileSpots, setShowMobileSpots] = useState(false);

  const getThemeIcon = () => {
    return theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />;
  };

  // Handle menu item clicks
  const handleHomeClick = () => {
    resetToHome();
  };

  const handleWeatherClick = () => {
    toggleWeather();
  };

  const handleTidesClick = () => {
    toggleTides();
  };

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      toggleAdmin();
    } else {
      toggleAdminLogin();
    }
  };

  const handleSpotClick = (spot: SurfSpot) => {
    onSelectSpot(spot);
  };

  const toggleMobileSpots = () => {
    setShowMobileSpots(!showMobileSpots);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${themeClasses.navbar}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={resetToHome}
          >
            <div className={`p-1.5 lg:p-2 ${themeClasses.headerBg} rounded-lg shadow-lg transition-all duration-300`}>
              <Waves className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-sm lg:text-xl font-bold ${themeClasses.accent}`}>
                Sumbawa Surf Guide
              </h1>
              <p className={`text-xs ${themeClasses.textSecondary}`}>West Sumbawa</p>
            </div>
            <div className="sm:hidden">
              <h1 className={`text-sm font-bold ${themeClasses.accent}`}>
                Sumbawa
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            <button
              onClick={resetToHome}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base ${
                showHome 
                  ? `${themeClasses.button} shadow-lg` 
                  : `${themeClasses.text} ${themeClasses.buttonHover}`
              }`}
            >
              Home
            </button>
            
            <button
              onClick={toggleWeather}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base ${
                showWeather 
                  ? `${themeClasses.button} shadow-lg` 
                  : `${themeClasses.text} ${themeClasses.buttonHover}`
              }`}
            >
              Weather
            </button>
            
            <button
              onClick={toggleTides}
              className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base ${
                showTides 
                  ? `${themeClasses.button} shadow-lg` 
                  : `${themeClasses.text} ${themeClasses.buttonHover}`
              }`}
            >
              Tides
            </button>
            
            {isAdminLoggedIn ? (
              <button
                onClick={toggleAdmin}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base ${
                  showAdmin 
                    ? `${themeClasses.button} shadow-lg` 
                    : `${themeClasses.text} ${themeClasses.buttonHover}`
                }`}
              >
                Admin
              </button>
            ) : (
              <button
                onClick={toggleAdminLogin}
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm lg:text-base ${themeClasses.text} ${themeClasses.buttonHover}`}
              >
                <Lock className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${themeClasses.buttonHover} ${themeClasses.text}`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {getThemeIcon()}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${themeClasses.buttonHover} ${themeClasses.text}`}
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-md"
          onClick={toggleMobileMenu}
        >
          {/* Menu Content */}
          <div className="absolute top-14 left-0 right-0">
            <div 
              className={`mx-3 mt-2 p-4 ${themeClasses.cardBg} rounded-xl shadow-2xl border ${themeClasses.border} backdrop-blur-xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                {/* Close Button */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={toggleMobileMenu}
                    className={`p-2 rounded-lg ${themeClasses.buttonHover} ${themeClasses.text}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Home */}
                <button
                  onClick={handleHomeClick}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm ${
                    showHome 
                      ? `${themeClasses.button}` 
                      : `${themeClasses.text} ${themeClasses.buttonHover}`
                  }`}
                >
                  Home
                </button>
                
                {/* Weather */}
                <button
                  onClick={handleWeatherClick}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm ${
                    showWeather 
                      ? `${themeClasses.button}` 
                      : `${themeClasses.text} ${themeClasses.buttonHover}`
                  }`}
                >
                  Weather
                </button>
                
                {/* Tides */}
                <button
                  onClick={handleTidesClick}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm ${
                    showTides 
                      ? `${themeClasses.button}` 
                      : `${themeClasses.text} ${themeClasses.buttonHover}`
                  }`}
                >
                  Tides
                </button>
                
                {/* Admin */}
                <button
                  onClick={handleAdminClick}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm ${
                    (showAdmin && isAdminLoggedIn)
                      ? `${themeClasses.button}` 
                      : `${themeClasses.text} ${themeClasses.buttonHover}`
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
                </button>

                {/* Surf Spots */}
                <div>
                  <button
                    onClick={toggleMobileSpots}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between font-medium text-sm ${themeClasses.text} ${themeClasses.buttonHover}`}
                  >
                    <span>Surf Spots</span>
                    <span className={`transform transition-transform duration-200 ${showMobileSpots ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  
                  {showMobileSpots && (
                    <div className="ml-4 mt-2 space-y-2 max-h-48 overflow-y-auto">
                      {spots.map((spot) => (
                        <button
                          key={spot.id}
                          onClick={() => handleSpotClick(spot)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm ${themeClasses.textSecondary} ${themeClasses.buttonHover}`}
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
          </div>
        </div>
      )}
    </header>
  );
}