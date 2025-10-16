/**
 * NetworkLoggerButton Component
 * Floating button to show/hide network logger
 * Only visible in development mode
 */

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Animated,
  PanResponder,
} from 'react-native';
import NetworkLogger from 'react-native-network-logger';
import { Text } from '../atoms';
import { Colors } from '../../constants';
import { AppConfig } from '@config';

export const NetworkLoggerButton: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [position] = useState(
    new Animated.ValueXY({ x: 0, y: 0 }),
  );

  // Don't render in production
  if (!AppConfig.enableLogging) {
    return null;
  }

  // Pan responder for draggable button
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      position.setOffset({
        x: (position.x as any)._value,
        y: (position.y as any)._value,
      });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: position.x, dy: position.y }],
      { useNativeDriver: false },
    ),
    onPanResponderRelease: () => {
      position.flattenOffset();
    },
  });

  return (
    <>
      {/* Floating Button */}
      <Animated.View
        style={[
          styles.floatingButton,
          {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
            ],
          },
        ]}
        {...panResponder.panHandlers}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setVisible(true)}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>🌐</Text>
          <Text style={styles.buttonLabel}>API</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Network Logger Modal */}
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Network Logger</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Logger Content */}
          <NetworkLogger theme="dark" />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 9999,
    elevation: 10,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    fontSize: 24,
  },
  buttonLabel: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: 'bold',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: 16,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: 'bold',
  },
});
