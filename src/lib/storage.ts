import { SafeStorage } from './safe-storage';

export const isClient = () => typeof window !== 'undefined';

export const isStorageAvailable = (): boolean => {
  if (!isClient()) return false;
  
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

export const getItem = (key: string): string | null => SafeStorage.getItem(key);
export const setItem = (key: string, value: string): boolean => SafeStorage.setItem(key, value);
export const removeItem = (key: string): boolean => SafeStorage.removeItem(key);
export const clear = (): boolean => SafeStorage.clear();
export const getJSON = <T>(key: string, defaultValue: T): T => SafeStorage.getJSON(key, defaultValue);
export const setJSON = <T>(key: string, value: T): boolean => SafeStorage.setJSON(key, value); 