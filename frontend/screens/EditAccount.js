import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";

// Local
import { Colors, Fonts } from "../components/Theme";
import ScreenWrapper from "../components/ScreenWrapper";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { API_URL } from "../services/api";

export default function EditAccount() {
    const { user, updateUserContext } = useAuth;
    const userId = user?.id;

    const [fullName, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Get data instantly
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`${API_URL}/usuarios/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setFullname(data.name || '');
                    setEmail(data.email || '');
                }
            } catch (error) {
                console.log(error);
                Alert.alert("Erro", "Não foi possível carregar seus dados");
            }
        };

        fetchUserData();
    }, [userId]);

    // Send data 2 db
    const handleSave = async () => {
        if (!fullName || !email) {
            Alert.alert("Atenção", "Nome e e-mail são obrigatórios.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/usuarios/${userId}/conta`, {
                method: 'PUT',
                headers: { 'Content-Type': 'appliation/json' },
                body: JSON.stringify({
                    nome: fullName,
                    email: email,
                    senha: password || undefined
                })
            });

            if (response.ok) {
                await updateUserContext({ nome: fullName, email: email });
                Alert.alert("Sucesso!", "Dados da conta atualizados com sucesso.");
                setPassword('');
            } else {
                const errData = await response.json();
                Alert.alert("Erro", errData.mensagem || "Falha ao atualizar a conta");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Falha de conexão com o servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.main}>
                    <Text style={styles.text1}>Nome Completo</Text>
                    <FormInput
                        placeholder="Digite seu nome completo"
                        value={fullName}
                        setValue={setFullname}
                    />

                    <Text style={styles.text1}>E-mail</Text>
                    <FormInput
                        placeholder="Digite seu e-mail"
                        value={email}
                        setValue={setEmail}
                        keyboardType="email-address"
                    />

                    <Text style={styles.text1}>Nova senha</Text>
                    <FormInput
                        placeholder="Deixe em branco para não alterar"
                        value={password}
                        setValue={setPassword}
                        secureTextEntry={true}
                    />
                </View>

                <Button
                    text={loading ? 'Salvando...' : 'Salvar Alterações'}
                    color={Colors.greenLA1}
                    style={{ marginTop: '10%' }}
                    onPress={handleSave}
                    disabled={loading}
                />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: '5%',
        paddingHorizontal: '4%'
    },
    main: {
        width: '100%',

        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    // Text
    text1: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: Colors.greenLA2,

        marginBottom: 4,
        marginTop: 6,
    }
});