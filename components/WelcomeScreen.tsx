import React from 'react';
import { Sparkles } from 'lucide-react';

interface WelcomeScreenProps {
  onQuickAction: (text: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onQuickAction }) => {
  const suggestions = [
    "What's JKH trading at?",
    "Show me top gainers today",
    "Compare JKH vs Dialog",
    "How's the banking sector doing?",
    "Explain what John Keells does",
    "What's the current ASPI?"
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
        <Sparkles className="w-8 h-8 text-blue-600" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
        Ask me anything about <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">CSE</span>
      </h1>
      
      <p className="text-gray-500 max-w-md mb-10 text-lg">
        Get real-time prices, market analysis, and insights on Sri Lankan stocks.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onQuickAction(suggestion)}
            className="px-6 py-4 text-left text-sm md:text-base text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200 group"
          >
            <span className="block font-medium group-hover:translate-x-1 transition-transform">{suggestion}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;