import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../constants/styles';

const categories = [
  { 
    id: 'random', 
    name: 'Random Quiz', 
    emoji: '🎲', 
    color: Colors.accent.main,
    description: 'Mix of all categories'
  },
  { id: 'culture', name: 'Culture', emoji: '🎎', color: Colors.category.culture, description: 'Traditional and modern culture' },
  { id: 'food', name: 'Food', emoji: '🍣', color: Colors.category.food, description: 'Japanese cuisine' },
  { id: 'history', name: 'History', emoji: '🏯', color: Colors.category.history, description: 'Historical events and figures' },
  { id: 'geography', name: 'Geography', emoji: '🗾', color: Colors.category.geography, description: 'Places and landmarks' },
  { id: 'language', name: 'Language', emoji: '🈷️', color: Colors.category.language, description: 'Japanese language basics' },
  { id: 'tradition', name: 'Tradition', emoji: '⛩️', color: Colors.category.tradition, description: 'Customs and traditions' },
];

export default function CategorySelectionScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Category</Text>
        <Text style={styles.subtitle}>Choose a topic to get started</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard, 
                { borderLeftColor: category.color, borderLeftWidth: 4 }
              ]}
              onPress={() => navigation.navigate('QuizCount', { category: category.id })}
            >
              <Text style={styles.emoji}>{category.emoji}</Text>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
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
    fontWeight: FontWeight.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  categoriesContainer: {
    gap: Spacing.md,
  },
  categoryCard: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadow.sm,
  },
  emoji: {
    fontSize: 40,
    marginRight: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  categoryDescription: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
  },
});