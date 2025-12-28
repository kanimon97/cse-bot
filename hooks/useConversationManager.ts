import { useState, useEffect } from 'react';
import { Message } from '../types';

const STORAGE_KEY = 'cse_chat_messages';
const MAX_HISTORY_LENGTH = 20;

interface ConversationManager {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearHistory: () => void;
  getApiHistory: () => { role: string; parts: { text: string }[] }[];
}

/**
 * Custom hook to manage conversation messages with localStorage persistence
 */
export function useConversationManager(): ConversationManager {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }, [messages]);

  /**
   * Add a new message to the conversation
   */
  const addMessage = (message: Message) => {
    setMessages(prev => {
      const updated = [...prev, message];
      // Limit to last 20 messages
      return updated.slice(-MAX_HISTORY_LENGTH);
    });
  };

  /**
   * Clear all conversation history
   */
  const clearHistory = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  /**
   * Get conversation history in Gemini API format
   * Excludes loading messages and formats for API consumption
   */
  const getApiHistory = (): { role: string; parts: { text: string }[] }[] => {
    return messages
      .filter(msg => !msg.isLoading) // Exclude loading messages
      .slice(-MAX_HISTORY_LENGTH) // Limit to last 20 messages
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));
  };

  return {
    messages,
    addMessage,
    clearHistory,
    getApiHistory
  };
}
