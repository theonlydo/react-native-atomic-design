/**
 * Contact List Screen
 * Main screen untuk menampilkan daftar kontak
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text, Button, Spacer } from '@components';
import { ListItem, LoadingState, ErrorState, FormInput } from '@components';
import { Colors, Spacing } from '@constants';
import { isValidEmail, isValidPhone } from '@utils';
import { contactApi, Contact } from '@services';

interface ContactListScreenProps {
  navigation: any;
}

export const ContactListScreen: React.FC<ContactListScreenProps> = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 20;

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });
  const [formTouched, setFormTouched] = useState({
    full_name: false,
    email: false,
    phone: false,
  });

  // Form validation
  const formErrors = useMemo(() => {
    return {
      full_name: formTouched.full_name && !formData.full_name ? 'Name is required' : '',
      email: formTouched.email && !formData.email
        ? 'Email is required'
        : formTouched.email && !isValidEmail(formData.email)
          ? 'Invalid email format'
          : '',
      phone: formTouched.phone && !formData.phone
        ? 'Phone is required'
        : formTouched.phone && !isValidPhone(formData.phone)
          ? 'Invalid phone format'
          : '',
    };
  }, [formData, formTouched]);

  const isFormValid = useMemo(() => {
    return formData.full_name &&
      formData.email &&
      formData.phone &&
      !formErrors.full_name &&
      !formErrors.email &&
      !formErrors.phone;
  }, [formData, formErrors]);

  // Filter contacts based on search query (client-side for now)
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;

    const query = searchQuery.toLowerCase();
    return contacts.filter(contact =>
      contact.full_name.toLowerCase().includes(query) ||
      (contact.email && contact.email.toLowerCase().includes(query)) ||
      contact.phone.includes(query)
    );
  }, [contacts, searchQuery]);

  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadContacts = async (page: number = 1, search: string = '') => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      console.log('=== GET CONTACTS API CALL ===');
      console.log('Params:', { q: search, page, limit: ITEMS_PER_PAGE });

      // Call real API
      const response = await contactApi.getList({
        q: search,
        page: page,
        limit: ITEMS_PER_PAGE,
      });

      console.log('Response received:', response);

      if (response.status === 1 && response.data) {
        console.log('Contacts loaded:', response.data.contacts.length);

        if (page === 1) {
          // First page - replace contacts
          setContacts(response.data.contacts);
        } else {
          // Load more - append contacts
          setContacts(prev => [...prev, ...response.data.contacts]);
        }

        setTotalCount(response.data.count);
        setCurrentPage(response.data.page);

        // Check if there are more pages
        const totalPages = Math.ceil(response.data.count / response.data.limit);
        setHasMore(response.data.page < totalPages);
      } else {
        console.log('Failed to load contacts:', response.message);
        setError(response.message || 'Failed to load contacts');
      }

      setLoading(false);
      setLoadingMore(false);
    } catch (err: any) {
      console.error('=== LOAD CONTACTS ERROR ===');
      console.error('Full error:', err);
      console.error('Error message:', err.message);

      let errorMessage = 'Failed to load contacts';
      if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadContacts(1, searchQuery);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      loadContacts(currentPage + 1, searchQuery);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Debounce would be better in production
    // For now, search on client-side filtering
  };

  const handleContactPress = (contact: Contact) => {
    // Open edit modal
    setEditingContact(contact);
    setFormData({
      full_name: contact.full_name,
      email: contact.email || '',
      phone: contact.phone,
    });
    setFormTouched({
      full_name: false,
      email: false,
      phone: false,
    });
    setModalVisible(true);
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
    });
    setFormTouched({
      full_name: false,
      email: false,
      phone: false,
    });
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingContact(null);
    // Reset form
    setFormData({ full_name: '', email: '', phone: '' });
    setFormTouched({ full_name: false, email: false, phone: false });
  };

  const handleSaveContact = async () => {
    // Mark all as touched
    setFormTouched({ full_name: true, email: true, phone: true });

    if (!isFormValid) {
      Alert.alert('Error', 'Please fix all errors before saving');
      return;
    }

    try {
      if (editingContact) {
        // Update existing contact
        console.log('=== UPDATE CONTACT API CALL ===');
        console.log('Endpoint: PUT /api/v1/contacts/' + editingContact.id);
        console.log('Payload:', JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email || null,
        }, null, 2));

        const response = await contactApi.update(editingContact.id, {
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email || null,
        });

        console.log('Response:', JSON.stringify(response, null, 2));

        if (response.status === 1 && response.data) {
          console.log('Contact updated:', response.data);
          Alert.alert('Success', 'Contact updated successfully!');
          await loadContacts(1, searchQuery); // Reload contacts
          handleCloseModal();
        } else {
          console.log('Failed to update contact:', response.message);
          Alert.alert('Error', response.message || 'Failed to update contact');
        }
      } else {
        // Create new contact
        console.log('=== CREATE CONTACT API CALL ===');
        console.log('Endpoint: POST /api/v1/contacts');
        console.log('Payload:', JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email || null,
        }, null, 2));

        const response = await contactApi.create({
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email || null,
        });

        console.log('Response:', JSON.stringify(response, null, 2));

        if (response.status === 1 && response.data) {
          console.log('Contact created:', response.data);
          Alert.alert('Success', 'Contact added successfully!');
          await loadContacts(1, searchQuery); // Reload contacts
          handleCloseModal();
        } else {
          console.log('Failed to create contact:', response.message);
          Alert.alert('Error', response.message || 'Failed to add contact');
        }
      }
    } catch (error: any) {
      console.error('=== SAVE CONTACT ERROR ===');
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'Failed to save contact');
    }
  };

  const handleDeleteContact = (contactId: number) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('=== DELETE CONTACT API CALL ===');
              console.log('Contact ID:', contactId);

              const response = await contactApi.delete(contactId);

              if (response.status === 1) {
                Alert.alert('Success', 'Contact deleted');
                await loadContacts(1, searchQuery); // Reload contacts
              } else {
                Alert.alert('Error', response.message || 'Failed to delete contact');
              }
            } catch (error: any) {
              console.error('=== DELETE CONTACT ERROR ===');
              console.error('Error:', error);
              Alert.alert('Error', error.message || 'Failed to delete contact');
            }
          },
        },
      ],
    );
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <View style={styles.contactItem}>
      <View style={styles.contactInfo}>
        <ListItem
          title={item.full_name}
          subtitle={item.email || item.phone}
          onPress={() => handleContactPress(item)}
        />
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteContact(item.id)}>
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <Text style={styles.counter}>{totalCount} Contacts</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <Text style={styles.footerText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📇</Text>
      <Text style={styles.emptyText}>No contacts yet</Text>
      <Text style={styles.emptySubtext}>
        Add your first contact to get started
      </Text>
    </View>
  );

  if (loading && contacts.length === 0) {
    return <LoadingState />;
  }

  if (error && contacts.length === 0) {
    return <ErrorState message={error} onRetry={() => loadContacts()} />;
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddContact}>
        <Text style={styles.floatingButtonText}>+ Add Contact</Text>
      </TouchableOpacity>

      {/* Add Contact Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingContact ? 'Edit Contact' : 'Add New Contact'}
                </Text>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <Spacer size="lg" />

              {/* Form */}
              <FormInput
                label="Full Name"
                value={formData.full_name}
                onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                placeholder="Enter full name"
                error={formErrors.full_name}
                onBlur={() => setFormTouched({ ...formTouched, full_name: true })}
                required
              />

              <Spacer size="md" />

              <FormInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error={formErrors.email}
                onBlur={() => setFormTouched({ ...formTouched, email: true })}
                required
              />

              <Spacer size="md" />

              <FormInput
                label="Phone"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                error={formErrors.phone}
                onBlur={() => setFormTouched({ ...formTouched, phone: true })}
                required
              />

              <Spacer size="xl" />

              {/* Buttons */}
              <Button
                onPress={handleSaveContact}
                disabled={!isFormValid}
                fullWidth
                icon={<Text style={styles.buttonIcon}>💾</Text>}>
                {editingContact ? 'Update Contact' : 'Save Contact'}
              </Button>

              <Spacer size="sm" />

              <Button
                variant="outline"
                onPress={handleCloseModal}
                fullWidth>
                Cancel
              </Button>

              <Spacer size="lg" />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  counter: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
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
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 0,
  },
  clearIcon: {
    fontSize: 20,
    color: Colors.textSecondary,
    padding: Spacing.xs,
  },
  listContent: {
    paddingVertical: Spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  contactInfo: {
    flex: 1,
  },
  deleteButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 24,
  },
  floatingButton: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  floatingButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  modalClose: {
    fontSize: 28,
    color: Colors.textSecondary,
    padding: Spacing.xs,
  },
  buttonIcon: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
