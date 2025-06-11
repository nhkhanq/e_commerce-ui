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

export const productionLogger = {
  info: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`[PROD_INFO] ${message}`, data);
    }
  },
  
  error: (message: string, error?: any) => {
    console.error(`[PROD_ERROR] ${message}`, error);
  }
}; 