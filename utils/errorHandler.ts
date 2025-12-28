/**
 * Error types for better error handling
 */
export enum ErrorType {
  NOT_FOUND = 404,
  RATE_LIMIT = 429,
  SERVER_ERROR = 500,
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  [ErrorType.NOT_FOUND]: "I couldn't find that stock symbol. Please check the symbol and try again.",
  [ErrorType.RATE_LIMIT]: "We're receiving too many requests right now. Please wait a moment and try again.",
  [ErrorType.SERVER_ERROR]: "The CSE API is currently unavailable. Please try again later.",
  [ErrorType.NETWORK_ERROR]: "Unable to connect to the stock market data service. Please check your internet connection.",
  [ErrorType.TIMEOUT]: "The request took too long to complete. Please try again.",
  [ErrorType.UNKNOWN]: "An unexpected error occurred. Please try again."
};

/**
 * Determine error type from error object
 */
function getErrorType(error: any): ErrorType {
  // Check if it's a Response object with status
  if (error?.status) {
    switch (error.status) {
      case 404:
        return ErrorType.NOT_FOUND;
      case 429:
        return ErrorType.RATE_LIMIT;
      case 500:
      case 502:
      case 503:
      case 504:
        return ErrorType.SERVER_ERROR;
      default:
        return ErrorType.UNKNOWN;
    }
  }

  // Check if it's a fetch error
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return ErrorType.NETWORK_ERROR;
  }

  // Check for timeout
  if (error?.name === 'AbortError' || error?.message?.includes('timeout')) {
    return ErrorType.TIMEOUT;
  }

  return ErrorType.UNKNOWN;
}

/**
 * Get user-friendly error message from error object
 * 
 * @param error - The error object (can be Error, Response, or any)
 * @returns User-friendly error message
 */
export function getErrorMessage(error: any): string {
  const errorType = getErrorType(error);
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ErrorType.UNKNOWN];
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: any): boolean {
  return getErrorType(error) === ErrorType.RATE_LIMIT;
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return getErrorType(error) === ErrorType.NETWORK_ERROR;
}

/**
 * Check if error is recoverable (user can retry)
 */
export function isRecoverableError(error: any): boolean {
  const errorType = getErrorType(error);
  return [
    ErrorType.RATE_LIMIT,
    ErrorType.NETWORK_ERROR,
    ErrorType.TIMEOUT,
    ErrorType.SERVER_ERROR
  ].includes(errorType as ErrorType);
}
