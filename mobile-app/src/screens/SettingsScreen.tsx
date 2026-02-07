import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../constants/styles';
import { getDefaultQuestionCount, setDefaultQuestionCount, QuestionCountOption } from '../utils/settings';
import { clearStatistics } from '../utils/statistics';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const questionOptions: { value: QuestionCountOption; label: string; description: string }[] = [
  { value: 5, label: '5 Questions', description: 'Quick session (~3 min)' },
  { value: 10, label: '10 Questions', description: 'Standard session (~5 min)' },
  { value: 20, label: '20 Questions', description: 'Long session (~10 min)' },
  { value: 'all', label: 'All Questions', description: 'Complete category' },
];

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const [selectedCount, setSelectedCount] = useState<QuestionCountOption>(10);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const count = await getDefaultQuestionCount();
    setSelectedCount(count);
  };

  const handleSelectOption = (value: QuestionCountOption) => {
    setSelectedCount(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    await setDefaultQuestionCount(selectedCount);
    setHasChanges(false);
    Alert.alert('Success', 'Settings saved successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const handleResetStatistics = () => {
    Alert.alert(
      'Reset Statistics?',
      'This will permanently delete all your quiz history and statistics. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: async () => {
            await clearStatistics();
            Alert.alert('Success', 'Statistics have been reset.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your quiz experience</Text>
        </View>

        {/* Quiz Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiz Settings</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Default Question Count</Text>
            <Text style={styles.cardDescription}>
              Choose how many questions you want in each quiz by default
            </Text>

            <View style={styles.optionsContainer}>
              {questionOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    selectedCount === option.value && styles.optionButtonSelected
                  ]}
                  onPress={() => handleSelectOption(option.value)}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.radioButton}>
                      {selectedCount === option.value && <View style={styles.radioButtonInner} />}
                    </View>
                    <View style={styles.optionText}>
                      <Text style={[
                        styles.optionLabel,
                        selectedCount === option.value && styles.optionLabelSelected
                      ]}>
                        {option.label}
                      </Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

{/* Statistics Section */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Statistics</Text>
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Reset All Statistics</Text>
    <Text style={styles.cardDescription}>
      Delete all quiz history and statistics data
    </Text>

    <TouchableOpacity
      style={styles.dangerButton}
      onPress={handleResetStatistics}
    >
      <Text style={styles.dangerButtonText}>Reset Statistics</Text>
    </TouchableOpacity>
  </View>
</View>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            💡 You can change this setting anytime. Your preference will be saved for all future quizzes.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!hasChanges}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
  section: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadow.md,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  optionButton: {
    backgroundColor: Colors.background.main,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionButtonSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary.main,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
  },
  optionLabelSelected: {
    color: Colors.primary.main,
  },
  optionDescription: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  infoSection: {
    padding: Spacing.lg,
  },
  infoText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    lineHeight: FontSize.sm * 1.5,
    textAlign: 'center',
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background.card,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.primary.main,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary.main,
  },
  saveButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    ...Shadow.md,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary.contrast,
  },
  dangerButton: {
    backgroundColor: Colors.error,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Shadow.sm,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});