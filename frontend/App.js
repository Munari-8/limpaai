import React from 'react';
import { Platform } from 'react-native';

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Fontes
import { useFonts, Roboto_300Light, Roboto_400Regular, Roboto_700Bold, RobotoCondensed_900Black } from '@expo-google-fonts/roboto';

// Screens
import WelcomeScreen from './screens/auth/welcome';
import SignUpScreen from './screens/auth/signup';
import LoginScreen from './screens/auth/login';
import HomeScreen from './screens/home';
import PasswordRecoveryScreen from './screens/passwordRecovery';

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

        <Stack.Screen name='SignUp' component={SignUpScreen}/>

        <Stack.Screen name='Login' component={LoginScreen}/>

        <Stack.Screen name='PasswordRecovery' component={PasswordRecoveryScreen}/>

        <Stack.Screen name='Home' component={HomeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}