// Type declaration for global original fetch reference
declare global {
  interface Window {
    __originalFetch?: typeof fetch;
  }
}

export {};
