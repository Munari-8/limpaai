import React, { use, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as Yup from 'yup';

// Componentes locais
import Button from '../../components/Button';
import { Colors, Fonts } from '../../components/Theme';
import LogoTitle from '../../components/LogoTitle';
import FormInput from '../../components/FormInput';
import ScreenWrapper from '../../components/ScreenWrapper';

// const API_URL = `http://192.168.0.239:3000`;
const API_URL = `http://10.81.46.69:3000`;

const signupSchema = Yup.object().shape({
    name: Yup.string()
        .required('Nome completo é obrigatório'),
    email: Yup.string()
        .email('E-mail inválido')
        .required('E-mail é obrigatório'),
    birthDate: Yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable()
        .max(new Date(), 'Data de nascimento inválida')
        .required('Data de nascimento é obrigatória'),
    password: Yup.string()
        .min(8, 'Sua senha precisa conter no mínimo 8 digitos')
        .required('Senha é obrigatória'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'As senhas não coincidem')
        .required('Confirmação de senha é obrigatória')
});

export default function SignUpScreen({ navigation }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: '',
        password: '',
        confirmPassword: ''
    });

    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    // Formata a data pra ser compátível com MySQL
    const formatDateForMySQL = (date) => {
        if (!date) return null;
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = `0` + month;
        if (day.length < 2) day = `0` + day;

        return [year, month, day].join(`-`);
    };

    // Calendário
    const [showPicker, setShowPicker] = useState(false);

    const onChangeDate = (event, selectedDate) => {
        setShowPicker(false);

        if (selectedDate) {
            handleInputChange('birthDate', selectedDate);
        }
    };

    const formattedData = formData.birthDate ? formData.birthDate.toLocaleDateString('pt-BR') : '';

    const handleSignUp = async() => {
        try {
            setFormErrors({});

            await signupSchema.validate(formData, { abortEarly: false });
            
            const payload = {
                nome: formData.name,
                email: formData.email,
                senha: formData.password,
                data_nascimento: formatDateForMySQL(formData.birthDate),
                tipo_usuario: `comum`
            };

            const response = await fetch(`${API_URL}/usuarios`, {
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert(`Sucesso!`, `Sua conta foi criada com sucesso`);
                navigation.navigate('Welcome');
            } else {
                Alert.alert(`Erro no cadastro`, data.mensagem || `Houve um erro`);
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const errors = {};

                error.inner.forEach(err => {
                    errors[err.path] = err.message;
                });
                setFormErrors(errors);
            } else {
                console.log(error);
                Alert.alert(`Erro de conexão`, `Não foi possível contatar o servidor`);
            }
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <View style={styles.top}>
                    <LogoTitle text='CRIAR CONTA'/>
                </View>

                <View style={styles.bottom}>
                    <Text style={styles.text1}>Nome</Text>
                    <FormInput
                        placeholder={'Digite seu nome completo'}
                        value={formData.name}
                        setValue={(text) => handleInputChange('name', text)}
                        error={formErrors.name}
                    />

                    <Text style={styles.text1}>E-mail</Text>
                    <FormInput
                        placeholder={'Digite seu e-mail'}
                        value={formData.email}
                        setValue={(text) => handleInputChange('email', text)}
                        error={formErrors.email}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />

                    <Text style={styles.text1}>Data de nascimento</Text>
                    <TouchableOpacity
                        onPress={() => setShowPicker(true)}
                        style={{ width: '100%', alignItems: 'center' }}
                        activeOpacity={0.7}
                    >
                        <View pointerEvents='none' style={{ width: '100%', alignItems: 'center' }}>
                            <FormInput
                                placeholder={'Selecione sua data de nascimento'}
                                value={formattedData}
                                setValue={() => {}}
                                editable={false}
                                error={formErrors.birthDate}
                            />
                        </View>
                    </TouchableOpacity>

                    {showPicker && (
                        <DateTimePicker
                            value={formData.birthDate || new Date()}
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
                        error={formErrors.password}
                    />

                    <Text style={styles.text1}>Confirmar senha</Text>
                    <FormInput
                        placeholder={'Digite sua senha novamente'}
                        value={formData.confirmPassword}
                        setValue={(text) => handleInputChange('confirmPassword', text)}
                        secureTextEntry={true}
                        error={formErrors.confirmPassword}
                    />

                    <View style={{marginTop: '9%'}}></View>
                    
                    <Button
                        text='Criar conta'
                        color={Colors.greenLA1}
                        onPress={handleSignUp}
                    />
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