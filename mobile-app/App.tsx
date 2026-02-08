import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import AboutScreen from './src/screens/AboutScreen';
import { Quiz, QuizCategory } from './src/types/quiz';
import { Colors } from './src/constants/colors';
import SettingsScreen from './src/screens/SettingsScreen';
import { QuizQuestion } from './src/utils/quizReview'; 
import ReviewScreen from './src/screens/ReviewScreen'; 

// 型定義
export type RootStackParamList = {
  Home: undefined;
  Category: undefined;
  Quiz: { quizzes: Quiz[] };
  About: undefined;
  Settings: undefined;
  Result: { 
    score: number; 
    total: number; 
    skipped: number; 
    category: QuizCategory;
    questionRecords: QuizQuestion[];
  };
  Review: { reviewId: string };
  History: undefined;
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
          name="Review"
          component={ReviewScreen}
          options={{ title: 'Review Quiz' }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ title: 'About' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}