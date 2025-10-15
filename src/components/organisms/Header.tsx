import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@components';
import { Colors, Spacing } from '@constants';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: () => void;
  leftIcon?: React.ReactNode;
  rightAction?: () => void;
  rightIcon?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftAction,
  leftIcon,
  rightAction,
  rightIcon,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {leftIcon && leftAction && (
          <TouchableOpacity onPress={leftAction} style={styles.iconButton}>
            {leftIcon}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text variant="h3" align="center">
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color={Colors.textSecondary} align="center">
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {rightIcon && rightAction && (
          <TouchableOpacity onPress={rightAction} style={styles.iconButton}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: Spacing.xs,
  },
});
