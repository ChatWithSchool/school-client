import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { resetData } from '../mocks/data';
import { server } from '../mocks/server';

const nativeFetch = globalThis.fetch.bind(globalThis);
const nativeAbortController =
  (globalThis as typeof globalThis & { AbortController?: typeof AbortController }).AbortController ??
  AbortController;
const nativeAbortSignal =
  (globalThis as typeof globalThis & { AbortSignal?: typeof AbortSignal }).AbortSignal ?? AbortSignal;
const nativeRequest = (globalThis as typeof globalThis & { Request?: typeof Request }).Request ?? Request;
const nativeResponse =
  (globalThis as typeof globalThis & { Response?: typeof Response }).Response ?? Response;
const nativeHeaders =
  (globalThis as typeof globalThis & { Headers?: typeof Headers }).Headers ?? Headers;

class SafeRequest extends nativeRequest {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    if (init && 'signal' in init) {
      const { signal: _signal, ...rest } = init as RequestInit & { signal?: AbortSignal };
      super(input, rest as RequestInit);
      return;
    }
    super(input, init);
  }
}

const patchWebRuntime = (target: Record<string, unknown>) => {
  Object.defineProperties(target, {
    AbortController: {
      value: nativeAbortController,
      writable: true,
      configurable: true,
    },
    AbortSignal: {
      value: nativeAbortSignal,
      writable: true,
      configurable: true,
    },
    Request: {
      value: SafeRequest,
      writable: true,
      configurable: true,
    },
    Response: {
      value: nativeResponse,
      writable: true,
      configurable: true,
    },
    Headers: {
      value: nativeHeaders,
      writable: true,
      configurable: true,
    },
    fetch: {
      value: (input: RequestInfo | URL, init?: RequestInit) => {
        if (init && 'signal' in init) {
          const { signal: _signal, ...rest } = init as RequestInit & { signal?: AbortSignal };
          return nativeFetch(input, rest as RequestInit);
        }
        return nativeFetch(input, init);
      },
      writable: true,
      configurable: true,
    },
  });
};

patchWebRuntime(globalThis);
if (typeof global !== 'undefined') patchWebRuntime(global as typeof globalThis & Record<string, unknown>);
if (typeof window !== 'undefined') patchWebRuntime(window as typeof window & Record<string, unknown>);
if (typeof self !== 'undefined') patchWebRuntime(self as typeof self & Record<string, unknown>);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  vi.useRealTimers();
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
  document.body.innerHTML = '';
  server.resetHandlers();
  resetData();
  localStorage.clear();
});
afterAll(() => server.close());

// jsdom lacks a few browser APIs that the Radix primitives in components/ui call
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
Element.prototype.scrollIntoView ??= () => undefined;
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.releasePointerCapture ??= () => undefined;
