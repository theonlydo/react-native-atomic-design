# Contact List Screen Enhancement

## 🎯 Overview

Menambahkan fitur search, counter, modal form, dan delete action di Contact List Screen.

---

## ✨ Features Added

### 1. **Search Bar**

- 🔍 Real-time search functionality
- Filter by name, email, or phone
- Clear button (✕) untuk reset search
- Highlight with icon

```tsx
// Search implementation
const filteredContacts = useMemo(() => {
  if (!searchQuery.trim()) return contacts;

  const query = searchQuery.toLowerCase();
  return contacts.filter(
    contact =>
      contact.full_name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.phone.includes(query),
  );
}, [contacts, searchQuery]);
```

### 2. **Contact Counter**

- Displays: `{total} Contacts`
- Updates dynamically with search results
- Shows filtered count when searching

```tsx
<Text style={styles.counter}>{filteredContacts.length} Contacts</Text>
```

### 3. **Add Contact Modal**

- Full-screen modal from bottom
- Form validation (name, email, phone)
- Real-time error display
- Save & Cancel buttons

**Form Fields:**

- **Full Name** - Required
- **Email** - Required, valid format
- **Phone** - Required, valid Indonesian format

**Validation Rules:**

```typescript
// Email validation
const emailError =
  formTouched.email && !formData.email
    ? 'Email is required'
    : formTouched.email && !isValidEmail(formData.email)
    ? 'Invalid email format'
    : '';

// Phone validation
const phoneError =
  formTouched.phone && !formData.phone
    ? 'Phone is required'
    : formTouched.phone && !isValidPhone(formData.phone)
    ? 'Invalid phone format'
    : '';
```

### 4. **Delete Contact Action**

- 🗑️ Delete button on right side of each contact
- Confirmation alert before delete
- Updates list immediately after delete

```tsx
const handleDeleteContact = (contactId: number) => {
  Alert.alert(
    'Delete Contact',
    'Are you sure you want to delete this contact?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setContacts(contacts.filter(c => c.id !== contactId));
          Alert.alert('Success', 'Contact deleted');
        },
      },
    ],
  );
};
```

### 5. **Floating Add Button**

- Fixed at bottom of screen
- Full-width design
- "➕ Add Contact" text
- Shadow & elevation for depth

---

## 📋 UI Layout

```
┌─────────────────────────────────┐
│ Contacts          5 Contacts    │  ← Header with counter
├─────────────────────────────────┤
│ 🔍 [Search contacts...    ] ✕  │  ← Search bar
├─────────────────────────────────┤
│ 👨 John Doe                 🗑️  │  ← Contact with delete
│    john.doe@example.com         │
├─────────────────────────────────┤
│ 👩 Jane Smith               🗑️  │
│    jane.smith@example.com       │
├─────────────────────────────────┤
│ 👨‍💼 Bob Johnson              🗑️  │
│    bob.j@example.com            │
├─────────────────────────────────┤
│                                 │
│                                 │
│  ┌───────────────────────────┐ │
│  │    ➕ Add Contact         │ │  ← Floating button
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

---

## 🎨 User Flow

### Adding Contact:

```
1. User clicks "Add Contact" button
   ↓
2. Modal slides up from bottom
   ↓
3. User fills form (name, email, phone)
   ↓
4. Validation happens on blur
   ↓
5. Save button enabled when valid
   ↓
6. Click Save → Contact added → Modal closes
   ↓
7. Success alert shown
```

### Searching Contacts:

```
1. User types in search bar
   ↓
2. List filters in real-time
   ↓
3. Counter updates: "2 Contacts" (from 5)
   ↓
4. Click ✕ to clear search
   ↓
5. Full list restored
```

### Deleting Contact:

```
1. User clicks 🗑️ on contact
   ↓
2. Confirmation alert appears
   ↓
3. User confirms deletion
   ↓
4. Contact removed from list
   ↓
5. Success message shown
```

---

## 💻 Implementation Details

### State Management:

```typescript
// Search state
const [searchQuery, setSearchQuery] = useState('');

// Modal state
const [modalVisible, setModalVisible] = useState(false);

// Form data
const [formData, setFormData] = useState({
  full_name: '',
  email: '',
  phone: '',
});

