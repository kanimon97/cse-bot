import React from 'react';
import { X, FolderOpen, Plus, Settings, LogOut, MessageSquare } from 'lucide-react';
import { ChatSession } from '../types';

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat?: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ isOpen, onClose, onNewChat }) => {
  // Mock history data
  const history: ChatSession[] = [
    { id: '1', title: 'JKH Analysis Report', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: '2', title: 'Banking Sector Trends', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: '3', title: 'Top Gainers Query', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    { id: '4', title: 'Dialog Axiata Dividends', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel (Left Side) */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-[#f9f9f9] border-r border-gray-200 shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header Area */}
        <div className="p-4">
           <div className="flex items-center justify-between mb-4 md:hidden">
             <span className="font-semibold text-gray-500 text-sm">Menu</span>
             <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-md text-gray-500">
                <X className="w-5 h-5" />
             </button>
           </div>
           
           <button 
              onClick={() => {
                if(onNewChat) onNewChat();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-600 transition-all group"
           >
              <div className="p-1 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
                <Plus className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-blue-600 text-sm">New chat</span>
           </button>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Today</h3>
            <div className="space-y-1">
              {history.slice(0, 1).map((session) => (
                <button key={session.id} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-200/60 transition-colors group flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  <p className="font-medium text-gray-700 text-sm truncate flex-1">{session.title}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Yesterday</h3>
            <div className="space-y-1">
              {history.slice(1, 2).map((session) => (
                <button key={session.id} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-200/60 transition-colors group flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  <p className="font-medium text-gray-700 text-sm truncate flex-1">{session.title}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3">Previous 7 Days</h3>
            <div className="space-y-1">
              {history.slice(2).map((session) => (
                <button key={session.id} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-200/60 transition-colors group flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  <p className="font-medium text-gray-700 text-sm truncate flex-1">{session.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-3 border-t border-gray-200 bg-gray-50/50">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-200/60 transition-colors text-gray-700 text-sm">
                <Settings className="w-4 h-4 text-gray-500" />
                <span>Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-200/60 transition-colors text-gray-700 text-sm">
                <LogOut className="w-4 h-4 text-gray-500" />
                <span>Log out</span>
            </button>
        </div>
      </div>
    </>
  );
};

export default ChatHistory;