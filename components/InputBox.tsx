import React, { useState, useRef, useEffect } from 'react';
import { Send, BarChart3, TrendingUp, Bell } from 'lucide-react';

interface InputBoxProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ onSend, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  return (
    <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-xl z-40">
      <div className="max-w-3xl mx-auto relative">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 transition-shadow duration-200">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about JKH, Dialog, or market trends..."
            className="w-full px-4 py-3 pb-12 bg-transparent border-none focus:ring-0 resize-none text-gray-800 placeholder-gray-400 text-base max-h-[150px] min-h-[56px]"
            rows={1}
            disabled={isLoading}
          />
          
          {/* Quick Actions & Send Button Bar */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
            
            <div className="flex items-center gap-1 pl-1">
               <button 
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" 
                  title="Request Chart"
                  onClick={() => setText("Show me the chart for ")}
               >
                  <BarChart3 className="w-5 h-5" />
               </button>
               <button 
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors" 
                  title="Top Movers"
                  onClick={() => onSend("What are the top gainers today?")}
               >
                  <TrendingUp className="w-5 h-5" />
               </button>
               <button 
                  className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors" 
                  title="Set Alert"
                  onClick={() => setText("Set a price alert for ")}
               >
                  <Bell className="w-5 h-5" />
               </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-200
                ${text.trim() && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </div>
        </div>
        
        <div className="text-center mt-2">
            <span className="text-[10px] text-gray-400">AI can make mistakes. Verify important financial data.</span>
        </div>
      </div>
    </div>
  );
};

export default InputBox;