// Form touched (for validation)
const [formTouched, setFormTouched] = useState({
  full_name: false,
  email: false,
  phone: false,
});
```

### Filtered Contacts:

```typescript
const filteredContacts = useMemo(() => {
  if (!searchQuery.trim()) return contacts;

  const query = searchQuery.toLowerCase();
  return contacts.filter(
    contact =>
      contact.full_name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.phone.includes(query),
  );
}, [contacts, searchQuery]);
```

### Form Validation:

```typescript
const formErrors = useMemo(() => {
  return {
    full_name:
      formTouched.full_name && !formData.full_name ? 'Name is required' : '',
    email:
      formTouched.email && !formData.email
        ? 'Email is required'
        : formTouched.email && !isValidEmail(formData.email)
        ? 'Invalid email format'
        : '',
    phone:
      formTouched.phone && !formData.phone
        ? 'Phone is required'
        : formTouched.phone && !isValidPhone(formData.phone)
        ? 'Invalid phone format'
        : '',
  };
}, [formData, formTouched]);

const isFormValid = useMemo(() => {
  return (
    formData.full_name &&
    formData.email &&
    formData.phone &&
    !formErrors.full_name &&
    !formErrors.email &&
    !formErrors.phone
  );
}, [formData, formErrors]);
```

---

## 🎨 Styling

### Search Bar:

```typescript
searchContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Colors.surface,
  marginHorizontal: Spacing.lg,
  paddingHorizontal: Spacing.md,
  paddingVertical: Spacing.sm,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: Colors.border,
}
```

### Contact Item with Delete:

```typescript
contactItem: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: Colors.white,
}
contactInfo: {
  flex: 1,  // Takes remaining space
}
deleteButton: {
  paddingHorizontal: Spacing.lg,
  paddingVertical: Spacing.md,
}
```

### Floating Button:

```typescript
floatingButton: {
  position: 'absolute',
  bottom: Spacing.xl,
  right: Spacing.lg,
  left: Spacing.lg,
  backgroundColor: Colors.primary,
  paddingVertical: Spacing.md,
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 4.65,
  elevation: 8,
}
```

### Modal:

```typescript
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'flex-end',
}
modalContent: {
  backgroundColor: Colors.white,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: Spacing.lg,
  paddingTop: Spacing.lg,
  paddingBottom: Spacing.xl,
  maxHeight: '90%',
}
```

---

## 🔍 Search Examples

### Search by Name:

```
Query: "john"
Results: John Doe

Query: "jane"
Results: Jane Smith
```

### Search by Email:

```
Query: "example.com"
Results: All contacts (all have @example.com)

Query: "alice"
Results: Alice Williams (alice.w@example.com)
```

### Search by Phone:

```
Query: "8901"
Results: John Doe (+1 234 567 8901)

Query: "+1 234"
Results: All contacts (all have +1 234 prefix)
```

---

## 📱 Modal Form

### Layout:

```
┌───────────────────────────────┐
│ Add New Contact           ✕   │  ← Header
├───────────────────────────────┤
│                               │
│ Full Name *                   │
│ [________________]            │
│ ❌ Name is required           │
│                               │
│ Email *                       │
│ [________________]            │
│ ❌ Invalid email format       │
│                               │
│ Phone *                       │
│ [________________]            │
│ ❌ Invalid phone format       │
│                               │
│ ┌─────────────────────────┐  │
│ │  💾 Save Contact        │  │  ← Disabled if invalid
│ └─────────────────────────┘  │
│                               │
│ ┌─────────────────────────┐  │
│ │  Cancel                 │  │
│ └─────────────────────────┘  │
└───────────────────────────────┘
```

### Validation Behavior:

1. **Initial state**: No errors shown
2. **User types**: No errors (until blur)
3. **User blurs field**: Validation triggered
4. **Error shown**: Red text below field
5. **User fixes**: Error disappears
6. **All valid**: Save button enabled

---

## 🎯 Features Summary

| Feature         | Status | Description                             |
| --------------- | ------ | --------------------------------------- |
| Search Bar      | ✅     | Real-time filtering by name/email/phone |
| Contact Counter | ✅     | Shows total/filtered count              |
| Add Modal       | ✅     | Full-screen modal with form             |
| Form Validation | ✅     | Email & phone format validation         |
| Delete Action   | ✅     | Delete button with confirmation         |
| Floating Button | ✅     | Fixed "Add Contact" button at bottom    |
| Empty State     | ✅     | Shows when no contacts                  |
| Pull to Refresh | ✅     | Existing feature maintained             |

---

## 🔧 Validation Utils Used

### Email Validation:

```typescript
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

