import React, { act } from 'react';
import { StyleSheet, Platform, View } from 'react-native';

// React Navigation
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Fontes
import { useFonts, Roboto_300Light, Roboto_400Regular, Roboto_500Medium, Roboto_700Bold} from '@expo-google-fonts/roboto';

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
import EditProfile from './screens/EditProfile';

import InboxScreen from './screens/Messages/Inbox';
import ChatScreen from './screens/Messages/Chat';

import MainCatalogoScreen from './screens/CatalogoDeResiduos/MainCatalogo';
import VidroScreen from './screens/CatalogoDeResiduos/Vidro';
import MetalScreen from './screens/CatalogoDeResiduos/Metal';
import PlasticoScreen from './screens/CatalogoDeResiduos/Plastico';
import PapelScreen from './screens/CatalogoDeResiduos/Papel';
import OrganicoScreen from './screens/CatalogoDeResiduos/Organico';
import NaoReciclavel from './screens/CatalogoDeResiduos/NaoReciclavel';
import YourSuggestionsScreen from './screens/CatalogoDeResiduos/YourSuggestions';

import MainMuralScreen from './screens/MuralDeServicos/MainMural';

import { Colors } from './components/Theme';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const CatalogStack = createNativeStackNavigator();

function CatalogStackNavigator() {
  return (
    <CatalogStack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <CatalogStack.Screen name='MainCatalogoScreen' component={MainCatalogoScreen}/>

      <CatalogStack.Screen name='CatalogoDeResiduos' component={CatalogoDeResiduos}/>

      <CatalogStack.Screen name='YourSuggestions' component={YourSuggestionsScreen}/>
    </CatalogStack.Navigator>
  );
}

// Logado; App principal
function MainAppTabs() {
  const headerTitles = {
    Home: 'Página Inicial',
    Inbox: 'Mensagens',
    MainCatalogo: 'Catálogo de Resíduos',
    MainCatalogoScreen: 'Catálogo de Resíduos',
    YourSuggestions: 'Suas Sugestões',
    MainMural: 'Mural de Serviços'
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => {
          const route = props.state.routes[props.state.index];

          const nestedRouteName = getFocusedRouteNameFromRoute(route);

          const activeRouteName = nestedRouteName || route.name;

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

        <Tab.Screen
          name='MainCatalogo'
          component={CatalogStackNavigator}
          options={({ route }) =>{
            const routeName = getFocusedRouteNameFromRoute(route);

            if (routeName === 'CatalogoDeResiduos') {
              return { swipeEnabled: false };
            }

            return { swipeEnabled: true }
          }}  
        />

        <Tab.Screen name='MainMural' component={MainMuralScreen}/>
      </Tab.Navigator>
    </View>
  );
}

function CatalogoDeResiduos() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={() => null}

        screenOptions={{
          swipeEnabled: true
        }}
      >
        <Tab.Screen name='Vidro' component={VidroScreen}/>

        <Tab.Screen name='Metal' component={MetalScreen}/>
        
        <Tab.Screen name='Plastico' component={PlasticoScreen}/>
        
        <Tab.Screen name='Papel' component={PapelScreen}/>

        <Tab.Screen name='Organico' component={OrganicoScreen}/>

        <Tab.Screen name='NaoReciclavel' component={NaoReciclavel}/>
      </Tab.Navigator>
    </View>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    'Roboto-Light': Roboto_300Light,
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-Bold': Roboto_700Bold,
    'Roboto-Condensed-Black': require('./assets/fonts/RobotoCondensed-Black.ttf'),
    'Roboto-Condensed-SemiBold': require('./assets/fonts/RobotoCondensed-SemiBold.ttf')
  });
  
  // Se a fonte não carregar, não quebra o texto
  if (!fontsLoaded) {
    return null;
  }

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

        <Stack.Screen
          name='Chat'
          component={ChatScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name='CatalogoDeResiduos'
          component={CatalogoDeResiduos}
          options={{ headerShown: false }}
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