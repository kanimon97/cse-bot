import React from 'react';
import { Message } from '../types';
import { Bot, User, AlertCircle, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import StockCard from './StockCard';

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry }) => {
  const isUser = message.role === 'user';
  const isError = message.isError && !isUser;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 slide-up px-2 sm:px-0`}>
      <div className={`flex max-w-[95%] sm:max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2 sm:gap-3 items-start`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm 
          ${isUser ? 'hidden' : isError ? 'bg-red-50 ring-2 ring-red-100' : 'bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-blue-50'}`}>
          {isUser ? (
             <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          ) : isError ? (
             <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          ) : (
             <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0 flex-1`}>
          <div
            className={`px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-sm text-sm sm:text-[15px] leading-relaxed break-words max-w-full
              ${isUser 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm' 
                : isError
                ? 'bg-red-50 border-2 border-red-200 text-red-900 rounded-bl-sm'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
              }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
               <div className="prose prose-sm prose-blue max-w-none prose-p:my-1 prose-headings:my-2">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </div>
            )}
          </div>

          {/* Retry Button for Errors */}
          {isError && onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          )}

          {/* Stock Card Attachment (Only for AI) */}
          {!isUser && !isError && message.stockData && (
            <StockCard data={message.stockData} />
          )}
          
          {/* Timestamp */}
          <span className={`text-[10px] mt-1 px-1 ${isUser ? 'text-right' : 'text-left'} ${isError ? 'text-red-400' : 'text-gray-400'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;