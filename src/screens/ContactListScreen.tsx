/**
 * Contact List Screen
 * Main screen untuk menampilkan daftar kontak
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Text } from '@components';
import { ListItem, LoadingState, ErrorState } from '@components';
import { Colors, Spacing } from '@constants';

interface Contact {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface ContactListScreenProps {
  navigation: any;
}

export const ContactListScreen: React.FC<ContactListScreenProps> = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data untuk sekarang
  const mockContacts: Contact[] = [
    {
      id: 1,
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 8901',
      avatar: '👨',
    },
    {
      id: 2,
      full_name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234 567 8902',
      avatar: '👩',
    },
    {
      id: 3,
      full_name: 'Bob Johnson',
      email: 'bob.j@example.com',
      phone: '+1 234 567 8903',
      avatar: '👨‍💼',
    },
    {
      id: 4,
      full_name: 'Alice Williams',
      email: 'alice.w@example.com',
      phone: '+1 234 567 8904',
      avatar: '👩‍💻',
    },
    {
      id: 5,
      full_name: 'Charlie Brown',
      email: 'charlie.b@example.com',
      phone: '+1 234 567 8905',
      avatar: '🧑',
    },
  ];

  useEffect(() => {
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      setTimeout(() => {
        setContacts(mockContacts);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      console.error('Load contacts error:', err);
      setError('Failed to load contacts');
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  };

  const handleContactPress = (contact: Contact) => {
    Alert.alert(
      contact.full_name,
      `Email: ${contact.email}\nPhone: ${contact.phone}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Call:', contact.phone) },
        { text: 'Email', onPress: () => console.log('Email:', contact.email) },
      ],
    );
  };

  const handleAddContact = () => {
    Alert.alert('Add Contact', 'Feature coming soon!');
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <ListItem
      title={item.full_name}
      subtitle={item.email}
      onPress={() => handleContactPress(item)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Contacts</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleAddContact}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

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

  if (error) {
    return <ErrorState message={error} onRetry={loadContacts} />;
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: Spacing.sm,
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
});
