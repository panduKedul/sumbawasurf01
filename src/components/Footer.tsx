import React from 'react';
import { Waves, Heart, MapPin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function Footer() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <footer className={`${themeClasses.footerBg} ${themeClasses.footerBorder} mt-auto`}>
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className={`p-1.5 sm:p-2 ${themeClasses.headerBg} rounded-lg shadow-sm`}>
                <Waves className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className={`text-sm sm:text-base lg:text-lg font-bold ${themeClasses.accent}`}>
                  Sumbawa Surf Guide
                </h3>
                <p className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>West Sumbawa</p>
              </div>
            </div>
            <p className={`text-xs sm:text-sm ${themeClasses.textSecondary} max-w-xs mx-auto md:mx-0`}>
              Your ultimate guide to the best surf spots in West Sumbawa, Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className={`${themeClasses.footerText} font-semibold mb-3 sm:mb-4 text-sm sm:text-base`}>Quick Links</h4>
            <div className="space-y-1 sm:space-y-2">
              <p className={`text-xs sm:text-sm ${themeClasses.textSecondary} hover:${themeClasses.accent} transition-colors cursor-pointer`}>
                Surf Spots
              </p>
              <p className={`text-xs sm:text-sm ${themeClasses.textSecondary} hover:${themeClasses.accent} transition-colors cursor-pointer`}>
                Weather Maps
              </p>
              <p className={`text-xs sm:text-sm ${themeClasses.textSecondary} hover:${themeClasses.accent} transition-colors cursor-pointer`}>
                Tide Information
              </p>
            </div>
          </div>

          {/* Location Info */}
          <div className="text-center md:text-right">
            <h4 className={`${themeClasses.footerText} font-semibold mb-3 sm:mb-4 text-sm sm:text-base`}>Location</h4>
            <div className="flex items-center justify-center md:justify-end space-x-2 mb-1 sm:mb-2">
              <MapPin className={`w-3 h-3 sm:w-4 sm:h-4 ${themeClasses.accent}`} />
              <span className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>West Sumbawa, Indonesia</span>
            </div>
            <p className={`text-xs sm:text-sm ${themeClasses.textSecondary}`}>
              Discover world-class surf breaks
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t ${themeClasses.footerBorder} mt-4 sm:mt-6 pt-3 sm:pt-4`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className={`text-xs sm:text-sm ${themeClasses.textSecondary} mb-3 sm:mb-4 md:mb-0`}>
              © 2025 Sumbawa Surf Guide. All rights reserved.
            </p>
            <div className={`flex items-center space-x-2 text-xs sm:text-sm ${themeClasses.textSecondary}`}>
              <span>Built with</span>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 fill-current" />
              <span>for the surfing community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}