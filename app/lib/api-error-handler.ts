import { toast } from 'sonner';
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';

interface ErrorMessages {
  unauthorized?: string;
  serverError?: string;
  defaultError?: string;
}

interface ApiErrorHandlerOptions<T extends FieldValues> {
  /** React Hook Form setError function for mapping validation errors to fields */
  setError?: UseFormSetError<T>;
  /** Custom error messages */
  errorMessages?: ErrorMessages;
  /** Custom field error mapping function for 422 validation errors */
  fieldErrorMapper?: (errors: Record<string, string[]>, setError: UseFormSetError<T>) => void;
  /** Callback when a 401 error occurs (e.g., redirect to login) */
  onUnauthorized?: () => void;
}

/**
 * Global API error handler for consistent error handling across the application.
 *
 * @param response - The fetch Response object
 * @param options - Configuration options for error handling
 * @returns A promise that resolves to true if the error was handled, false otherwise
 *
 * @example
 * ```tsx
 * const response = await fetch('/api/endpoint', { method: 'POST', body: ... });
 *
 * if (!response.ok) {
 *   await handleApiError(response, {
 *     setError,
 *     errorMessages: {
 *       unauthorized: t.errors.unauthorized,
 *       serverError: t.errors.serverError,
 *     },
 *   });
 *   return;
 * }
 * ```
 */
export async function handleApiError<T extends FieldValues>(
  response: Response,
  options: ApiErrorHandlerOptions<T> = {}
): Promise<boolean> {
  const {
    setError,
    errorMessages = {},
    fieldErrorMapper,
    onUnauthorized,
  } = options;

  try {
    // Handle 401 Unauthorized
    if (response.status === 401) {
      toast.error(
        errorMessages.unauthorized || 'Your session has expired. Please log in again.'
      );
      onUnauthorized?.();
      return true;
    }

    // Handle 422 Validation Errors
    if (response.status === 422 && setError) {
      const errorData = await response.json();

      if (fieldErrorMapper && errorData.errors) {
        // Use custom field error mapper if provided
        fieldErrorMapper(errorData.errors, setError);
      } else if (errorData.errors) {
        // Default field error mapping
        Object.entries(errorData.errors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(field as Path<T>, {
              message: messages[0],
            });
          }
        });
      }
      return true;
    }

    // Handle 500 and other server errors
    if (response.status >= 500) {
      toast.error(
        errorMessages.serverError || 'An error occurred. Please try again.'
      );
      return true;
    }

    // Handle other errors with default error message
    toast.error(
      errorMessages.defaultError || 'An error occurred. Please try again.'
    );
    return true;

  } catch (error) {
    console.error('Error handling API error:', error);
    toast.error(
      errorMessages.serverError || 'An error occurred. Please try again.'
    );
    return true;
  }
}

/**
 * Wrapper for fetch that automatically handles common API errors.
 *
 * @param url - The URL to fetch
 * @param init - Fetch init options
 * @param errorOptions - Error handling options
 * @returns The response if successful, or throws an error
 *
 * @example
 * ```tsx
 * try {
 *   const response = await fetchWithErrorHandling('/api/endpoint', {
 *     method: 'POST',
 *     body: JSON.stringify(data),
 *   }, {
 *     errorMessages: {
 *       unauthorized: t.errors.unauthorized,
 *     },
 *   });
 *
 *   const result = await response.json();
 *   // Handle success
 * } catch (error) {
 *   // Error already handled by handleApiError
 * }
 * ```
 */
export async function fetchWithErrorHandling<T extends FieldValues>(
  url: string,
  init?: RequestInit,
  errorOptions?: ApiErrorHandlerOptions<T>
): Promise<Response> {
  const response = await fetch(url, init);

  if (!response.ok) {
    await handleApiError(response, errorOptions);
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response;
}
