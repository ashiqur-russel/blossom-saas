/**
 * Error handling utilities
 * Centralizes error message extraction from HTTP errors
 */

export interface HttpError {
  error?: {
    message?: string | string[];
    error?: string;
  };
  message?: string;
}

/**
 * Extracts a user-friendly error message from an HTTP error object
 * @param error - The error object from HTTP request
 * @param defaultMessage - Default message if error cannot be extracted
 * @returns A user-friendly error message string
 */
export function extractErrorMessage(error: HttpError | any, defaultMessage: string = 'Unknown error'): string {
  if (!error) {
    return defaultMessage;
  }

  // Check for error.error.message (NestJS format)
  if (error.error) {
    if (Array.isArray(error.error.message)) {
      return error.error.message.join(', ');
    }
    if (typeof error.error.message === 'string') {
      return error.error.message;
    }
    if (error.error.error) {
      return error.error.error;
    }
  }

  // Check for direct message property
  if (error.message) {
    return error.message;
  }

  return defaultMessage;
}

/**
 * Creates a formatted error message with context
 * @param action - The action that failed (e.g., 'create week', 'update sales entry')
 * @param error - The error object
 * @param defaultMessage - Default message if error cannot be extracted
 * @returns A formatted error message
 */
export function formatErrorMessage(
  action: string,
  error: HttpError | any,
  defaultMessage: string = 'Unknown error',
): string {
  const errorMsg = extractErrorMessage(error, defaultMessage);
  return `Failed to ${action}: ${errorMsg}`;
}

