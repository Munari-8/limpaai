import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Local
import { Colors, Fonts } from "../components/Theme";
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button';
import ToggleList from "../components/ToggleList";
import TaskBox from "../components/Serviços/TaskBox";
import Avatar from "../components/Avatar";

import { useAuth } from "../contexts/AuthContext";
import { API_URL } from "../services/api";

export default function HomeScreen({ navigation }) {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [servicosRealizados, setServicosRealizados] = useState(0);
    const [loading, setLoading] = useState(true);
    const [rank, setRank] = useState('Bronze');
    const [points, setPoints] = useState(0);

    const username = user?.nome_exibicao || (user?.nome ? user.nome.trim().split(/\s+/)[0] : 'usuário');
    const usernameTitle = username.toUpperCase();

    const profileImgSrc = user?.foto_perfil ? `${API_URL}${user.foto_perfil}` : null;

    let welcome;
    switch (user?.genero) {
        case 'Masculino':
            welcome = 'BEM-VINDO,';
            break;
        case 'Feminino':
            welcome = 'BEM-VINDA,';
            break;
        case 'Não Binário':
            welcome = 'BEM-VINDE,';
            break;
        default:
            welcome = 'BEM-VINDO(A),';
            break;
    }

    const rankColors = {
        Bronze: Colors.bronze,
        Prata: Colors.silver,
        Ouro: Colors.gold,
        Diamante: Colors.diamond
    };

    const loadHomeData = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            // Busca dados atualizados do usuário (incluindo serviços realizados)
            const userRes = await fetch(`${API_URL}/usuarios/${user.id}`);
            const userData = await userRes.json();
            
            if (userRes.ok && userData.servicos_realizados !== undefined) {
                setServicosRealizados(userData.servicos_realizados);

                if (userRes.ok) {
                    if (userData.servicos_realizados !== undefined) setServicosRealizados(userData.servicos_realizados);
                    if (userData.ranque) setRank(userData.ranque);
                    if (userData.pontos !== undefined) setPoints(userData.pontos);
                }
            }

            // Busca todos os serviços abertos
            const taskRes = await fetch(`${API_URL}/servicos?id_usuario=${user.id}`);
            const taskData = await taskRes.json();
            if (taskRes.ok && Array.isArray(taskData)) {
                // Filtra: serviços em que o usuário é o ofertante OU está inscrito com situação 'aprovado'
                const myRelevantTasks = taskData.filter(item => {
                    const isOwner = String(item.id_ofertante) === String(user.id);
                    const isApprovedParticipant = item.minha_situacao === 'aprovado';
                    return (isOwner || isApprovedParticipant) && item.status === 'aberto';
                });
                
                // Remove duplicatas caso o criador também esteja inscrito no próprio serviço
                const uniqueTasks = Array.from(new Set(myRelevantTasks.map(t => t.id_servico)))
                    .map(id => myRelevantTasks.find(t => t.id_servico === id));

                // Ordena por data (do mais próximo ao mais distante)
                uniqueTasks.sort((a, b) => new Date(a.data) - new Date(b.data));

                setTasks(uniqueTasks);
            }
        } catch (error) {
            console.log("Erro ao carregar dados da Home:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadHomeData();
        }, [user?.id])
    );

    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
                    <View style={styles.main}>
                        <Avatar
                            source={profileImgSrc}
                        />
                        <Text style={styles.text2}>{welcome}</Text>
                        <Text style={styles.textUsername}>{usernameTitle}</Text>

                        <Text style={styles.text1}>
                            <Text style={styles.serviceCounterText}>{servicosRealizados} </Text>
                            {servicosRealizados === 1 ? 'Serviço realizado' : 'Serviços realizados'}
                        </Text>

                        <Text style={[styles.rank, { backgroundColor: rankColors[rank] || Colors.background }]}>
                            {rank} • {points} pts
                        </Text>
                        
                        <Button
                            text={'Editar perfil'}
                            color={Colors.greenLA1}
                            onPress={() => navigation.navigate(`EditProfile`)}
                        />
                    </View>
                    
                    <View style={styles.tasks}>
                        <View style={{backgroundColor: Colors.greenLA0, width: '100%', height: 2, borderRadius: 50, marginBottom: 12}}></View>

                        <ToggleList text={'Próximos Serviços'}>
                            {loading ? (
                                <ActivityIndicator size="large" color={Colors.greenLA1} style={{ marginTop: 20 }}/>
                            ) : tasks.length > 0 ? (
                                tasks.map((item) => (
                                    <TaskBox
                                        key={item.id_servico}
                                        idServico={item.id_servico}
                                        taskType={item.tipo}
                                        name={item.titulo}
                                        description={item.descricao}
                                        date={item.data}
                                        showDate={false}
                                        startTime={item.horario_inicio}
                                        endTime={item.horario_fim}
                                        address={item.endereco}
                                        latitude={item.latitude}
                                        longitude={item.longitude}
                                        imagens={item.imagens}
                                        registeredPeople={item.inscritos_confirmados}
                                        personLimit={item.vagas_max}
                                        username={item.nome_ofertante}
                                        avatar={item.foto_ofertante}
                                        minhaSituacao={item.minha_situacao}
                                        idOfertante={item.id_ofertante}
                                        showDateTag={true}
                                        onRefresh={loadHomeData}
                                    />
                                ))
                            ) : (
                                <Text style={styles.emptyText}>Você não possui serviços agendados no momento.</Text>
                            )}
                        </ToggleList>
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        paddingHorizontal: '5%',
        marginTop: 75,
        marginBottom: 76
    },
    main: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 24
    },
    tasks: {
        width: '100%',
        paddingBottom: 40
    },
    textUsername: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 44,
        textAlign: `center`,
        marginVertical: '-2%'
    },
    serviceCounterText: {
        color: Colors.greenLA1,
        fontFamily: Fonts.bold,
        fontSize: 16
    },
    text1: {
        fontFamily: Fonts.regular,
        fontSize: 16
    },
    text2: {
        color: Colors.greenLA2,
        fontFamily: Fonts.bold,
        fontSize: 16,
        marginTop: `2%`
    },
    rank: {
        fontFamily: Fonts.bold,
        color: 'white',
        backgroundColor: Colors.bronze,
        borderRadius: 100,
        paddingVertical: '1.5%',
        paddingHorizontal: '3%',
        marginVertical: '2%'
    },
    emptyText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.b50,
        textAlign: 'center',
        marginTop: 20
    }
});