import React, { useState } from 'react';
import { TrendingUp, PlusCircle, Menu, X, User, PanelLeft } from 'lucide-react';

interface HeaderProps {
  onToggleHistory: () => void;
  onNewChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleHistory, onNewChat }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-gray-200 bg-white/80 backdrop-blur-lg transition-all duration-200">
      <div className="flex items-center justify-between h-full px-4 max-w-7xl mx-auto">
        
        {/* Left Area: Sidebar Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleHistory}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors hidden md:block"
            aria-label="Toggle Sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">CSE AI</span>
          </div>
        </div>

        {/* Center Ticker (Desktop Only) */}
        <div className="hidden md:flex items-center space-x-6 text-sm overflow-hidden mask-linear-fade">
          <div className="flex items-center space-x-2 animate-ticker">
            <span className="font-semibold text-gray-700">ASPI</span>
            <span className="text-green-600 font-medium">12,345.80 ▲ +1.2%</span>
            <span className="text-gray-300">|</span>
            <span className="font-semibold text-gray-700">S&P SL20</span>
            <span className="text-red-500 font-medium">3,450.20 ▼ -0.4%</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={onNewChat}
              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* User Avatar */}
          <button className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center hover:ring-2 hover:ring-offset-2 hover:ring-blue-50 transition-all ml-2 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0">
             <User className="w-5 h-5 text-gray-500" />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-500 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg p-4 flex flex-col gap-2 animate-in slide-in-from-top-4 duration-200 z-[45]">
          <button 
            onClick={() => { onToggleHistory(); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 text-gray-700 min-h-[44px] text-left"
          >
            <PanelLeft className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">History</span>
          </button>
          <button 
            onClick={() => { onNewChat(); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-blue-50 text-blue-600 min-h-[44px] text-left"
          >
            <PlusCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">New Chat</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;