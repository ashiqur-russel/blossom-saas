/**
 * Error handling utilities
 * Centralizes error message extraction from HTTP errors
 */

import { HttpErrorResponse } from '@angular/common/http';

export interface HttpError {
  error?: {
    message?: string | string[];
    error?: string;
  };
  message?: string;
  status?: number;
}

/**
 * Extracts a user-friendly error message from an HTTP error object
 * @param error - The error object from HTTP request
 * @param defaultMessage - Default message if error cannot be extracted
 * @returns A user-friendly error message string
 */
export function extractErrorMessage(error: HttpError | HttpErrorResponse | any, defaultMessage: string = 'Unknown error'): string {
  if (!error) {
    return defaultMessage;
  }

  // Handle network errors (server unavailable, CORS, etc.)
  // Status 0 typically means the request couldn't be completed
  if (error.status === 0 || (error instanceof HttpErrorResponse && error.status === 0)) {
    return "We're having trouble connecting to the server. Please try again shortly.";
  }

  // Handle timeout errors
  if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
    return "We're having trouble connecting to the server. Please try again shortly.";
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

  // Check for direct message property (but filter out technical HTTP error messages)
  if (error.message) {
    // Filter out technical Angular HTTP error messages
    if (error.message.includes('Http failure response') || error.message.includes('Unknown Error')) {
      // If it's a network error, return user-friendly message
      if (error.status === 0 || !error.status) {
        return "We're having trouble connecting to the server. Please try again shortly.";
      }
      // For other HTTP errors, try to extract meaningful info
      if (error.status === 404) {
        return 'The requested resource was not found.';
      }
      if (error.status === 500) {
        return 'Server error. Please try again later.';
      }
      return 'An error occurred. Please try again.';
    }
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


