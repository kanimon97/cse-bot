import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import InputBox from './components/InputBox';
import ChatMessage from './components/ChatMessage';
import WelcomeScreen from './components/WelcomeScreen';
import ChatHistory from './components/ChatHistory';
import { Message } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { useConversationManager } from './hooks/useConversationManager';
import { Bot } from 'lucide-react';

const App: React.FC = () => {
  const { messages, addMessage, clearHistory, getApiHistory } = useConversationManager();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, loadingMessage]);

  const handleSend = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    addMessage(userMsg);
    setIsLoading(true);
    setLoadingMessage('Fetching CSE data');

    // Get conversation history in API format
    const apiHistory = getApiHistory();

    // Call API (or mock)
    try {
      // Update loading message before calling Gemini
      setLoadingMessage('Analyzing');
      
      const response = await sendMessageToGemini(text, apiHistory);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.text,
        timestamp: new Date(),
        stockData: response.stockData,
        isError: false
      };
      
      addMessage(aiMsg);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I apologize, but I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      addMessage(errorMsg);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleRetry = () => {
    // Find the last user message and resend it
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (lastUserMessage) {
      handleSend(lastUserMessage.content);
    }
  };

  const handleNewChat = () => {
    clearHistory();
    setIsLoading(false);
    setLoadingMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <Header 
        onToggleHistory={() => setHistoryOpen(true)} 
        onNewChat={handleNewChat}
      />

      <ChatHistory 
        isOpen={historyOpen} 
        onClose={() => setHistoryOpen(false)} 
        onNewChat={handleNewChat}
      />

      <main className="flex-1 overflow-y-auto relative scroll-smooth pb-2">
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-full flex flex-col pb-32">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center pb-24">
               <WelcomeScreen onQuickAction={handleSend} />
            </div>
          ) : (
            <div className="flex flex-col">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} onRetry={msg.isError ? handleRetry : undefined} />
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex w-full justify-start mb-6 slide-up px-2 sm:px-0">
                  <div className="flex max-w-[95%] sm:max-w-[80%] flex-row gap-2 sm:gap-3 items-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm ring-2 ring-blue-50">
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-3 sm:px-5 sm:py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                      <span className="text-sm text-gray-500 font-medium mr-2">{loadingMessage}</span>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce bounce-delay-1"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce bounce-delay-2"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      <InputBox onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default App;