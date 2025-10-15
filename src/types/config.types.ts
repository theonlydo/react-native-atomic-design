/**
 * Config State Types
 * Interface untuk state management konfigurasi aplikasi
 */

export type Language = 'en' | 'id';
export type Theme = 'light' | 'dark';

export interface ConfigState {
  language: Language;
  theme: Theme;
}
