import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

export function parseErrorResponse(error: any): {
  error: string;
  message: string;
} {
  try {
    if (typeof error === 'string') {
      return JSON.parse(error);
    }

    if (typeof error === 'object' && error !== null) {
      return error;
    }
  } catch (e) {
    console.warn('Failed to parse error response:', e);
  }
  return { error: 'Unknown Error', message: 'Something went wrong' };
}

export function handleError(
  err: HttpErrorResponse,
  messageService: MessageService
) {
  const parsedError = parseErrorResponse(err.error);
  const errorSummary = parsedError?.error ?? 'Failed!';
  const errorMessage =
    parsedError?.message ?? 'Oops! Something went wrong. Please try again';

  messageService.add({
    summary: errorSummary,
    life: 3000,
    severity: 'error',
    detail: errorMessage,
  });

  console.error(err);
}
