import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import QuizScreen from './src/screens/QuizScreen';
import { QuizCategory } from './src/types/quiz';
import ResultScreen from './src/screens/ResultScreen';

// 型定義を更新
export type RootStackParamList = {
  Home: undefined;
  Category: undefined;
  Quiz: { category: QuizCategory };
  Result: { score: number; total: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTintColor: '#fff',
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
            headerLeft: () => null, // 戻るボタンを非表示
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}