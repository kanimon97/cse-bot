export interface StockData {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  lastUpdated: string;
}

export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  stockData?: StockData;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}