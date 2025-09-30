import { setupWorker } from 'msw/browser';
import { handlers } from './handlers'; // handlers now contains both job and candidate handlers

export const worker = setupWorker(...handlers);
