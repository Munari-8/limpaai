import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Yup from 'yup';

// Componentes locais
import Button from '../components/button';
import { Colors, Fonts } from '../components/theme';
import LogoTitle from '../components/logoTitle';
import FormInput from '../components/FormInput';

const signupSchema = Yup.object().shape({
    name: Yup.string()
        .required('Nome completo é obrigatório'),
        
    email: Yup.string()
        .email('E-mail inválido')
        .required('E-mail é obrigatório'),

    birthDate: Yup.date()
        .max(new Date(), 'Data de nascimento inválida')
        .required('Data de nascimento é obrigatória'),

    password: Yup.string()
        .min(8, 'Sua senha precisa conter no mínimo 8 digitos')
        .required('Senha é obrigatória'),
                
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'As senhas não coincidem')
        .required('Confirmação de senha é obrigatória')
});

export default function SignUpScreen() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: new Date(),
        password: '',
        confirmPassword: ''
    });

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const handleSignUp = async() => {
        try {
            await signupSchema.validate(formData, { abortEarly: false });

            alert('GAMES');
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                alert(error.errors[0]);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <LogoTitle text='CRIAR CONTA'/>
            </View>

            <View style={styles.bottom}>
                <Text style={styles.text1}>Nome</Text>
                <FormInput
                    placeholder={'Digite seu nome completo'}
                    value={formData.name}
                    setValue={(text) => handleInputChange('name', text)}
                />

                <Text style={styles.text1}>E-mail</Text>
                <FormInput
                    placeholder={'Digite seu e-mail'}
                    value={formData.email}
                    setValue={(text) => handleInputChange('email', text)}
                />

                <Text style={styles.text1}>Data de nascimento</Text>
                <FormInput
                    placeholder={'Insira sua data de nascimento'}
                    value={formData.birthDate}
                    setValue={(text) => handleInputChange('birthDate', text)}
                />

                <Text style={styles.text1}>Senha</Text>
                <FormInput
                    placeholder={'Digite sua senha'}
                    value={formData.password}
                    setValue={(text) => handleInputChange('password', text)}
                    secureTextEntry={true}
                />

                <Text style={styles.text1}>Confirmar senha</Text>
                <FormInput
                    placeholder={'Digite sua senha novamente'}
                    value={formData.confirmPassword}
                    setValue={(text) => handleInputChange('confirmPassword', text)}
                    secureTextEntry={true}
                />

                <Button
                    text='Criar conta'
                    color={Colors.greenLA1}
                    onPress={handleSignUp}
                />
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

    // Text
    text1: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: Colors.greenLA2
    }
});