import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

// Componentes locais
import Button from '../../components/Button';
import { Colors, Fonts } from '../../components/Theme';
import LogoTitle from '../../components/LogoTitle';
import FormInput from '../../components/FormInput';
import ScreenWrapper from '../../components/ScreenWrapper';
import { useAuth } from '../../contexts/AuthContext';

// const API_URL = `http://192.168.0.239:3000`;
const API_URL = `http://10.81.46.69:3000`;

// const API_URL = `http://10.81.46.198:3000`;

export default function LoginScreen({ navigation }) {
    // Contexto de autenticação
    const { login } = useAuth();

    // Estados para armazenar o e-mail, senha e estado de carregamento
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    senha: password
                })
            });

            const data = await response.json();

            if (response.ok && data.sucesso) {
                await login(data.user);

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainApp' }]
                });
            } else {
                Alert.alert(`Falha no login`, data.mensagem || `E-mail ou senha incorretos`);
            }
        } catch (error) {
            console.log(error);
            Alert.alert(`Erro de conexão`, `Não foi possível se comunicar com a API do servidor`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <View style={styles.top}>
                    <LogoTitle text={'entrar'}/>
                </View>

                <View style={styles.bottom}>
                    <Text style={styles.text1}>E-mail</Text>
                    <FormInput
                        placeholder={'Digite seu e-mail'}
                        keyboardType='email-address'
                        autoCapitalize='none'
                        value={email}
                        setValue={setEmail}
                    />

                    <Text style={styles.text1}>Senha</Text>
                    <FormInput
                        placeholder={'Digite sua senha'}
                        secureTextEntry={true}
                        value={password}
                        setValue={setPassword}
                    />
                        
                    <View style={{marginTop: '9%'}}></View>

                    <Button
                        text={loading ? `Carregando...` : `Entrar`}
                        color={Colors.greenLA1}
                        onPress={handleLogin}
                        disabled={loading}
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