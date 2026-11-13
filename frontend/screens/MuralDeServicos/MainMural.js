import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Componentes locais
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import ToggleList from "../../components/ToggleList";
import TaskBox from "../../components/Serviços/TaskBox";
import MuralMenu from "../../components/Serviços/MuralMenu";
import { API_URL } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function MainMuralScreen() {
    const { user } = useAuth();
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadServicos = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/servicos?id_usuario=${user?.id}`);
            const data = await response.json();
            if (response.ok) {
                setServicos(data);
            }
        } catch (error) {
            console.log("Erro ao carregar serviços:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadServicos();
    }, []);

    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <ScrollView style={styles.main} showVerticalScrollIndicator={false}>
                    <ToggleList
                        text={'Serviços disponíveis'}
                    >
                        {loading ? (
                            <ActivityIndicator size="large" color={Colors.greenLA1} />
                        ) : (
                            servicos.map((item) => (
                                <TaskBox
                                    key={item.id_servico}
                                    idServico={item.id_servico}
                                    taskType={item.tipo}
                                    name={item.titulo}
                                    description={item.descricao}
                                    date={item.data}
                                    startTime={item.horario_inicio}
                                    endTime={item.horario_fim}
                                    address={item.endereco}
                                    imagens={item.imagens}
                                    username={item.nome_ofertante}
                                    registeredPeople={item.inscritos_confirmados}
                                    personLimit={item.vagas_max}
                                    minhaSituacao={item.minha_situacao}
                                    avatarPlaceholder={item.foto_ofertante}
                                    onRefresh={loadServicos}
                                />
                            ))
                        )}
                    </ToggleList>
                </ScrollView>

                {/* Botão flutuante para criar novos serviços */}
                <MuralMenu onServiceCreated={loadServicos} />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        flex: 1,
        backgroundColor: Colors.background,

        alignItems: 'center',
        justifyContent: 'flex-start',

        paddingVertical: '5%',
        paddingHorizontal: '5%',
        marginTop: 40,
        marginBottom: 76
    },
    main: {
        flex: 1,
        width: '100%',
    }
})