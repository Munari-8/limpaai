import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// Componentes locais
import Button from '../../components/button';
import { Colors, Fonts } from '../../components/theme';
import LogoTitle from '../../components/logoTitle';
import FormInput from '../../components/FormInput';

export default function LoginScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <LogoTitle text={'ENTRAR'}/>
            </View>

            <View style={styles.bottom}>
                <Text style={styles.text1}>E-mail</Text>
                <FormInput
                    placeholder={'Digite seu e-mail'}
                />

                <Text style={styles.text1}>Senha</Text>
                <FormInput
                    placeholder={'Digite sua senha'}
                    secureTextEntry={true}
                />
                
                <View style={{marginTop: '9%'}}></View>

                <Button
                    text={'Entrar'}
                    color={Colors.greenLA1}
                />
                
                <TouchableOpacity onPress={() => navigation.navigate('PasswordRecovery')}>
                    <Text style={styles.text1}>Esqueci a senha</Text>
                </TouchableOpacity>
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
        justifyContent: 'center',

        paddingVertical: '5%'
    },
    top: {
        width: '100%' ,
        alignItems: 'center',

        paddingTop: '20%',
        marginTop: '5%'
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

    // Text
    text1: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: Colors.greenLA2,

        marginBottom: 4,
        marginTop: 6
    },
    text2: {
        fontFamily: Fonts.light,
        fontSize: 16,

        textAlign: 'center',

        marginBottom: 8,
        marginTop: 16
    }
});