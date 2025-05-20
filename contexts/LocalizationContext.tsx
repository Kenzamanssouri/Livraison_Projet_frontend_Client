import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import { Platform } from 'react-native';
import { translations } from '@/localization/translations';

// Initialize i18n
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = Localization.locale;
i18n.defaultLocale = 'fr';
i18n.enableFallback = true;

type LocalizationContextType = {
  t: (scope: string, options?: object) => string;
  locale: string;
  setLocale: (locale: string) => void;
  isRTL: boolean;
};

const LocalizationContext = createContext<LocalizationContextType>({
  t: (scope: string, options?: object) => '',
  locale: 'fr',
  setLocale: () => {},
  isRTL: false,
});

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState(i18n.locale.split('-')[0]);
  
  // Check if language is RTL (for Arabic)
  const isRTL = locale === 'ar';

  useEffect(() => {
    i18n.locale = locale;

    // Set RTL for the entire app when in Arabic
    if (Platform.OS === 'web') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
    }
  }, [locale, isRTL]);

  const t = (scope: string, options?: object) => {
    return i18n.t(scope, options);
  };

  return (
    <LocalizationContext.Provider value={{ t, locale, setLocale, isRTL }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);