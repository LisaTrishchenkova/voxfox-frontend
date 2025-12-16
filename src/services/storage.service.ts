/**
 * Универсальный сервис для работы с localStorage с поддержкой типов
 */
class StorageService {
  /**
   * Проверка доступности localStorage
   */
  private isAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  /**
   * Получить значение из localStorage
   */
  get<T>(key: string): T | null {
    if (!this.isAvailable()) return null;

    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Ошибка при чтении из localStorage ключа "${key}":`, error);
      return null;
    }
  }

  /**
   * Получить строку из localStorage
   */
  getString(key: string): string | null {
    if (!this.isAvailable()) return null;
    return localStorage.getItem(key);
  }

  /**
   * Установить значение в localStorage
   */
  set<T>(key: string, value: T): void {
    if (!this.isAvailable()) return;

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Ошибка при записи в localStorage ключа "${key}":`, error);
    }
  }

  /**
   * Установить строку в localStorage
   */
  setString(key: string, value: string): void {
    if (!this.isAvailable()) return;
    localStorage.setItem(key, value);
  }

  /**
   * Удалить значение из localStorage
   */
  remove(key: string): void {
    if (!this.isAvailable()) return;
    localStorage.removeItem(key);
  }

  /**
   * Очистить весь localStorage
   */
  clear(): void {
    if (!this.isAvailable()) return;
    localStorage.clear();
  }

  /**
   * Проверить наличие ключа
   */
  has(key: string): boolean {
    if (!this.isAvailable()) return false;
    return localStorage.getItem(key) !== null;
  }
}

// Экспортируем синглтон
export const storage = new StorageService();
