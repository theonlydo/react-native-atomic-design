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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text, Button, Spacer } from '@components';
import { LoadingState, ErrorState, FormInput } from '@components';
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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);

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
    } catch (err: any) {
      console.error('=== SAVE CONTACT ERROR ===');
      console.error('Error:', err);
      Alert.alert('Error', err.message || 'Failed to save contact');
    }
  };

  const handleDeleteContact = (contactId: number) => {
    setContactToDelete(contactId);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      console.log('=== DELETE CONTACT API CALL ===');
      console.log('Contact ID:', contactToDelete);

      const response = await contactApi.delete(contactToDelete);

      if (response.status === 1) {
        setDeleteModalVisible(false);
        setContactToDelete(null);
        await loadContacts(1, searchQuery); // Reload contacts
      } else {
        Alert.alert('Error', response.message || 'Failed to delete contact');
      }
    } catch (err: any) {
      console.error('=== DELETE CONTACT ERROR ===');
      console.error('Error:', err);
      Alert.alert('Error', err.message || 'Failed to delete contact');
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setContactToDelete(null);
  };

  const getInitials = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const getAvatarColor = (name: string): string => {
    // Generate consistent color based on name
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195', '#C06C84',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}>
      {/* Avatar with Initials */}
      <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.full_name) }]}>
        <Text style={styles.avatarText}>{getInitials(item.full_name)}</Text>
      </View>

      {/* Contact Info */}
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.full_name}</Text>
        <Text style={styles.contactDetail}>
          <Icon name="phone" size={14} color={Colors.textSecondary} /> {item.phone}
        </Text>

      </View>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={(e) => {
          e.stopPropagation();
          handleDeleteContact(item.id);
        }}>
        <Icon name="delete" size={24} color={Colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts</Text>
        <Text style={styles.counter}>{totalCount} Contacts</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
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
            <Icon name="close" size={20} color={Colors.textSecondary} />
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
        <Icon name="person-add" size={24} color={Colors.white} />
      </TouchableOpacity>

      {/* Add/Edit Contact Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleCloseModal}
          />
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingContact ? 'Edit Contact' : 'Add New Contact'}
                </Text>
                <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                  <Icon name="close" size={20} color={Colors.textSecondary} />
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

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={cancelDelete}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={cancelDelete}
          />
          <View style={styles.deleteModalContent}>
            {/* Close Icon */}
            <TouchableOpacity onPress={cancelDelete} style={styles.closeButton}>
              <Icon name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            {/* Content */}
            <View style={styles.deleteModalIcon}>
              <Icon name="delete" size={48} color={Colors.error} />
            </View>

            <Text style={styles.deleteModalTitle}>Delete Contact</Text>
            <Text style={styles.deleteModalMessage}>
              Are you sure you want to delete this contact? This action cannot be undone.
            </Text>

            {/* Buttons */}
            <View style={styles.deleteModalButtons}>
              <Button
                variant="outline"
                onPress={cancelDelete}
                style={styles.deleteModalButton}>
                Cancel
              </Button>
              <View style={styles.deleteModalButton}>
                <TouchableOpacity
                  onPress={confirmDelete}
                  style={styles.deleteButtonStyle}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
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
    backgroundColor: Colors.primary,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.white,
  },
  counter: {
    color: Colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 0,
  },
  listContent: {
    paddingVertical: Spacing.sm,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  deleteButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.lg,
    width: 60,
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 30,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    maxHeight: '90%',
    width: '90%',
    maxWidth: 400,
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
    flex: 1,
  },
  closeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  buttonIcon: {
    fontSize: 20,
  },
  deleteModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.xl,
    width: '85%',
    maxWidth: 340,
    alignItems: 'center',
  },
  deleteModalIcon: {
    marginBottom: Spacing.md,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  deleteModalMessage: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
  },
  deleteModalButton: {
    flex: 1,
  },
  deleteButtonStyle: {
    backgroundColor: Colors.error,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
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
