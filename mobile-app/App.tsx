import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { quizzes } from './src/data/quizData';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Japan Trivia Quiz</Text>
      <Text style={styles.text}>
        クイズ数: {quizzes.length}
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
});