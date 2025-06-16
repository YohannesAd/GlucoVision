import AsyncStorage from '@react-native-async-storage/async-storage';
// Note: You'll need to install @react-native-async-storage/async-storage
// For secure storage, you'll also need react-native-keychain or expo-secure-store

/**
 * Storage Service for GlucoVision
 * Handles all local storage operations with encryption for sensitive data
 */
class StorageService {
  private readonly PREFIX = 'glucovision_';

  /**
   * Store a regular item in AsyncStorage
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.getKey(key), value);
    } catch (error) {
      console.error('Error storing item:', error);
      throw new Error('Failed to store data');
    }
  }

  /**
   * Get a regular item from AsyncStorage
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.getKey(key));
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  }

  /**
   * Remove a regular item from AsyncStorage
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Error removing item:', error);
      throw new Error('Failed to remove data');
    }
  }

  /**
   * Store sensitive data securely (tokens, passwords, etc.)
   * TODO: Implement with react-native-keychain or expo-secure-store
   */
  async setSecureItem(key: string, value: string): Promise<void> {
    try {
      // For now, using AsyncStorage - replace with secure storage in production
      await AsyncStorage.setItem(this.getSecureKey(key), value);
      
    } catch (error) {
      console.error('Error storing secure item:', error);
      throw new Error('Failed to store secure data');
    }
  }

  /**
   * Get sensitive data securely
   */
  async getSecureItem(key: string): Promise<string | null> {
    try {
      // For now, using AsyncStorage - replace with secure storage in production
      return await AsyncStorage.getItem(this.getSecureKey(key));
      
    } catch (error) {
      console.error('Error getting secure item:', error);
      return null;
    }
  }

  /**
   * Remove sensitive data securely
   */
  async removeSecureItem(key: string): Promise<void> {
    try {
      // For now, using AsyncStorage - replace with secure storage in production
      await AsyncStorage.removeItem(this.getSecureKey(key));
    } catch (error) {
      console.error('Error removing secure item:', error);
      throw new Error('Failed to remove secure data');
    }
  }

  /**
   * Store object data
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await this.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing object:', error);
      throw new Error('Failed to store object data');
    }
  }

  /**
   * Get object data
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await this.getItem(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error getting object:', error);
      return null;
    }
  }

  /**
   * Clear all app data
   */
  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.PREFIX));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear all data');
    }
  }

  /**
   * Get all stored keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.filter(key => key.startsWith(this.PREFIX));
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Check if a key exists
   */
  async hasKey(key: string): Promise<boolean> {
    try {
      const value = await this.getItem(key);
      return value !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get storage usage info
   */
  async getStorageInfo(): Promise<{
    totalKeys: number;
    estimatedSize: number;
  }> {
    try {
      const keys = await this.getAllKeys();
      let estimatedSize = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          estimatedSize += value.length;
        }
      }

      return {
        totalKeys: keys.length,
        estimatedSize,
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return { totalKeys: 0, estimatedSize: 0 };
    }
  }

  /**
   * Generate prefixed key
   */
  private getKey(key: string): string {
    return `${this.PREFIX}${key}`;
  }

  private getSecureKey(key: string): string {
    return `${this.PREFIX}secure_${key}`;
  }
}

export const storageService = new StorageService();
export default storageService;
