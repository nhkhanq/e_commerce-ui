export const APP_NAME = import.meta.env.VITE_APP_NAME || "Green Shop";
export const APP_DESCRIPTION =
  import.meta.env.VITE_APP_DESCRIPTION ||
  "A website offering eco-friendly and sustainable food products.";
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5173";

// Use relative path for production to avoid Mixed Content issues
export const BASE_URL = 
  import.meta.env.MODE === 'production' 
    ? "/api" 
    : (import.meta.env.VITE_BASE_URL || "http://103.101.162.14:8080");
