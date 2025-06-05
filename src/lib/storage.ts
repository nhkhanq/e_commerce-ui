// SSR-safe localStorage utilities

export const isClient = () => typeof window !== 'undefined';

export const getItem = (key: string): string | null => {
  if (!isClient()) return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting item from localStorage: ${key}`, error);
    return null;
  }
};

export const setItem = (key: string, value: string): boolean => {
  if (!isClient()) return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting item in localStorage: ${key}`, error);
    return false;
  }
};

export const removeItem = (key: string): boolean => {
  if (!isClient()) return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage: ${key}`, error);
    return false;
  }
};

export const clear = (): boolean => {
  if (!isClient()) return false;
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage', error);
    return false;
  }
};

export const getJSON = <T>(key: string, defaultValue: T): T => {
  const item = getItem(key);
  if (!item) return defaultValue;
  
  try {
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error parsing JSON from localStorage: ${key}`, error);
    return defaultValue;
  }
};

export const setJSON = <T>(key: string, value: T): boolean => {
  try {
    return setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error stringifying JSON for localStorage: ${key}`, error);
    return false;
  }
}; 