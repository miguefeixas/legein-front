import '@angular/common/locales/es';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

export const AVAILABLE_LANGUAGES = {
  en: 'en',
  es: 'es',
};

type AvailableLanguagesString = keyof typeof AVAILABLE_LANGUAGES;

export const defaultLanguage = AVAILABLE_LANGUAGES.es;

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function formatLanguage(language: string): string {
  const lan = language.split('-')[0] as AvailableLanguagesString;

  return AVAILABLE_LANGUAGES[lan] ? lan : defaultLanguage;
}
