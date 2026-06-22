import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

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

    // Calendário
    const [showPicker, setShowPicker] = useState(false);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || formData.birthDate;

        setShowPicker(false);

        handleInputChange('birthDate', currentDate);
    };

    const formattedData = formData.birthDate.toLocaleDateString('pt-BR');

    // Validação
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
                    value={formData.name}
                    setValue={(text) => handleInputChange('email', text)}
                />

                <Text style={styles.text1}>Data de nascimento</Text>
                <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={{ width: '100%', alignItems: 'center' }}
                >
                    <View pointerEvents='none' style={{ width: '100%', alignItems: 'center' }}>
                        <FormInput
                            placeholder={'Insira sua data de nascimento'}
                            value={formattedData}
                            setValue={() => {}}
                        />
                    </View>
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={formData.birthDate}
                        mode='date'
                        display='default'
                        onChange={onChangeDate}
                        maximumDate={new Date()}
                    />
                )}

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

                <View style={{marginTop: '9%'}}></View>
                <Button
                    text='Criar conta'
                    color={Colors.greenLA1}
                    onPress={handleSignUp}
                />
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
        justifyContent: 'center',

        paddingTop: '5%',
        paddingBottom: '5%'
    },
    top: {
        width: '100%' ,
        alignItems: 'center',

        paddingTop: '20%',
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
        color: Colors.greenLA2,

        marginBottom: 6,
        marginTop: 8
    },
    text2: {
        fontFamily: Fonts.light,
        fontSize: 16,

        textAlign: 'center',

        marginBottom: 8,
        marginTop: 16
    }
});