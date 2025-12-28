import { GoogleGenAI } from "@google/genai";
import { StockData } from "../types";
import { getStockQuote } from "./cseApiService";

// Mock data for demonstration purposes since we don't have a real-time CSE API attached
const MOCK_STOCKS: Record<string, StockData> = {
  JKH: {
    symbol: "JKH",
    name: "JOHN KEELLS HOLDINGS PLC",
    price: 150.50,
    currency: "LKR",
    change: 2.30,
    changePercent: 1.55,
    open: 148.20,
    high: 151.00,
    low: 147.80,
    lastUpdated: "2 mins ago"
  },
  DIAL: {
    symbol: "DIAL",
    name: "DIALOG AXIATA PLC",
    price: 9.20,
    currency: "LKR",
    change: -0.10,
    changePercent: -1.08,
    open: 9.30,
    high: 9.40,
    low: 9.10,
    lastUpdated: "1 min ago"
  },
  COMB: {
    symbol: "COMB",
    name: "COMMERCIAL BANK OF CEYLON PLC",
    price: 88.90,
    currency: "LKR",
    change: 0.50,
    changePercent: 0.56,
    open: 88.00,
    high: 89.50,
    low: 88.00,
    lastUpdated: "Just now"
  }
};

const SYSTEM_INSTRUCTION = `You are a helpful and knowledgeable stock market assistant for the Colombo Stock Exchange (CSE). 
Your responses should be professional, concise, and formatted clearly. 
When users ask about market trends, share price movements, or company details, provide insightful analysis.
Use bold text for emphasis on key figures.
If you don't know the real-time price (as you are an AI without live market access), you can mention that you are providing general information or historical context, but for this demo, you can invent plausible recent context if needed.`;

/**
 * Extract stock symbol from user message
 */
const extractStockSymbol = (message: string): string | null => {
  const upperMsg = message.toUpperCase();
  
  // Check for known symbols in MOCK_STOCKS
  const knownSymbols = Object.keys(MOCK_STOCKS);
  for (const symbol of knownSymbols) {
    if (upperMsg.includes(symbol)) {
      return symbol;
    }
  }
  
  // Check for company names
  if (upperMsg.includes("JOHN KEELLS")) return "JKH";
  if (upperMsg.includes("DIALOG")) return "DIAL";
  if (upperMsg.includes("COMMERCIAL")) return "COMB";
  
  return null;
};

export const sendMessageToGemini = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[]
): Promise<{ text: string; stockData?: StockData }> => {
  
  // Try to extract stock symbol from message
  const symbol = extractStockSymbol(message);
  let stockData: StockData | undefined;

  // If symbol detected, try to fetch real CSE data
  if (symbol) {
    try {
      const realData = await getStockQuote(symbol);
      if (realData) {
        stockData = realData;
      } else {
        // Fallback to mock data if API fails
        stockData = MOCK_STOCKS[symbol];
      }
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      // Fallback to mock data on error
      stockData = MOCK_STOCKS[symbol];
    }
  }

  try {
    if (!process.env.API_KEY && !import.meta.env.VITE_GEMINI_API_KEY) {
      // Fallback if no API key is provided for the UI demo
      return {
        text: `I can certainly help you with that. ${stockData ? `Here is the latest data I have for ${stockData.name}.` : "However, I need a valid API key to generate a real AI response. Please add VITE_GEMINI_API_KEY to your .env.local file."}`,
        stockData
      };
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
    const ai = new GoogleGenAI({ apiKey });
    
    // Prepare message with stock data context if available
    let contextualMessage = message;
    if (stockData) {
      contextualMessage = `${message}\n\n[Context: Current stock data for ${stockData.symbol} - ${stockData.name}: Price: ${stockData.price} ${stockData.currency}, Change: ${stockData.change} (${stockData.changePercent}%), Open: ${stockData.open}, High: ${stockData.high}, Low: ${stockData.low}, Last Updated: ${stockData.lastUpdated}]`;
    }
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: contextualMessage });
    
    return {
      text: result.text,
      stockData // Attach the stock data (real CSE or mock fallback)
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I'm having trouble connecting to the CSE analysis server right now. Please try again in a moment.",
      stockData
    };
  }
};