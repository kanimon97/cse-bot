import { GoogleGenAI } from "@google/genai";
import { StockData } from "../types";

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

export const sendMessageToGemini = async (
  message: string, 
  history: { role: string; parts: { text: string }[] }[]
): Promise<{ text: string; stockData?: StockData }> => {
  
  // Check for mock triggers to demonstrate the UI component
  const upperMsg = message.toUpperCase();
  let stockData: StockData | undefined;

  if (upperMsg.includes("JKH") || upperMsg.includes("JOHN KEELLS")) {
    stockData = MOCK_STOCKS.JKH;
  } else if (upperMsg.includes("DIALOG") || upperMsg.includes("DIAL")) {
    stockData = MOCK_STOCKS.DIAL;
  } else if (upperMsg.includes("COMB") || upperMsg.includes("COMMERCIAL")) {
    stockData = MOCK_STOCKS.COMB;
  }

  try {
    if (!process.env.API_KEY) {
      // Fallback if no API key is provided for the UI demo
      return {
        text: `I can certainly help you with that. ${stockData ? `Here is the latest data I have for ${stockData.name}.` : "However, I need a valid API key to generate a real AI response. Please configure your environment."}`,
        stockData
      };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    
    return {
      text: result.text,
      stockData // Attach the mock data if matched, effectively "enhancing" the AI response
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I'm having trouble connecting to the CSE analysis server right now. Please try again in a moment.",
      stockData
    };
  }
};