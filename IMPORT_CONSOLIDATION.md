# Component Import Consolidation

## Overview

Semua komponen dapat diimpor langsung dari `@components` tanpa perlu menspesifikasikan folder atoms/molecules/organisms.

## Perubahan

### Sebelumnya (v1)

```typescript
import { Button } from '@atoms/Button';
import { FormInput } from '@molecules/FormInput';
import { Header } from '@organisms/Header';
```

### Versi 2

```typescript
import { Button } from '@components/atoms/Button';
import { FormInput } from '@components/molecules/FormInput';
import { Header } from '@components/organisms/Header';
```

### Sekarang (v3 - Current)

```typescript
import { Button, FormInput, Header } from '@components';
```

## Keuntungan

1. **Import Lebih Singkat**: Satu baris untuk multiple components
2. **Lebih Clean**: Tidak perlu menspesifikasikan sub-folder
3. **Auto-completion Better**: IDE dapat suggest semua available components
4. **Konsisten dengan Standard Library**: Mirip dengan `import { View, Text } from 'react-native'`
5. **Fleksibel**: Tetap mempertahankan struktur folder Atomic Design

## File yang Diupdate

### Configuration Files

- `tsconfig.json` - Removed @atoms, @molecules, @organisms, @templates aliases
- `babel.config.js` - Removed component-specific aliases

### Screen Files

- `src/screens/HomeScreen.tsx`
- `src/screens/DetailScreen.tsx`
- `src/screens/ProfileScreen.tsx`

### Component Files

- `src/components/molecules/ErrorState.tsx`
- `src/components/molecules/LoadingState.tsx`
- `src/components/molecules/FormInput.tsx`
- `src/components/molecules/ListItem.tsx`
- `src/components/molecules/LanguageSwitcher.tsx`
- `src/components/organisms/LoginForm.tsx`
- `src/components/organisms/Header.tsx`
- `src/components/organisms/DataList.tsx`

### Documentation Files

- `I18N_GUIDE.md`
- `REDUX_GUIDE.md`

## Path Aliases yang Tersisa

Sekarang project hanya menggunakan path aliases berikut:

```json
{
  "@components": "./src/components",
  "@screens": "./src/screens",
  "@navigation": "./src/navigation",
  "@hooks": "./src/hooks",
  "@constants": "./src/constants",
  "@types": "./src/types",
  "@services": "./src/services",
  "@store": "./src/store",
  "@utils": "./src/utils",
  "@assets": "./src/assets"
}
```

## Penggunaan

### Single Import

```typescript
import { Button } from '@components';
```

### Multiple Imports (Recommended)

```typescript
import { Button, Text, Card, Input, Spacer } from '@components';
```

### Mixed with Other Aliases

```typescript
import { Button, FormInput, Header } from '@components';
import { Colors, Spacing } from '@constants';
import { useAppDispatch } from '@hooks';
```

## Available Components

### Atoms

- `Button` - Button dengan berbagai variant
- `Text` - Text dengan variant dan i18n support
- `Card` - Container dengan shadow
- `Input` - Text input
- `Spacer` - Spacing helper

### Molecules

- `FormInput` - Input dengan label dan error
- `ListItem` - Card dengan title dan subtitle
- `LoadingState` - Loading indicator
- `ErrorState` - Error display dengan retry
- `LanguageSwitcher` - Language switcher UI

### Organisms

- `Header` - App header
- `LoginForm` - Form login dengan validasi
- `DataList` - FlatList dengan states

## Migration Notes

Import yang lama masih bisa bekerja karena setiap folder (atoms, molecules, organisms) memiliki index.ts yang meng-export semua komponennya. Namun disarankan menggunakan import langsung dari `@components`.

### Migration Steps

Jika ada file dengan import lama, cukup ubah menjadi:

**From:**

```typescript
import { Button } from '@components/atoms/Button';
import { FormInput } from '@components/molecules/FormInput';
import { Header } from '@components/organisms/Header';
```

**To:**

```typescript
import { Button, FormInput, Header } from '@components';
```

## Technical Details

Sistem ini bekerja dengan barrel exports:

1. **Atoms index** (`src/components/atoms/index.ts`):

   ```typescript
   export * from './Button';
   export * from './Text';
   // ... etc
   ```

2. **Molecules index** (`src/components/molecules/index.ts`):

   ```typescript
   export * from './FormInput';
   export * from './ListItem';
   // ... etc
   ```

3. **Organisms index** (`src/components/organisms/index.ts`):

   ```typescript
   export * from './Header';
   export * from './LoginForm';
   // ... etc
   ```

4. **Main components index** (`src/components/index.ts`):
   ```typescript
   export * from './atoms';
   export * from './molecules';
   export * from './organisms';
   ```

Dengan struktur ini, semua exports di-flatten ke level `@components`.
