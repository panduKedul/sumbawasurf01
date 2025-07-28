import React from 'react';
import { Waves, Heart, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className={`${useTheme().getThemeClasses().cardBg} border-t ${useTheme().getThemeClasses().border} mt-auto`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className={`p-1.5 sm:p-2 ${useTheme().getThemeClasses().headerBg} rounded-lg shadow-lg`}>
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`text-sm sm:text-lg font-bold ${useTheme().getThemeClasses().accent}`}>
                  Sumbawa Surf Guide
                </h3>
                <p className={`text-xs ${useTheme().getThemeClasses().textSecondary}`}>West Sumbawa</p>
              </div>
            </div>
            <p className={`text-xs sm:text-sm ${useTheme().getThemeClasses().textSecondary} max-w-xs mx-auto md:mx-0`}>
              Your ultimate guide to the best surf spots in West Sumbawa, Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className={`${useTheme().getThemeClasses().text} font-semibold mb-3 sm:mb-4 text-sm sm:text-base`}>Quick Links</h4>
            <div className="space-y-1 sm:space-y-2">
              <p className={`text-xs sm:text-sm ${useTheme().getThemeClasses().textSecondary} hover:${useTheme().getThemeClasses().accent} transition-colors cursor-pointer`}>
                Surf Spots
              </p>
              <p className={`text-xs sm:text-sm ${useTheme().getThemeClasses().textSecondary} hover:${useTheme().getThemeClasses().accent} transition-colors cursor-pointer`}>
                Weather Maps
              </p>
              <p className={`text-xs sm:text-sm ${useTheme().getThemeClasses().textSecondary} hover:${useTheme().getThemeClasses().accent} transition-colors cursor-pointer`}>
                Tide Information
              </p>
            </div>
          </div>

          {/* Location Info */}
          <div className="text-center md:text-right">
            <h4 className={`${useTheme().getThemeClasses().text} font-semibold mb-3 sm:mb-4 text-sm sm:text-base`}>Location</h4>
            <div className="flex items-center justify-center md:justify-end space-x-2 mb-1 sm:mb-2">
              <MapPin className={`w-3 h-3 sm:w-4 sm:h-4 ${useTheme().getThemeClasses().accent}`} />
              <span className={`text-xs sm:text-sm ${useTheme().getThemeClasses().textSecondary}`}>West Sumbawa, Indonesia</span>
            </div>
            <p className={`text-xs ${useTheme().getThemeClasses().textSecondary}`}>
              Discover world-class surf breaks
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t ${useTheme().getThemeClasses().border} mt-4 sm:mt-6 lg:mt-8 pt-3 sm:pt-4 lg:pt-6`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className={`text-xs sm:text-sm ${useTheme().getThemeClasses().textSecondary} mb-3 sm:mb-4 md:mb-0`}>
              © 2025 Sumbawa Surf Guide. All rights reserved.
            </p>
            <div className={`flex items-center space-x-2 text-xs sm:text-sm ${useTheme().getThemeClasses().textSecondary}`}>
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>for the surfing community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}