import React from 'react';
import { Waves, Heart, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-200 border-t border-dark-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-neon-blue to-primary-600 rounded-lg shadow-lg">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-neon-blue to-white bg-clip-text text-transparent">
                  Sumbawa Surf Guide
                </h3>
                <p className="text-xs text-gray-400">West Sumbawa</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-xs mx-auto md:mx-0">
              Your ultimate guide to the best surf spots in West Sumbawa, Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-400 hover:text-neon-blue transition-colors cursor-pointer">
                Surf Spots
              </p>
              <p className="text-sm text-gray-400 hover:text-neon-blue transition-colors cursor-pointer">
                Weather Maps
              </p>
              <p className="text-sm text-gray-400 hover:text-neon-blue transition-colors cursor-pointer">
                Tide Information
              </p>
            </div>
          </div>

          {/* Location Info */}
          <div className="text-center md:text-right">
            <h4 className="text-white font-semibold mb-4">Location</h4>
            <div className="flex items-center justify-center md:justify-end space-x-2 mb-2">
              <MapPin className="w-4 h-4 text-neon-blue" />
              <span className="text-sm text-gray-400">West Sumbawa, Indonesia</span>
            </div>
            <p className="text-xs text-gray-400">
              Discover world-class surf breaks
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-dark-400 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2025 Sumbawa Surf Guide. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
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