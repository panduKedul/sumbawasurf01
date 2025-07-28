import React, { useState } from 'react';
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
  spots,
  onSelectSpot
}: HeaderProps) {
  const { isAdminLoggedIn, toggleAdminLogin } = useAdmin();
  const { theme, toggleTheme, getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  // Mobile menu states - separated for better control
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSpots, setShowMobileSpots] = useState(false);

  const getThemeIcon = () => {
    return theme === 'light' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />;
  };

  // Mobile menu handlers - completely separated logic
  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    setShowMobileSpots(false);
  };

  const openMobileMenu = () => {
    setShowMobileMenu(true);
  };

  const toggleMobileMenu = () => {
    if (showMobileMenu) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  // Navigation handlers with mobile menu close
  const handleHomeClick = () => {
    resetToHome();
    closeMobileMenu();
  };

  const handleWeatherClick = () => {
    toggleWeather();
    closeMobileMenu();
  };

  const handleTidesClick = () => {
    toggleTides();
    closeMobileMenu();
  };

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      toggleAdmin();
    } else {
      toggleAdminLogin();
    }
    closeMobileMenu();
  };

  const handleSpotClick = (spot: SurfSpot) => {
    onSelectSpot(spot);
    closeMobileMenu();
  };

  const handleThemeToggle = () => {
    toggleTheme();
    // Don't close menu for theme toggle
  };

  const toggleMobileSpots = () => {
    setShowMobileSpots(!showMobileSpots);
  };

  // Prevent event bubbling for menu content
  const handleMenuContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle backdrop click to close menu
  const handleBackdropClick = () => {
    closeMobileMenu();
  };

  return (
    <>
      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 ${themeClasses.navbar}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 lg:h-16">
            {/* Logo */}
            <button 
              className="flex items-center space-x-2 cursor-pointer group focus:outline-none"
              onClick={resetToHome}
              type="button"
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
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
              <button
                onClick={resetToHome}
                type="button"
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base focus:outline-none ${
                  showHome 
                    ? `${themeClasses.button} shadow-lg` 
                    : `${themeClasses.text} ${themeClasses.buttonHover}`
                }`}
              >
                Home
              </button>
              
              <button
                onClick={toggleWeather}
                type="button"
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base focus:outline-none ${
                  showWeather 
                    ? `${themeClasses.button} shadow-lg` 
                    : `${themeClasses.text} ${themeClasses.buttonHover}`
                }`}
              >
                Weather
              </button>
              
              <button
                onClick={toggleTides}
                type="button"
                className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base focus:outline-none ${
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
                  type="button"
                  className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base focus:outline-none ${
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
                  type="button"
                  className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm lg:text-base focus:outline-none ${themeClasses.text} ${themeClasses.buttonHover}`}
                >
                  <Lock className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span>Admin</span>
                </button>
              )}
            </nav>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle Button */}
              <button
                onClick={handleThemeToggle}
                type="button"
                className={`p-2 rounded-lg transition-all duration-300 focus:outline-none ${themeClasses.buttonHover} ${themeClasses.text}`}
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {getThemeIcon()}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                type="button"
                className={`md:hidden p-2 rounded-lg transition-all duration-300 focus:outline-none ${themeClasses.buttonHover} ${themeClasses.text}`}
                aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Completely Separated */}
      {showMobileMenu && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          {/* Mobile Menu Content */}
          <div className="absolute top-0 left-0 right-0">
            {/* Mobile Header Bar */}
            <div className={`${themeClasses.navbar} px-3 py-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 ${themeClasses.headerBg} rounded-lg shadow-lg`}>
                    <Waves className="w-4 h-4 text-white" />
                  </div>
                  <h1 className={`text-sm font-bold ${themeClasses.accent}`}>
                    Sumbawa Surf Guide
                  </h1>
                </div>
                <button
                  onClick={closeMobileMenu}
                  type="button"
                  className={`p-2 rounded-lg ${themeClasses.buttonHover} ${themeClasses.text} focus:outline-none`}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Items */}
            <div 
              className={`mx-3 mt-2 p-4 ${themeClasses.cardBg} rounded-xl shadow-2xl border ${themeClasses.border} backdrop-blur-xl`}
              onClick={handleMenuContentClick}
            >
              <div className="space-y-2">
                {/* Home */}
                <button
                  onClick={handleHomeClick}
                  type="button"
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm focus:outline-none ${
                    showHome 
                      ? `${themeClasses.button}` 
                      : `${themeClasses.text} ${themeClasses.buttonHover}`
                  }`}
                >
                  🏠 Home
                </button>
                
                {/* Weather */}
                <button
                  onClick={handleWeatherClick}
                  type="button"
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm focus:outline-none ${
                    showWeather 
                      ? `${themeClasses.button}` 
                      : `${themeClasses.text} ${themeClasses.buttonHover}`
                  }`}
                >
                  🌤️ Weather
                </button>
                
                {/* Tides */}
                <button
                  onClick={handleTidesClick}
                  type="button"
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 text-sm focus:outline-none ${
                    showTides 
                      ? `${themeClasses.button}` 
                      : `${themeClasses.text} ${themeClasses.buttonHover}`
                  }`}
                >
                  🌊 Tides
                </button>
                
                {/* Admin */}
                <button
                  onClick={handleAdminClick}
                  type="button"
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm focus:outline-none ${
                    (showAdmin && isAdminLoggedIn)
                      ? `${themeClasses.button}` 
                      : `${themeClasses.text} ${themeClasses.buttonHover}`
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>{isAdminLoggedIn ? '⚙️ Admin Panel' : '🔐 Admin Login'}</span>
                </button>

                {/* Surf Spots Dropdown */}
                <div>
                  <button
                    onClick={toggleMobileSpots}
                    type="button"
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between font-medium text-sm focus:outline-none ${themeClasses.text} ${themeClasses.buttonHover}`}
                  >
                    <span>🏄‍♂️ Surf Spots</span>
                    <span className={`transform transition-transform duration-200 ${showMobileSpots ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  
                  {showMobileSpots && (
                    <div className="ml-4 mt-2 space-y-1 max-h-48 overflow-y-auto">
                      {spots.map((spot) => (
                        <button
                          key={spot.id}
                          onClick={() => handleSpotClick(spot)}
                          type="button"
                          className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 text-sm focus:outline-none ${themeClasses.textSecondary} ${themeClasses.buttonHover}`}
                        >
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{spot.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Theme Toggle in Mobile Menu */}
                <button
                  onClick={handleThemeToggle}
                  type="button"
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm focus:outline-none ${themeClasses.text} ${themeClasses.buttonHover}`}
                >
                  {getThemeIcon()}
                  <span>{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}