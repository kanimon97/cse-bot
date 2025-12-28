import { StockData } from '../types';

// Base URL for CSE API
const CSE_API_BASE = import.meta.env.VITE_CSE_API_URL || 'https://www.cse.lk/api';

// Validate API configuration
if (!import.meta.env.VITE_CSE_API_URL) {
  console.warn('VITE_CSE_API_URL not set in .env.local, using default CSE API endpoint');
}

// Cache configuration
const CACHE_DURATION = 30000; // 30 seconds

// Cache structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Cache storage
const cache = new Map<string, CacheEntry<any>>();

// CSE API Response Types
interface CSECompanyInfo {
  symbol?: string;
  securityName?: string;
  lastTradedPrice?: number;
  change?: number;
  percentageChange?: number;
  openingPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  lastTradedTime?: string;
  previousClose?: number;
  turnover?: number;
  volume?: number;
}

interface CSETradeSummaryItem {
  symbol?: string;
  securityName?: string;
  lastTradedPrice?: number;
  change?: number;
  percentageChange?: number;
  openingPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  lastTradedTime?: string;
  previousClose?: number;
  turnover?: number;
  volume?: number;
}

/**
 * Get cached data if available and not expired
 */
function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

/**
 * Set cache data
 */
function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

/**
 * Map CSE API response to StockData interface
 */
function mapToStockData(cseData: CSECompanyInfo | CSETradeSummaryItem): StockData | null {
  try {
    if (!cseData.symbol || !cseData.securityName) {
      return null;
    }

    return {
      symbol: cseData.symbol,
      name: cseData.securityName,
      price: cseData.lastTradedPrice || 0,
      currency: 'LKR',
      change: cseData.change || 0,
      changePercent: cseData.percentageChange || 0,
      open: cseData.openingPrice || cseData.previousClose || 0,
      high: cseData.highPrice || 0,
      low: cseData.lowPrice || 0,
      lastUpdated: cseData.lastTradedTime || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error mapping CSE data to StockData:', error);
    return null;
  }
}

/**
 * Make POST request to CSE API
 */
async function cseApiRequest<T>(endpoint: string, body: any = {}): Promise<T | null> {
  try {
    const response = await fetch(`${CSE_API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error(`CSE API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error calling CSE API endpoint ${endpoint}:`, error);
    return null;
  }
}

/**
 * Get stock quote for a specific symbol
 */
export async function getStockQuote(symbol: string): Promise<StockData | null> {
  try {
    // Check cache first
    const cacheKey = `quote_${symbol.toUpperCase()}`;
    const cached = getCached<StockData>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from API
    const response = await cseApiRequest<CSECompanyInfo>('companyInfoSummery', {
      symbol: symbol.toUpperCase()
    });

    if (!response) {
      return null;
    }

    const stockData = mapToStockData(response);
    
    if (stockData) {
      setCache(cacheKey, stockData);
    }

    return stockData;
  } catch (error) {
    console.error(`Error fetching stock quote for ${symbol}:`, error);
    return null;
  }
}

/**
 * Search companies by query string
 */
export async function searchCompanies(query: string): Promise<StockData[]> {
  try {
    // Check cache first
    const cacheKey = `search_${query.toLowerCase()}`;
    const cached = getCached<StockData[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch all trade summary data
    const response = await cseApiRequest<{ data?: CSETradeSummaryItem[] }>('tradeSummary');

    if (!response || !response.data) {
      return [];
    }

    // Filter by query (search in symbol and name)
    const queryLower = query.toLowerCase();
    const filtered = response.data
      .filter(item => 
        item.symbol?.toLowerCase().includes(queryLower) ||
        item.securityName?.toLowerCase().includes(queryLower)
      )
      .map(mapToStockData)
      .filter((item): item is StockData => item !== null)
      .slice(0, 10); // Limit to 10 results

    setCache(cacheKey, filtered);
    return filtered;
  } catch (error) {
    console.error(`Error searching companies with query "${query}":`, error);
    return [];
  }
}

/**
 * Get top movers (gainers and losers combined)
 */
export async function getTopMovers(): Promise<StockData[]> {
  try {
    // Check cache first
    const cacheKey = 'top_movers';
    const cached = getCached<StockData[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch both gainers and losers
    const [gainersResponse, losersResponse] = await Promise.all([
      cseApiRequest<{ data?: CSETradeSummaryItem[] }>('topGainers'),
      cseApiRequest<{ data?: CSETradeSummaryItem[] }>('topLooses') // Note: API uses 'topLooses'
    ]);

    const movers: StockData[] = [];

    // Add gainers
    if (gainersResponse?.data) {
      const gainers = gainersResponse.data
        .map(mapToStockData)
        .filter((item): item is StockData => item !== null)
        .slice(0, 5);
      movers.push(...gainers);
    }

    // Add losers
    if (losersResponse?.data) {
      const losers = losersResponse.data
        .map(mapToStockData)
        .filter((item): item is StockData => item !== null)
        .slice(0, 5);
      movers.push(...losers);
    }

    setCache(cacheKey, movers);
    return movers;
  } catch (error) {
    console.error('Error fetching top movers:', error);
    return [];
  }
}

/**
 * Clear all cache entries
 */
export function clearCache(): void {
  cache.clear();
}
