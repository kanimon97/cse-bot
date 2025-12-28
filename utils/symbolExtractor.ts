/**
 * Company name to symbol mapping
 */
const COMPANY_NAME_MAP: Record<string, string> = {
  // John Keells Holdings
  'JOHN KEELLS': 'JKH',
  'JOHN KEELLS HOLDINGS': 'JKH',
  'KEELLS': 'JKH',
  
  // Dialog Axiata
  'DIALOG': 'DIAL',
  'DIALOG AXIATA': 'DIAL',
  
  // Commercial Bank
  'COMMERCIAL BANK': 'COMB',
  'COMMERCIAL': 'COMB',
  'COMBANK': 'COMB',
  
  // Hatton National Bank
  'HATTON NATIONAL': 'HNB',
  'HATTON NATIONAL BANK': 'HNB',
  'HATTON': 'HNB',
};

/**
 * Known valid stock symbols for validation
 */
const KNOWN_SYMBOLS = new Set(['JKH', 'DIAL', 'COMB', 'HNB']);

/**
 * Extract stock symbol from text
 * Returns the first matched symbol or null if none found
 * 
 * @param text - The text to extract symbol from
 * @returns The extracted symbol in uppercase or null
 */
export function extractStockSymbol(text: string): string | null {
  if (!text) return null;
  
  const upperText = text.toUpperCase();
  
  // First, check for company name variations
  for (const [companyName, symbol] of Object.entries(COMPANY_NAME_MAP)) {
    if (upperText.includes(companyName)) {
      return symbol;
    }
  }
  
  // Then, use regex to find potential stock symbols (2-5 uppercase letters)
  const symbolRegex = /\b[A-Z]{2,5}\b/g;
  const matches = text.match(symbolRegex);
  
  if (matches) {
    // Return the first match that is a known symbol
    for (const match of matches) {
      if (KNOWN_SYMBOLS.has(match)) {
        return match;
      }
    }
    
    // If no known symbols found, return the first match anyway
    // (allows for discovering new symbols)
    return matches[0];
  }
  
  return null;
}

/**
 * Extract all stock symbols from text
 * Returns an array of all matched symbols
 * 
 * @param text - The text to extract symbols from
 * @returns Array of extracted symbols in uppercase
 */
export function extractAllStockSymbols(text: string): string[] {
  if (!text) return [];
  
  const symbols = new Set<string>();
  const upperText = text.toUpperCase();
  
  // Check for company name variations
  for (const [companyName, symbol] of Object.entries(COMPANY_NAME_MAP)) {
    if (upperText.includes(companyName)) {
      symbols.add(symbol);
    }
  }
  
  // Use regex to find potential stock symbols
  const symbolRegex = /\b[A-Z]{2,5}\b/g;
  const matches = text.match(symbolRegex);
  
  if (matches) {
    matches.forEach(match => symbols.add(match));
  }
  
  return Array.from(symbols);
}

/**
 * Check if text contains any stock symbol
 * 
 * @param text - The text to check
 * @returns True if any symbol is found
 */
export function containsStockSymbol(text: string): boolean {
  return extractStockSymbol(text) !== null;
}
