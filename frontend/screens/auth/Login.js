import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

// Componentes locais
import Button from '../../components/Button';
import { Colors, Fonts } from '../../components/Theme';
import LogoTitle from '../../components/LogoTitle';
import FormInput from '../../components/FormInput';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function LoginScreen({ navigation }) {
    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <View style={styles.top}>
                    <LogoTitle text={'ENTRAR'}/>
                </View>

                <View style={styles.bottom}>
                    <Text style={styles.text1}>E-mail</Text>
                    <FormInput
                        placeholder={'Digite seu e-mail'}
                        keyboardType='email-address'
                        autoCapitalize='none'
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
                            
                    <TouchableOpacity onPress={() => navigation.navigate('PasswordRecoveryEmail')}>
                        <Text style={styles.text1}>Esqueci a senha</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.text2, {fontSize: 15}]}>Combatendo a poluição urbana com a união entre as pessoas</Text>
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    // View
    innerContainer: {
        flex: 1,

        justifyContent: 'space-between',
        alignItems: 'center',

        paddingVertical: '5%'
    },
    top: {
        width: '100%' ,
        alignItems: 'center',
        paddingTop: '15%',
    },
    bottom: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
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