import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@atoms/Text';
import { Colors, Spacing, BorderRadius } from '@constants';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'expanded';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'compact',
}) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const currentLanguage = i18n.language;

  if (variant === 'compact') {
    return (
      <View style={styles.compactContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            currentLanguage === 'en' && styles.activeButton,
          ]}
          onPress={() => changeLanguage('en')}>
          <Text
            translate={false}
            style={[
              styles.languageText,
              currentLanguage === 'en' && styles.activeText,
            ]}>
            EN
          </Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={[
            styles.languageButton,
            currentLanguage === 'id' && styles.activeButton,
          ]}
          onPress={() => changeLanguage('id')}>
          <Text
            translate={false}
            style={[
              styles.languageText,
              currentLanguage === 'id' && styles.activeText,
            ]}>
            ID
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.expandedContainer}>
      <Text variant="h3" i18nKey="language.title" style={styles.title} />
      <TouchableOpacity
        style={[
          styles.expandedButton,
          currentLanguage === 'en' && styles.expandedActiveButton,
        ]}
        onPress={() => changeLanguage('en')}>
        <Text
          i18nKey="language.english"
          style={[
            styles.expandedText,
            currentLanguage === 'en' && styles.expandedActiveText,
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.expandedButton,
          currentLanguage === 'id' && styles.expandedActiveButton,
        ]}
        onPress={() => changeLanguage('id')}>
        <Text
          i18nKey="language.indonesian"
          style={[
            styles.expandedText,
            currentLanguage === 'id' && styles.expandedActiveText,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  languageButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  activeButton: {
    backgroundColor: Colors.primary,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeText: {
    color: Colors.white,
  },
  separator: {
    width: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  expandedContainer: {
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.md,
  },
  expandedButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.card,
  },
  expandedActiveButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  expandedText: {
    fontSize: 16,
    color: Colors.text,
  },
  expandedActiveText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
