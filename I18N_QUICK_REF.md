# 🌍 i18n Quick Reference

## Setup ✅

Multi-language support sudah terintegrasi dengan i18next!

## Bahasa yang Tersedia

- 🇬🇧 English (en)
- 🇮🇩 Indonesian (id) - **Default**

## Cara Pakai

### 1. Text Component (Auto Translate)

```tsx
// Menggunakan i18nKey (Recommended)
<Text i18nKey="home.title" />

// Disable translate untuk data user
<Text translate={false}>{user.name}</Text>

// Dengan parameter
<Text i18nKey="welcome" i18nParams={{ name: userName }} />
```

### 2. Button Component

```tsx
<Button i18nKey="common.save" onPress={handleSave} />
<Button i18nKey="auth.login">Login</Button>
```

### 3. useTranslation Hook

```tsx
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

// Translate
const text = t('home.welcome');

// Change language
i18n.changeLanguage('en'); // or 'id'

// Get current language
const currentLang = i18n.language;
```

### 4. LanguageSwitcher Component

```tsx
// Compact (untuk header)
<LanguageSwitcher variant="compact" />

// Expanded (untuk settings)
<LanguageSwitcher variant="expanded" />
```

## Translation Keys

### Common

```
common.loading
common.error
common.save
common.cancel
common.back
```

### Home Screen

```
home.title
home.welcome
home.goToProfile
home.noUsers
```

### Profile Screen

```
profile.title
profile.userName
profile.userEmail
profile.editProfile
```

### Detail Screen

```
detail.title
detail.userDetails
detail.name
detail.email
detail.phone
```

### Auth

```
auth.login
auth.register
auth.email
auth.password
auth.loginSuccess
```

### Validation

```
validation.required
validation.emailInvalid
validation.passwordTooShort
```

### Language

```
language.title
language.english
language.indonesian
language.changeLanguage
```

## File Locations

```
app/
├── i18n/
│   ├── index.ts           # i18n config
│   └── locales/
│       ├── en.json        # English translations
│       └── id.json        # Indonesian translations
```

## Component Props

### Text Component

```typescript
<Text
  i18nKey="translation.key" // Translation key
  i18nParams={{ name: 'John' }} // Parameters
  translate={true} // Auto translate (default: true)
/>
```

### Button Component

```typescript
<Button
  i18nKey="translation.key" // Translation key
  translate={true} // Auto translate (default: true)
/>
```

## Best Practices

✅ **DO:**

- Use `i18nKey` for all static text
- Disable translate for user/dynamic data
- Organize keys by feature/screen
- Test both languages

❌ **DON'T:**

- Don't translate user names, emails
- Don't use flat key structure
- Don't hardcode text in components

## Menambah Terjemahan Baru

1. Buka file: `app/i18n/locales/id.json` atau `en.json`
2. Tambahkan key baru:

```json
{
  "myFeature": {
    "title": "My Title",
    "description": "My Description"
  }
}
```

3. Gunakan di component:

```tsx
<Text i18nKey="myFeature.title" />
```

## Debug

Jika terjemahan tidak muncul:

1. Cek apakah key ada di file JSON
2. Restart app
3. Cek console untuk error

---

📖 **Dokumentasi lengkap:** [I18N_GUIDE.md](./I18N_GUIDE.md)