**Valid Examples:**

- ✅ `user@example.com`
- ✅ `john.doe@company.co.id`
- ❌ `invalid@` (no domain)
- ❌ `@example.com` (no username)

### Phone Validation:

```typescript
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};
```

**Valid Examples:**

- ✅ `+628123456789`
- ✅ `628123456789`
- ✅ `08123456789`
- ❌ `123456` (too short)
- ❌ `+1234567890123456` (too long)

---

## 📁 Files Modified

### `src/screens/ContactListScreen.tsx`

**Added Imports:**

```typescript
import { useMemo } from 'react';
import {
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, Spacer, FormInput } from '@components';
import { isValidEmail, isValidPhone } from '@utils';
```

**Added State:**

- `searchQuery` - Search input value
- `modalVisible` - Modal open/close state
- `formData` - Form field values
- `formTouched` - Track which fields have been blurred

**Added Functions:**

- `handleAddContact()` - Open modal
- `handleCloseModal()` - Close modal & reset form
- `handleSaveContact()` - Validate & save new contact
- `handleDeleteContact(id)` - Delete contact with confirmation

**Updated UI:**

- Header with counter
- Search bar with clear button
- Contact items with delete button
- Floating add button
- Add contact modal with form

---

## 🚀 Next Steps

### Recommended Enhancements:

1. **Edit Contact**:

   ```typescript
   const handleEditContact = (contact: Contact) => {
     setFormData(contact);
     setModalVisible(true);
   };
   ```

2. **Favorite Contacts**:

   ```typescript
   interface Contact {
     // ... existing fields
     isFavorite: boolean;
   }

   const handleToggleFavorite = (id: number) => {
     // Toggle favorite status
   };
   ```

3. **Bulk Delete**:

   ```typescript
   const [selectedContacts, setSelectedContacts] = useState<number[]>([]);

   const handleBulkDelete = () => {
     // Delete multiple contacts
   };
   ```

4. **Export Contacts**:

   ```typescript
   const handleExport = () => {
     const csv = contacts
       .map(c => `${c.full_name},${c.email},${c.phone}`)
       .join('\n');
     // Export to CSV
   };
   ```

5. **Contact Groups**:
   ```typescript
   interface ContactGroup {
     id: number;
     name: string;
     contacts: number[];
   }
   ```

---

## 🧪 Testing Scenarios

### Search Functionality:

- [ ] Search by name (partial match)
- [ ] Search by email (partial match)
- [ ] Search by phone number
- [ ] Clear search with ✕ button
- [ ] Counter updates with search results
- [ ] Empty state when no results

### Add Contact:

- [ ] Open modal on button click
- [ ] Form validation on blur
- [ ] Save button disabled when invalid
- [ ] Success message after save
- [ ] Contact appears in list
- [ ] Modal closes after save
- [ ] Cancel button works

### Delete Contact:

- [ ] Delete button visible on each contact
- [ ] Confirmation alert appears
- [ ] Contact removed after confirmation
- [ ] Cancel keeps contact
- [ ] Counter updates after delete

### Edge Cases:

- [ ] Add contact with special characters
- [ ] Search with empty query
- [ ] Delete last contact
- [ ] Add duplicate contact
- [ ] Form validation with whitespace

---

## 🎉 Summary

✅ **Search Bar**: Real-time filtering dengan clear button  
✅ **Contact Counter**: Menampilkan `{total} Contacts`  
✅ **Add Modal**: Full-screen modal dengan form validation  
✅ **Form Validation**: Email & phone format validation  
✅ **Delete Action**: Delete button dengan confirmation alert  
✅ **Floating Button**: Fixed button di bottom screen  
✅ **Responsive**: Works on different screen sizes  
✅ **User Feedback**: Alerts for success/error actions

**Ready to use!** 🚀
