import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import MeditationScreen from './src/screens/Meditation';
import { RootStackParamList } from './src/types/navigation';
import { Provider } from 'react-redux';
import {store} from './src/stores/store';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Meditation" component={MeditationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
}
