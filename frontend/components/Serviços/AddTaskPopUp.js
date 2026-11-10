import React, { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

// Local
import { Colors, Fonts } from "../Theme";
import FormInput2 from "../FormInput2";
import Button from "../Button";
import { API_URL } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import FormSelect from "../FormSelect";

export default function AddTaskPopUp({ visible, onClose, onSuccess }) {
    const { user } = useAuth();

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [taskType, setTaskType] = useState('');
    const [endereco, setEndereco] = useState('');
    const [data, setData] = useState('');
    const [horario, setHorario] = useState('');
    const [vagasMax, setVagasMax] = useState('');
    const [loading, setLoading] = useState(false);

    const typeList = [
        'Animais',
        'Hortas',
        'Limpeza'
    ];

    const handleCreateService = async () => {
        if (!titulo || !endereco || !data || !horario) {
            Alert.alert("Atenção", "Preencha os campos obrigatórios.");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/servicos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_ofertante: user?.id,
                    titulo,
                    descricao,
                    endereco,
                    data,
                    horario,
                    vagas_max: parseInt(vagasMax) || 10
                })
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert("Sucesso!", "Serviço criado com sucesso.");
                // Clear form fields
                setTitulo('');
                setDescricao('');
                setEndereco('');
                setData('');
                setHorario('');
                setVagasMax('');
                if (onSuccess) onSuccess();
            } else {
                Alert.alert("Erro", result.mensagem || "Não foi possível criar o serviço.")
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Erro de conexão", "Não foi possível contatar o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.bgShadow}>
                <TouchableOpacity
                    style={styles.backdropTouch}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.textTitle}>CRIAR SERVIÇO</Text>

                        <FormInput2
                            placeholder={'Insira o nome do serviço'}
                            maxLength={21}
                            value={titulo}
                            setValue={setTitulo}
                        />

                        <FormInput2
                            placeholder={'Descreva o serviço'}
                            maxLength={88}
                            value={descricao}
                            setValue={setDescricao}
                        />

                        <View style={styles.label}>
                            <MaterialIcons
                                name="bookmark"
                                size={24}
                            />

                            <Text style={styles.labelText}>Tipo do Serviço</Text>
                        </View>
                        
                        <FormSelect
                            placeholder={'Selecione o tipo do serviço'}
                            options={typeList}
                            selectedValue={taskType}
                            onSelect={setTaskType}
                        />

                        <View style={styles.label}>
                            <MaterialCommunityIcons
                                name="calendar"
                                size={24}
                            />

                            <Text style={styles.labelText}>Data</Text>
                        </View>

                        {/* Aq tem q pôr o coiso pra selecionar a data por um calendário, q nem na SignUp.js */}


                        <View style={styles.label}>
                            <MaterialCommunityIcons
                                name="clock"
                                size={24}
                            />

                            <Text style={styles.labelText}>Horário</Text>
                        </View>

                        {/* Aq tem q pôr o coiso de selecionar a data (um modalzinho com um relógio) */}


                        {/* Aq vai ser a parte das fotos */}


                        <View style={styles.label}>
                            <MaterialIcons
                                name="location-pin"
                                size={24}
                            />

                            <Text style={styles.labelText}>Localização</Text>
                        </View>

                        {/* Aq tem q por algum jeito do usuário selecionar o endereço, algo tipo um mapinha */}


                        <View style={styles.label}>
                            <MaterialIcons
                                name="group"
                                size={24}
                            />

                            <Text style={styles.labelText}>Participantes</Text>
                        </View>

                        <FormInput2
                            placeholder={'Insira o número máx. de participantes'}
                            keyboardType='numeric'
                            value={vagasMax}
                            setValue={setVagasMax}
                        />

                        <View style={{ width: '100%', marginTop: 24, flexDirection: 'row' }}>
                            <Button
                                text={loading ? 'Publicando...' : 'Publicar no Mural'}
                                flex={true}
                                onPress={handleCreateService}
                                disabled={loading}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    bgShadow: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: Colors.b25
    },
    backdropTouch: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0
    },
    container: {
        backgroundColor: Colors.background,

        borderRadius: 24,
        width: '85%',
        maxHeight: '85%',

        overflow: 'hidden'
    },
    scrollContent: {
        padding: '5%',

        alignItems: 'center'
    },
    label: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        width: '100%'
    },

    // Text
    textTitle: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 24,

        marginBottom: 8
    },
    textLabel: {
        fontFamily: Fonts.bold,
        fontSize: 16
    }
})