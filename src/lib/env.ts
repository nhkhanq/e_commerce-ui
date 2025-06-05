// Environment configuration for safe deployment
export const ENV = {
  // Check if we're in browser environment
  isBrowser: typeof window !== 'undefined',
  
  // Check if we're in development
  isDev: import.meta.env.DEV,
  
  // Check if we're in production
  isProd: import.meta.env.PROD,
  
  // Check if storage is available
  hasStorage: (() => {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return false;
      }
      const testKey = '__env_storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  })(),
  
  // Safe console methods
  log: (...args: any[]) => {
    if (typeof console !== 'undefined' && console.log) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (typeof console !== 'undefined' && console.error) {
      console.error(...args);
    }
  }
};

// Safe window access
export const safeWindow = ENV.isBrowser ? window : undefined;

// Safe document access  
export const safeDocument = ENV.isBrowser ? document : undefined; 