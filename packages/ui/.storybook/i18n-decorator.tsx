import React from 'react';
import type { Decorator } from '@storybook/react';

// Mock translations for Storybook
const mockTranslations = {
  ro: {
    common: {
      submit: 'Trimite',
      cancel: 'Anulează',
      save: 'Salvează',
      delete: 'Șterge',
      edit: 'Editează',
      loading: 'Se încarcă...',
      error: 'Eroare',
      success: 'Succes',
      close: 'Închide',
    },
    hero: {
      cta: 'Primește rețete personalizate și planuri de mese',
    },
    email: {
      label: 'Adresa de email',
      placeholder: 'numele@exemplu.ro',
      button: 'Începe acum',
      loading: 'Se încarcă...',
      success: 'Mulțumim! Vei primi primul plan săptămânal în curând.',
      phase_info: 'Aplicația este în dezvoltare. Te vom contacta când va fi gata!',
      errors: {
        invalid_email: 'Te rugăm să introduci o adresă de email validă',
        already_subscribed: 'Această adresă de email este deja înregistrată',
        rate_limited: 'Prea multe încercări. Te rugăm să aștepți câteva minute',
        server_error: 'A apărut o eroare. Te rugăm să încerci din nou',
      },
    },
    auth: {
      login: 'Autentificare',
      logout: 'Deconectare',
      register: 'Înregistrare',
      forgot_password: 'Ai uitat parola?',
      reset_password: 'Resetează parola',
    },
    meal: {
      breakfast: 'Mic dejun',
      lunch: 'Prânz',
      dinner: 'Cină',
      snack: 'Gustare',
      servings: 'porții',
      prep_time: 'Timp preparare',
      cook_time: 'Timp gătire',
      total_time: 'Timp total',
      ingredients: 'Ingrediente',
      instructions: 'Instrucțiuni',
      nutrition: 'Informații nutriționale',
      calories: 'Calorii',
      protein: 'Proteine',
      carbs: 'Carbohidrați',
      fat: 'Grăsimi',
    },
    navigation: {
      home: 'Acasă',
      recipes: 'Rețete',
      meal_plan: 'Plan mese',
      shopping_list: 'Listă cumpărături',
      profile: 'Profil',
      settings: 'Setări',
    },
  },
  en: {
    common: {
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      close: 'Close',
    },
    // Add English translations as needed
  },
};

// Mock i18n context
const I18nContext = React.createContext({
  locale: 'ro',
  t: (key: string) => {
    const keys = key.split('.');
    let value: any = mockTranslations.ro;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  },
  changeLocale: (locale: string) => {
    console.log('Changing locale to:', locale);
  },
});

// Mock useTranslation hook for components
export const useTranslation = (namespaces?: string | string[]) => {
  const context = React.useContext(I18nContext);

  return {
    t: (key: string, options?: any) => {
      // Handle namespace:key format
      if (key.includes(':')) {
        const [namespace, actualKey] = key.split(':');
        return context.t(`${namespace}.${actualKey}`);
      }

      // Handle array namespaces
      if (Array.isArray(namespaces)) {
        for (const ns of namespaces) {
          const value = context.t(`${ns}.${key}`);
          if (value !== `${ns}.${key}`) {
            return value;
          }
        }
      } else if (namespaces) {
        return context.t(`${namespaces}.${key}`);
      }

      return context.t(key);
    },
    i18n: {
      language: context.locale,
      changeLanguage: context.changeLocale,
    },
    ready: true,
  };
};

// Export for components to import directly
// Avoid global window pollution

// Decorator for Storybook
export const i18nDecorator: Decorator = (Story, context) => {
  const locale = context.globals?.locale || 'ro';

  const contextValue = {
    locale,
    t: (key: string) => {
      const keys = key.split('.');
      let value: any =
        mockTranslations[locale as keyof typeof mockTranslations] || mockTranslations.ro;
      for (const k of keys) {
        value = value?.[k];
      }
      return value || key;
    },
    changeLocale: (newLocale: string) => {
      console.log('Changing locale to:', newLocale);
    },
  };

  return (
    <I18nContext.Provider value={contextValue}>
      <Story />
    </I18nContext.Provider>
  );
};

export default i18nDecorator;
