/**
 * API Usage Examples
 * Practical examples untuk menggunakan Auth dan Contact API
 */

import { authApi, contactApi } from '@services';
// import { store } from '../store';
// import { setCredentials, logout } from '../store/slices/authSlice';

// Note: Uncomment the imports above when authSlice is updated with new actions

// ========================================
// 🔐 AUTH EXAMPLES
// ========================================

/**
 * Example 1: User Registration
 */
export const registerExample = async () => {
  try {
    const response = await authApi.register({
      full_name: 'Reza Ilham',
      email: 'reza@x.com',
      phone: '+12345678900',
      password: 'Secret123!',
    });

    if (response.status === 1) {
      console.log('✅ Registration success:', response.data);
      // Redirect to login or auto-login
      return response.data;
    }
  } catch (error: any) {
    if (error.response) {
      const apiError = error.response.data;
      console.error('❌ Registration failed:', apiError.message);
      console.error('Validation errors:', apiError.data);
    }
    throw error;
  }
};

/**
 * Example 2: User Login with Redux
 */
export const loginExample = async (email: string, password: string) => {
  try {
    const response = await authApi.login({ email, password });

    if (response.status === 1) {
      const { token, ...user } = response.data;

      // Save to Redux store (uncomment when authSlice is updated)
      // store.dispatch(
      //   setCredentials({
      //     user,
      //     token: token.access_token,
      //   }),
      // );

      console.log('✅ Login success');
      console.log('User:', user);
      console.log('Token:', token.access_token);

      return response.data;
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('❌ Invalid email or password');
    } else {
      console.error('❌ Login failed:', error.message);
    }
    throw error;
  }
};

/**
 * Example 3: Get User Profile
 */
export const getProfileExample = async () => {
  try {
    const response = await authApi.getProfile();

    if (response.status === 1) {
      console.log('✅ Profile loaded:', response.data);
      return response.data;
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('❌ Unauthorized - Please login again');
      // store.dispatch(logout()); // Uncomment when authSlice is updated
    }
    throw error;
  }
};

/**
 * Example 4: Update Profile
 */
export const updateProfileExample = async (fullName: string, phone: string) => {
  try {
    const response = await authApi.updateProfile({
      full_name: fullName,
      phone: phone,
    });

    if (response.status === 1) {
      console.log('✅ Profile updated:', response.data);

      // Update Redux state (uncomment when authSlice is updated)
      // const state = store.getState();
      // if (state.auth.token) {
      //   store.dispatch(
      //     setCredentials({
      //       user: response.data,
      //       token: state.auth.token,
      //     }),
      //   );
      // }

      return response.data;
    }
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.error('❌ Validation error:', error.response.data.data);
    }
    throw error;
  }
};

// ========================================
// 📇 CONTACT EXAMPLES
// ========================================

/**
 * Example 5: Get All Contacts
 */
export const getContactsExample = async () => {
  try {
    const response = await contactApi.getList();

    if (response.status === 1) {
      console.log('✅ Contacts loaded');
      console.log('Total:', response.data.count);
      console.log('Contacts:', response.data.contacts);
      return response.data;
    }
  } catch (error: any) {
    console.error('❌ Failed to load contacts:', error.message);
    throw error;
  }
};

/**
 * Example 6: Search Contacts
 */
export const searchContactsExample = async (query: string) => {
  try {
    const response = await contactApi.getList({
      q: query,
      page: 1,
      limit: 20,
    });

    if (response.status === 1) {
      console.log(`✅ Search results for "${query}":`, response.data.contacts);
      return response.data;
    }
  } catch (error: any) {
    console.error('❌ Search failed:', error.message);
    throw error;
  }
};

/**
 * Example 7: Paginated Contact List
 */
export const getPaginatedContactsExample = async (page: number) => {
  try {
    const response = await contactApi.getList({
      page,
      limit: 20,
    });

    if (response.status === 1) {
      console.log(`✅ Page ${page} loaded`);
      console.log(
        `Showing ${response.data.contacts.length} of ${response.data.count}`,
      );
      return response.data;
    }
  } catch (error: any) {
    console.error('❌ Failed to load page:', error.message);
    throw error;
  }
};

/**
 * Example 8: Add New Contact
 */
export const addContactExample = async () => {
  try {
    const response = await contactApi.create({
      full_name: 'John Doe',
      phone: '+1 234 567 8900',
      email: 'john@example.com',
    });

    if (response.status === 1) {
      console.log('✅ Contact created:', response.data);
      return response.data;
    }
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.error('❌ Contact phone already exists');
      console.error('Duplicate phone:', error.response.data.data);
    } else if (error.response?.status === 400) {
      console.error('❌ Validation error:', error.response.data.data);
    }
    throw error;
  }
};

/**
 * Example 9: Get Contact Detail
 */
export const getContactDetailExample = async (contactId: number) => {
  try {
    const response = await contactApi.getById(contactId);

    if (response.status === 1) {
      console.log('✅ Contact detail loaded:', response.data);
      return response.data;
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.error('❌ Contact not found');
    }
    throw error;
  }
};

