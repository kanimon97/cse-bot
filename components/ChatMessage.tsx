import React from 'react';
import { Message } from '../types';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import StockCard from './StockCard';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 slide-up`}>
      <div className={`flex max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 items-start`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm 
          ${isUser ? 'hidden' : 'bg-gradient-to-br from-blue-500 to-indigo-600 ring-2 ring-blue-50'}`}>
          {isUser ? (
             <User className="w-5 h-5 text-gray-600" />
          ) : (
             <Bot className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed
              ${isUser 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm' 
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

          {/* Stock Card Attachment (Only for AI) */}
          {!isUser && message.stockData && (
            <StockCard data={message.stockData} />
          )}
          
          {/* Timestamp */}
          <span className={`text-[10px] text-gray-400 mt-1 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;