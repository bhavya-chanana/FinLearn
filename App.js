import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FinDucationScreen from './screens/FinDucationScreen';
import FinGuruScreen from './screens/FinGuruScreen';
import FinanceScreen from './screens/FinanceScreen';
import QuizScreen from './screens/QuizScreen';
import AddTransactionScreen from './screens/AddTransactionScreen'; // Import the AddTransactionScreen
import { Text } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#ddd',
        tabBarStyle: {
          backgroundColor: '#1F1B2E',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingBottom: 10, // Increase padding
          paddingTop: 10, // Increase padding
          height: 70, // Adjust height of the navbar
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 14, // Increase the size of the label text
          paddingBottom: 5, // Add padding to the label
        },
      }}
    >
      <Tab.Screen
        name="FinDucation"
        component={FinDucationScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="book" size={size + 4} color={color} /> // Increase icon size
          ),
        }}
      />
      <Tab.Screen
        name="FinGuru"
        component={FinGuruScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chat-question" size={size + 4} color={color} /> // Increase icon size
          ),
        }}
      />
      <Tab.Screen
        name="Finance"
        component={FinanceScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="rupee" size={size + 4} color={color} /> // Increase icon size
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MyTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuizScreen"
          component={QuizScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTransaction"
          component={AddTransactionScreen}
          options={{
            title: 'Add Transaction',
            headerStyle: {
              backgroundColor: '#1F1B2E',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}