import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Image } from 'expo-image';

// Componentes locais
import Button from '../../components/Button';
import { Colors, Fonts } from '../../components/Theme';

export default function WelcomeScreen({ navigation }){
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <Text style={styles.text1}>BEM-VINDO(A) AO</Text>

                <Image
                    source={require('../../assets/limpaai-logo.svg')}
                    style={styles.logo}
                />
            </View>

            <View style={styles.bottom}>
                <Text style={styles.text2}>Novo por aqui? Crie já a sua conta!</Text>
                <Button
                    text='Criar Conta'
                    color={Colors.greenLA1}
                    onPress={() => navigation.navigate('SignUp')}
                />
        
                <Text style={styles.text2}>Já tem uma conta?</Text>
                <Button
                    text='Entrar'
                    onPress={() => navigation.navigate('Login')}
                />
            </View>

            <View style={styles.footer}>
                <Text style={[styles.text2, {fontSize: 15}]}>Combatendo a poluição urbana com a união entre as pessoas</Text>
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

        paddingTop: '5%',
        paddingBottom: '5%'
    },
    top: {
        width: '100%' ,
        alignItems: 'center',

        paddingTop: '20%',
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
        paddingHorizontal: '8%'
    },

    // Texto
    text1: {
        fontFamily: Fonts.light,
        fontSize: 20
    },
    text2: {
        fontFamily: Fonts.light,
        fontSize: 16,

        textAlign: 'center',

        marginBottom: 8,
        marginTop: 16
    },

    // Outro
    logo: {
        width: '70%',
        height: 150,
        contentFit: 'contain',

        marginTop: '1%'
    }
});