import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import AboutScreen from './src/screens/AboutScreen';
import QuizCountScreen from './src/screens/QuizCountScreen';
import { Quiz, QuizCategory } from './src/types/quiz';
import { Colors } from './src/constants/colors';

// 型定義
export type RootStackParamList = {
  Home: undefined;
  Category: undefined;
  QuizCount: { category: QuizCategory };
  Quiz: { quizzes: Quiz[] };
  About: undefined;
  Result: { score: number; total: number; skipped: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary.main,
          },
          headerTintColor: Colors.primary.contrast,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Japan Trivia Quiz' }}
        />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={{ title: 'Select Category' }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ title: 'Quiz' }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ 
            title: 'Quiz Results',
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="QuizCount"
          component={QuizCountScreen}
          options={{ title: 'Select Question Count' }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'About' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}