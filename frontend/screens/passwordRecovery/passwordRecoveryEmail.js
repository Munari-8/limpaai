import React, { use, useState } from "react";
import { StyleSheet, View, Text } from "react-native";

import * as Yup from 'yup';

// Componentes locais
import { Colors, Fonts } from "../../components/theme";
import LogoTitle from "../../components/logoTitle";
import FormInput from "../../components/FormInput";
import Button from "../../components/button";

const recoverySchema = Yup.object().shape({
    email: Yup.string()
        .email('E-mail inválido')
        .required('Digite seu e-mail')
});

export default function PasswordRecoveryEmailScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    //Validação do e-mail
    const handleRecovery = async () => {
        try {
            setEmailError('');

            await recoverySchema.validate({ email }, { abortEarly: false });

            navigation.navigate('PasswordRecoveryCode')
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setEmailError(error.inner[0].message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <LogoTitle text={'RECUPERAR SENHA'}/>

                <Text style={styles.text2}>Será enviado um código de recuperação de senha para o seu e-mail, insira-o quando requisitado.</Text>
            </View>

            <View style={styles.bottom}>
                <Text style={styles.text1}>E-mail</Text>
                <FormInput
                    placeholder={'Digite seu e-mail'}
                    value={email}
                    setValue={setEmail}
                    error={emailError}
                    keyboardType='email-address'
                    autoCapitalize='none'
                />
                
                <View style={{marginTop: '9%'}}></View>

                <Button
                    text={'Entrar'}
                    color={Colors.greenLA1}
                    onPress={handleRecovery}
                />
            </View>

            <View style={styles.footer}>
                <Text style={[styles.text2, {fontSize: 15}]}>Combatendo a poluição urbana com a união entre as pessoas</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        marginTop: 16,
        marginHorizontal: '5%'
    }
})