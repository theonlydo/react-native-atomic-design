# 🌍 Internationalization (i18n) Guide

This guide explains how to use the internationalization feature in the React Native Atomic Design project.

## 📚 Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Usage](#usage)
- [Translation Files](#translation-files)
- [Components with i18n](#components-with-i18n)
- [Language Switcher](#language-switcher)
- [Best Practices](#best-practices)

## Overview

This project uses **i18next** and **react-i18next** for internationalization support. By default, all Text and Button components automatically translate their content.

**Supported Languages:**

- 🇬🇧 English (en)
- 🇮🇩 Indonesian (id)

**Default Language:** Indonesian (id)

## Setup

The i18n configuration is already set up and automatically initialized in `App.tsx`:

```typescript
import './app/i18n'; // Initialize i18n
```

### Configuration File

Location: `app/i18n/index.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: 'id', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});
```

## Usage

### Using the Text Component

The `Text` component automatically translates by default:

```tsx
import { Text } from '@components';

// Method 1: Using i18nKey prop (Recommended)
<Text i18nKey="home.title" />

// Method 2: Auto-translate children (if translation key exists)
<Text>home.title</Text>

// Method 3: Disable translation for dynamic content
<Text translate={false}>{user.name}</Text>

// Method 4: With translation parameters
<Text
  i18nKey="welcome.message"
  i18nParams={{ name: userName }}
/>
```

### Using the Button Component

The `Button` component also supports automatic translation:

```tsx
import { Button } from '@components';

// Method 1: Using i18nKey
<Button i18nKey="common.save" onPress={handleSave} />

// Method 2: Auto-translate children
<Button>common.save</Button>

// Method 3: Disable translation
<Button translate={false}>Custom Text</Button>
```

### Using useTranslation Hook

For custom components or complex translations:

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <View>
      <Text>{t('common.welcome')}</Text>
      <Text>{t('greeting', { name: 'John' })}</Text>
      <Text>Current language: {i18n.language}</Text>
    </View>
  );
}
```

## Translation Files

Translation files are located in `app/i18n/locales/`:

### English (en.json)

```json
{
  "common": {
    "appName": "Atomic Design",
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel"
  },
  "home": {
    "title": "Home",
    "welcome": "Welcome to React Native Atomic Design"
  }
}
```

### Indonesian (id.json)

```json
{
  "common": {
    "appName": "Atomic Design",
    "loading": "Memuat...",
    "save": "Simpan",
    "cancel": "Batal"
  },
  "home": {
    "title": "Beranda",
    "welcome": "Selamat datang di React Native Atomic Design"
  }
}
```

### Translation Structure

Organize translations by feature/screen:

```
{
  "common": {},      // Global/shared translations
  "home": {},        // Home screen
  "profile": {},     // Profile screen
  "auth": {},        // Authentication
  "validation": {},  // Form validation messages
  "language": {}     // Language-related texts
}
```

## Components with i18n

### Text Component Props

```typescript
interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
  color?: string;
  weight?: keyof typeof FontWeight;
  align?: 'left' | 'center' | 'right';
  children?: React.ReactNode;
  translate?: boolean; // Default: true
  i18nKey?: string; // Translation key
  i18nParams?: Record<string, any>; // Parameters for interpolation
}
```

### Button Component Props

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  translate?: boolean; // Default: true
  i18nKey?: string; // Translation key
}
```

## Language Switcher

The `LanguageSwitcher` component provides UI for changing languages:

### Compact Variant (for headers/toolbars)

```tsx
import { LanguageSwitcher } from '@components';

<LanguageSwitcher variant="compact" />;
```

### Expanded Variant (for settings screens)

```tsx
<LanguageSwitcher variant="expanded" />
```

### Programmatic Language Change

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();

  const changeToEnglish = () => {
    i18n.changeLanguage('en');
  };

  const changeToIndonesian = () => {
    i18n.changeLanguage('id');
  };

  return (
    <View>
      <Button onPress={changeToEnglish}>English</Button>
      <Button onPress={changeToIndonesian}>Indonesian</Button>
    </View>
  );
}
```

## Best Practices

### 1. Use i18nKey for Static Text

```tsx
// ✅ Good
<Text i18nKey="home.title" />
<Button i18nKey="common.save" />

// ❌ Avoid
<Text>Home</Text>
<Button>Save</Button>
```

### 2. Disable Translation for Dynamic Content

```tsx
// ✅ Good - User data shouldn't be translated
<Text translate={false}>{user.name}</Text>
<Text translate={false}>{user.email}</Text>

// ❌ Bad - Will try to translate user data
<Text>{user.name}</Text>
```

### 3. Use Nested Keys for Organization

```tsx
// ✅ Good - Well organized
<Text i18nKey="home.welcome.title" />
<Text i18nKey="home.welcome.subtitle" />

// ❌ Avoid - Flat structure
<Text i18nKey="homeWelcomeTitle" />
<Text i18nKey="homeWelcomeSubtitle" />
```

### 4. Use Parameters for Dynamic Values

```tsx
// ✅ Good
<Text
  i18nKey="greeting.message"
  i18nParams={{ name: userName, count: itemCount }}
/>

// Translation: "Hello {{name}}, you have {{count}} items"
```

### 5. Provide Fallback for Missing Translations

The fallback language is set to English. If a translation key is missing in Indonesian, it will show the English version.

### 6. Keep Translation Keys Consistent

Use a consistent naming convention:

- `common.*` - Global translations
- `[screen].*` - Screen-specific translations
- `[feature].*` - Feature-specific translations

### 7. Test Both Languages

Always test your app in both languages to ensure:

- All text is properly translated
- Layout doesn't break with different text lengths
- RTL support if needed in the future

## Adding a New Language

To add a new language (e.g., Spanish):

1. Create translation file:

```bash
touch app/i18n/locales/es.json
```

2. Add translations:

```json
{
  "common": {
    "appName": "Diseño Atómico",
    "loading": "Cargando..."
  }
}
```

3. Update i18n config:

```typescript
import es from './locales/es.json';

const resources = {
  en: { translation: en },
  id: { translation: id },
  es: { translation: es }, // Add this
};
```

4. Update LanguageSwitcher component to include the new language option.

## Troubleshooting

### Translation Key Not Found

If you see the translation key instead of translated text:

1. Check if the key exists in translation files
2. Verify the JSON structure is correct
3. Restart the app to reload translations

### Text Not Translating

1. Ensure `translate` prop is not set to `false`
2. Check if you're using `i18nKey` correctly
3. Verify i18n is initialized in App.tsx

### Layout Issues

If text overflows or breaks layout:

1. Use `numberOfLines` prop on Text
2. Test with longest translation
3. Use flexible layouts (flex, flexWrap)

## API Reference

### useTranslation Hook

```typescript
const { t, i18n } = useTranslation();

// t(key, options?) - Translate a key
t('common.welcome');
t('greeting', { name: 'John' });

// i18n.language - Current language
console.log(i18n.language); // 'en' or 'id'

// i18n.changeLanguage(lng) - Change language
i18n.changeLanguage('en');
```

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [React Native i18n Guide](https://react.i18next.com/latest/using-with-hooks)

---

For more information about the project architecture, see [README.md](./README.md)
