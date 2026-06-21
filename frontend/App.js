import React from 'react';
import { Platform } from 'react-native';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Fontes
import { useFonts, Roboto_300Light, Roboto_400Regular, Roboto_700Bold, RobotoCondensed_900Black } from '@expo-google-fonts/roboto';

// Screens
import WelcomeScreen from './screens/welcome';
import SignUpScreen from './screens/signup';
import LoginScreen from './screens/login';

const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    'Roboto-Light': Roboto_300Light,
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Bold': Roboto_700Bold,
    'Roboto-Condensed-Black': require('./assets/fonts/RobotoCondensed-Black.ttf')
  });
  
  // Se a fonte não carregar, não quebra o texto
  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Welcome'
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='Welcome' component={WelcomeScreen}/>

        <Stack.Screen name='Login' component={LoginScreen}/>

        <Stack.Screen name='SignUp' component={SignUpScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}