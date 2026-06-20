import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

// Fontes
import {useFonts, Roboto_300Light } from '@expo-google-fonts/roboto';

// Componentes locais
import Button from './components/button';
import { Colors } from './components/theme';

export default function App() {
  let [fontsLoaded] = useFonts({
    'Roboto-Light': Roboto_300Light,
  });

  // Se a fonte não carregar, não quebra o texto
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.text1}>BEM-VINDO(A) AO</Text>

        <Image
          source={require('./assets/limpaai-logo.svg')}
          style={styles.logo}
        />
      </View>

      <View style={styles.bottom}>
        <Text style={styles.text2}>Novo por aqui? Crie já a sua conta!</Text>
        <Button
          text='Criar Conta'
          color={Colors.greenLA1}
        />
        
        <Text style={styles.text2}>Já tem uma conta?</Text>
        <Button text='Entrar'/>
      </View>

      <View style={styles.footer}>
        <Text style={styles.text2}>Combatendo a poluição urbana com a união entre as pessoas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // View
  container: {
    flex: 1,
    backgroundColor: Colors.background,

    alignItems: 'center',
    justifyContent: 'flex-start',

    paddingVertical: '10%'
  },
  top: {
    width: '100%' ,
    alignItems: 'center',

    paddingTop: '25%',
    marginTop: '10%'
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: '5%'
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: '10%'
  },

  // Texto
  text1: {
    fontFamily: 'Roboto-Light',
    fontSize: 20
  },
  text2: {
    fontFamily: 'Roboto-Light',
    fontSize: 16,

    textAlign: 'center',

    marginBottom: 8,
    marginTop: 16
  },

  // Outro
  logo: {
    width: '70%',
    height: 150,
    resizeMode: 'contain',

    marginTop: '1%'
  }
});