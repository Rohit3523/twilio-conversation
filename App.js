import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import { Provider, useSelector } from 'react-redux';
import store from './redux/store';

import Login from './screens/login';
import Main from './screens/main';
import Chat from './screens/chatscreen';

function MainApp() {
  let state = useSelector((state)=> state);
   
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false,
        animation: 'none'
      }}>
      {
        state.token == null ? (
            <Stack.Screen name="Login" component={Login} />
        ) : (
          <>
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Chat" component={Chat} />
          </>
        )
      }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  )
}