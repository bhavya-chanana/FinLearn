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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#ddd',
        tabBarStyle: {
          backgroundColor: '#3E1656',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="FinDucation"
        component={FinDucationScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>📖</Text>
          ),
        }}
      />
      <Tab.Screen
        name="FinGuru"
        component={FinGuruScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>💬</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Finance"
        component={FinanceScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ color, fontSize: size }}>💵</Text>
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
          component={AddTransactionScreen} // Add the AddTransactionScreen here
          options={{
            title: 'Add Transaction', // Set a title for the screen
            headerStyle: {
              backgroundColor: '#3E1656', // Match the header color to the app theme
            },
            headerTintColor: '#fff', // Set the header text color to white
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
