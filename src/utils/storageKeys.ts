/**
 * Clears all data from sessionStorage
 */
export const clearSessionStorage = (): void => {
  if (typeof window !== "undefined") {
    sessionStorage.clear();
  }
};

/**
 * Removes a specific item from sessionStorage
 * @param key - The key to remove
 */
export const removeSessionStorage = (key: string): void => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(key);
  }
};

/**
 * Sets an item in sessionStorage with JSON stringification
 * @param key - The key to store the value under
 * @param value - The value to store
 */
export const setSessionStorage = <T>(key: string, value: T): void => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
};

/**
 * Gets and parses an item from sessionStorage
 * @param key - The key to retrieve
 * @returns The parsed value or null if not found
 */
export const getSessionStorage = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;

  try {
    const data = sessionStorage.getItem(key);
    if (!data || data === "undefined") return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(
      `Error parsing sessionStorage item with key "${key}":`,
      error
    );
    return null;
  }
};

/**
 * Gets raw string data from sessionStorage without parsing
 * @param key - The key to retrieve
 * @returns The raw string value or null if not found
 */
export const getDataInsessionStorage = (key: string): string | null => {
  if (typeof window !== "undefined") {
    const localData = sessionStorage.getItem(key);
    return localData ?? null;
  }
  return null;
};
