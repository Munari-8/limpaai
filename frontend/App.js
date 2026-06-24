import React, { act } from 'react';
import { StyleSheet, Platform, View } from 'react-native';

// React Navigation
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Fontes
import { useFonts, Roboto_300Light, Roboto_400Regular, Roboto_700Bold, RobotoCondensed_900Black } from '@expo-google-fonts/roboto';

// Local
import Panel from './components/Panel';
import Header from './components/Header';

// Screens
import WelcomeScreen from './screens/auth/Welcome';
import SignUpScreen from './screens/auth/Signup';
import LoginScreen from './screens/auth/Login';

import PasswordRecoveryEmailScreen from './screens/passwordRecovery/PasswordRecoveryEmail';
import PasswordRecoveryCodeScreen from './screens/passwordRecovery/PasswordRecoveryCode';
import PasswordRecoveryChangeScreen from './screens/passwordRecovery/PasswordRecoveryChange';

import HomeScreen from './screens/Home';

import InboxScreen from './screens/Messages/Inbox';

import MainMuralScreen from './screens/MuralDeServicos/MainMural';

import MainCatalogoScreen from './screens/CatalogoDeResiduos/MainCatalogo';
import { Colors } from './components/Theme';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

// Logado; App principal
function MainAppTabs() {
  const headerTitles = {
    Home: 'Página Inicial',
    Inbox: 'Mensagens',
    MainCatalogo: 'Catálogo de Resíduos',
    MainMural: 'Mural de Serviços'
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => {
          const activeRouteName = props.state.routes[props.state.index].name;

          return (
            <>
              <Header txt={headerTitles[activeRouteName]}/>
              <Panel {...props}/>
            </>
          );
        }}
        screenOptions={{
          swipeEnabled: true
        }}
      >
        <Tab.Screen name='Home' component={HomeScreen}/>

        <Tab.Screen name='Inbox' component={InboxScreen}/>

        <Tab.Screen name='MainCatalogo' component={MainCatalogoScreen}/>

        <Tab.Screen name='MainMural' component={MainMuralScreen}/>
      </Tab.Navigator>
    </View>
  );
}

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

  // Deslogado; Auth screens
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: Colors.background
          }
        }}
      >
        <Stack.Screen name='Welcome' component={WelcomeScreen}/>
        <Stack.Screen name='SignUp' component={SignUpScreen}/>
        <Stack.Screen name='Login' component={LoginScreen}/>

        <Stack.Screen name='PasswordRecoveryEmail' component={PasswordRecoveryEmailScreen}/>
        <Stack.Screen name='PasswordRecoveryCode' component={PasswordRecoveryCodeScreen}/>
        <Stack.Screen name='PasswordRecoveryChange' component={PasswordRecoveryChangeScreen}/>

        <Stack.Screen
          name='MainApp'
          component={MainAppTabs}
          options={{headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})