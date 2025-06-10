const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};

// For production debugging (can be enabled via feature flag)
export const productionLogger = {
  info: (message: string, data?: any) => {
    // Can be sent to monitoring service like Sentry, LogRocket, etc.
    if (isDevelopment) {
      console.log(`[PROD_INFO] ${message}`, data);
    }
  },
  
  error: (message: string, error?: any) => {
    // Always log errors even in production
    console.error(`[PROD_ERROR] ${message}`, error);
  }
}; 