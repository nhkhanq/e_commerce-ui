// Safe storage wrapper to prevent deployment errors
export class SafeStorage {
  private static isAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return false;
      }
      
      const testKey = '__storage_availability_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  static getItem(key: string): string | null {
    if (!this.isAvailable()) return null;
    
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  static setItem(key: string, value: string): boolean {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  static removeItem(key: string): boolean {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  static clear(): boolean {
    if (!this.isAvailable()) return false;
    
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }

  static getJSON<T>(key: string, defaultValue: T): T {
    const item = this.getItem(key);
    if (!item) return defaultValue;
    
    try {
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  static setJSON<T>(key: string, value: T): boolean {
    try {
      return this.setItem(key, JSON.stringify(value));
    } catch {
      return false;
    }
  }
}

// Legacy exports for backward compatibility
export const getItem = SafeStorage.getItem.bind(SafeStorage);
export const setItem = SafeStorage.setItem.bind(SafeStorage);
export const removeItem = SafeStorage.removeItem.bind(SafeStorage);
export const clear = SafeStorage.clear.bind(SafeStorage);
export const getJSON = SafeStorage.getJSON.bind(SafeStorage);
export const setJSON = SafeStorage.setJSON.bind(SafeStorage); 