/**
 * Example 10: Update Contact
 */
export const updateContactExample = async (contactId: number) => {
  try {
    const response = await contactApi.update(contactId, {
      full_name: 'Johnathan Doe',
      phone: '0898209890',
      email: null,
      favorite: 1,
    });

    if (response.status === 1) {
      console.log('✅ Contact updated:', response.data);
      return response.data;
    }
  } catch (error: any) {
    if (error.response?.status === 400) {
      console.error('❌ Validation error:', error.response.data.data);
    } else if (error.response?.status === 404) {
      console.error('❌ Contact not found');
    }
    throw error;
  }
};

/**
 * Example 11: Toggle Contact Favorite
 */
export const toggleFavoriteExample = async (
  contactId: number,
  currentContact: any,
) => {
  try {
    const response = await contactApi.toggleFavorite(contactId, currentContact);

    if (response.status === 1) {
      const isFavorite = response.data.favorite === 1;
      console.log(
        `✅ Contact ${isFavorite ? 'added to' : 'removed from'} favorites`,
      );
      return response.data;
    }
  } catch (error: any) {
    console.error('❌ Failed to toggle favorite:', error.message);
    throw error;
  }
};

/**
 * Example 12: Delete Contact
 */
export const deleteContactExample = async (contactId: number) => {
  try {
    const response = await contactApi.delete(contactId);

    if (response.status === 1) {
      console.log('✅ Contact deleted successfully');
      return true;
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.error('❌ Contact not found');
    }
    throw error;
  }
};

// ========================================
// 🔄 COMBINED EXAMPLES
// ========================================

/**
 * Example 13: Complete Auth Flow
 */
export const completeAuthFlowExample = async () => {
  try {
    // 1. Register
    console.log('1️⃣ Registering user...');
    await registerExample();

    // 2. Login
    console.log('2️⃣ Logging in...');
    await loginExample('reza@x.com', 'Secret123!');

    // 3. Get Profile
    console.log('3️⃣ Loading profile...');
    await getProfileExample();

    // 4. Update Profile
    console.log('4️⃣ Updating profile...');
    await updateProfileExample('Reza Ilham Updated', '+1 999 888 7777');

    console.log('✅ Complete auth flow finished!');
  } catch (error) {
    console.error('❌ Auth flow failed:', error);
  }
};

/**
 * Example 14: Contact Management Flow
 */
export const contactManagementFlowExample = async () => {
  try {
    // 1. Load contacts
    console.log('1️⃣ Loading contacts...');
    await getContactsExample();

    // 2. Search
    console.log('2️⃣ Searching contacts...');
    await searchContactsExample('John');

    // 3. Add new contact
    console.log('3️⃣ Adding new contact...');
    const newContact = await addContactExample();

    // 4. Get detail
    console.log('4️⃣ Loading contact detail...');
    await getContactDetailExample(newContact.id);

    // 5. Update contact
    console.log('5️⃣ Updating contact...');
    await updateContactExample(newContact.id);

    // 6. Toggle favorite
    console.log('6️⃣ Toggling favorite...');
    await toggleFavoriteExample(newContact.id, newContact);

    // 7. Delete contact
    console.log('7️⃣ Deleting contact...');
    await deleteContactExample(newContact.id);

    console.log('✅ Contact management flow finished!');
  } catch (error) {
    console.error('❌ Contact flow failed:', error);
  }
};

/**
 * Example 15: Error Handling Pattern
 */
export const errorHandlingExample = async () => {
  try {
    // Attempt to get profile without token
    const profile = await authApi.getProfile();
    console.log('Profile:', profile);
  } catch (error: any) {
    // Handle specific error codes
    if (error.response) {
      const { status_code, message, data } = error.response.data;

      switch (status_code) {
        case 400:
          console.error('Validation Error:', data);
          break;
        case 401:
          console.error('Unauthorized - Please login');
          // store.dispatch(logout()); // Uncomment when authSlice is updated
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 409:
          console.error('Conflict:', data);
          break;
        default:
          console.error('API Error:', message);
      }
    } else if (error.request) {
      console.error('Network Error - No response received');
    } else {
      console.error('Error:', error.message);
    }
  }
};

/**
 * Example 16: React Component Usage
 */
export const ReactComponentExample = `
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { contactApi } from '@services';
import { Contact } from '@types';
import { Text, Button } from '@components';

export const ContactListScreen = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadContacts();
  }, [page]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await contactApi.getList({ page, limit: 20 });
      setContacts(response.data.contacts);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await contactApi.delete(id);
      loadContacts(); // Reload list
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <View>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.full_name}</Text>
            <Text>{item.phone}</Text>
            <Button
              title="Delete"
              onPress={() => handleDelete(item.id)}
            />
          </View>
        )}
        refreshing={loading}
        onRefresh={loadContacts}
      />

      <Button title="Next Page" onPress={() => setPage(p => p + 1)} />
    </View>
  );
};
`;
