import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import InputBox from './components/InputBox';
import ChatMessage from './components/ChatMessage';
import WelcomeScreen from './components/WelcomeScreen';
import ChatHistory from './components/ChatHistory';
import { Message } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { Bot } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Prepare history for API
    const apiHistory = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // Call API (or mock)
    try {
      const response = await sendMessageToGemini(text, apiHistory);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.text,
        timestamp: new Date(),
        stockData: response.stockData
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I apologize, but I encountered an error while processing your request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsLoading(false);
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

      <main className="flex-1 overflow-y-auto relative scroll-smooth">
        <div className="max-w-3xl mx-auto px-4 py-8 min-h-full flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center">
               <WelcomeScreen onQuickAction={handleSend} />
            </div>
          ) : (
            <div className="flex flex-col pb-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex w-full justify-start mb-6 slide-up">
                  <div className="flex max-w-[80%] flex-row gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm ring-2 ring-blue-50">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                      <span className="text-sm text-gray-500 font-medium mr-2">Analyzing CSE data</span>
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