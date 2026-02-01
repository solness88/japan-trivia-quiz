import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { quizzes } from '../data/quizData';

type AboutScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'About'>;
};

export default function AboutScreen({ navigation }: AboutScreenProps) {
  const appVersion = '1.0.0';

  const openURL = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* アプリについて */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🇯🇵 About This App</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Japan Trivia Quiz is the perfect companion for your flight to Japan. 
              Learn about Japanese culture, food, history, and etiquette through 
              fun and engaging quizzes.
            </Text>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>✈️</Text>
              <Text style={styles.featureText}>Perfect for flights - 100% offline</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>📚</Text>
              <Text style={styles.featureText}>{quizzes.length}+ questions about Japan</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Multiple categories and difficulty levels</Text>
            </View>
          </View>
        </View>

        {/* 作者について */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍💻 About the Creator</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Created by a developer living in Fukuoka, Japan with 20+ years of 
              experience exploring Japanese culture.
            </Text>
            <Text style={styles.cardSubtext}>
              Currently studying Computer Science at a UK university while building 
              apps to help travelers discover Japan.
            </Text>
          </View>
        </View>

        {/* ブログ（準備中） */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Blog</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Want to see photos and stories from real experiences in Japan?
            </Text>
            <TouchableOpacity 
              style={styles.blogButton}
              onPress={() => alert('Blog coming soon! Stay tuned for photos and travel tips from Japan.')}
            >
              <Text style={styles.blogButtonText}>Visit Blog (Coming Soon)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* フィードバック */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Feedback</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Found a bug? Have a suggestion? We'd love to hear from you!
            </Text>
            <TouchableOpacity 
              style={styles.feedbackButton}
              onPress={() => openURL('mailto:your-email@example.com?subject=Japan Trivia Quiz Feedback')}
            >
              <Text style={styles.feedbackButtonText}>Send Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* バージョン情報 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ App Info</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>{appVersion}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Questions</Text>
              <Text style={styles.infoValue}>{quizzes.length}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>January 2026</Text>
            </View>
          </View>
        </View>

        {/* 法的情報 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Legal</Text>
          <View style={styles.card}>
            <TouchableOpacity 
              style={styles.legalLink}
              onPress={() => alert('Privacy Policy:\n\nThis app does not collect any personal data. All quiz progress is stored locally on your device.')}
            >
              <Text style={styles.legalLinkText}>Privacy Policy</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.legalLink}
              onPress={() => alert('Terms of Use:\n\nThis app is provided as-is for educational and entertainment purposes.')}
            >
              <Text style={styles.legalLinkText}>Terms of Use</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* フッター */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ in Fukuoka, Japan</Text>
          <Text style={styles.footerSubtext}>© 2026 Japan Trivia Quiz</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#4b5563',
  },
  blogButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  blogButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  feedbackButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  feedbackButtonText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '600',
  },
  legalLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  legalLinkText: {
    fontSize: 15,
    color: '#2563eb',
  },
  arrow: {
    fontSize: 18,
    color: '#2563eb',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
});