/**
 * IndexedDB Manager for Fish Forecast
 * 
 * Provides a simple interface for storing and retrieving fishing data locally,
 * enabling offline functionality.
 */

const DB_NAME = 'fish-forecast-db';
const DB_VERSION = 1;
const STORES = {
  FISHING_DATA: 'fishing-data',
  USER_PREFERENCES: 'user-preferences'
};

class IndexedDBManager {
  /**
   * Opens a connection to the IndexedDB database
   * @returns {Promise<IDBDatabase>} A promise that resolves with the database object
   */
  static openDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this browser'));
        return;
      }
      
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onupgradeneeded = event => {
        const db = event.target.result;
        
        // Create fishing data store if it doesn't exist
        if (!db.objectStoreNames.contains(STORES.FISHING_DATA)) {
          const fishingStore = db.createObjectStore(STORES.FISHING_DATA, { keyPath: 'id' });
          fishingStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Create user preferences store if it doesn't exist
        if (!db.objectStoreNames.contains(STORES.USER_PREFERENCES)) {
          db.createObjectStore(STORES.USER_PREFERENCES, { keyPath: 'key' });
        }
      };
      
      request.onsuccess = event => {
        const db = event.target.result;
        
        // Handle database connection errors
        db.onerror = event => {
          console.error('Database error:', event.target.errorCode);
        };
        
        resolve(db);
      };
      
      request.onerror = event => {
        console.error('IndexedDB error:', event.target.errorCode);
        reject(new Error('Failed to open IndexedDB'));
      };
    });
  }
  
  /**
   * Saves fishing data to IndexedDB
   * @param {Object} data - The fishing data to save
   * @param {string} source - The source of the data (e.g., 'csv', 'api')
   * @returns {Promise<boolean>} A promise that resolves to true if successful
   */
  static saveFishingData(data, source = 'unknown') {
    return this.openDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.FISHING_DATA, 'readwrite');
        const store = transaction.objectStore(STORES.FISHING_DATA);
        
        const item = {
          id: 'fishing-data',
          data: data,
          source: source,
          timestamp: Date.now()
        };
        
        const request = store.put(item); // put will update if exists, add if not
        
        request.onsuccess = () => {
          console.log('✅ Successfully saved fishing data to IndexedDB');
          resolve(true);
        };
        
        request.onerror = event => {
          console.error('❌ Error saving fishing data to IndexedDB:', event.target.error);
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    });
  }
  
  /**
   * Retrieves fishing data from IndexedDB
   * @returns {Promise<Object|null>} A promise that resolves with the fishing data or null if not found
   */
  static getFishingData() {
    return this.openDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.FISHING_DATA, 'readonly');
        const store = transaction.objectStore(STORES.FISHING_DATA);
        const request = store.get('fishing-data');
        
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            console.log(`✅ Successfully retrieved fishing data from IndexedDB (saved ${new Date(result.timestamp).toLocaleString()})`);
            resolve(result.data);
          } else {
            console.log('⚠️ No fishing data found in IndexedDB');
            resolve(null);
          }
        };
        
        request.onerror = event => {
          console.error('❌ Error retrieving fishing data from IndexedDB:', event.target.error);
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    });
  }
  
  /**
   * Saves a user preference to IndexedDB
   * @param {string} key - The preference key
   * @param {any} value - The preference value
   * @returns {Promise<boolean>} A promise that resolves to true if successful
   */
  static savePreference(key, value) {
    return this.openDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.USER_PREFERENCES, 'readwrite');
        const store = transaction.objectStore(STORES.USER_PREFERENCES);
        
        const request = store.put({ key, value, timestamp: Date.now() });
        
        request.onsuccess = () => resolve(true);
        request.onerror = event => reject(event.target.error);
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    });
  }
  
  /**
   * Retrieves a user preference from IndexedDB
   * @param {string} key - The preference key
   * @returns {Promise<any|null>} A promise that resolves with the preference value or null if not found
   */
  static getPreference(key) {
    return this.openDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.USER_PREFERENCES, 'readonly');
        const store = transaction.objectStore(STORES.USER_PREFERENCES);
        const request = store.get(key);
        
        request.onsuccess = () => {
          resolve(request.result ? request.result.value : null);
        };
        
        request.onerror = event => reject(event.target.error);
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    });
  }
  
  /**
   * Clears all data from the fishing data store
   * @returns {Promise<boolean>} A promise that resolves to true if successful
   */
  static clearFishingData() {
    return this.openDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.FISHING_DATA, 'readwrite');
        const store = transaction.objectStore(STORES.FISHING_DATA);
        
        const request = store.clear();
        
        request.onsuccess = () => {
          console.log('✅ Successfully cleared fishing data from IndexedDB');
          resolve(true);
        };
        
        request.onerror = event => {
          console.error('❌ Error clearing fishing data from IndexedDB:', event.target.error);
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    });
  }
  
  /**
   * Gets the timestamp of when the fishing data was last updated
   * @returns {Promise<number|null>} A promise that resolves with the timestamp or null if no data
   */
  static getLastUpdated() {
    return this.openDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.FISHING_DATA, 'readonly');
        const store = transaction.objectStore(STORES.FISHING_DATA);
        const request = store.get('fishing-data');
        
        request.onsuccess = () => {
          resolve(request.result ? request.result.timestamp : null);
        };
        
        request.onerror = event => reject(event.target.error);
        
        transaction.oncomplete = () => {
          db.close();
        };
      });
    });
  }
}

// Export for use in the app
window.IndexedDBManager = IndexedDBManager;
