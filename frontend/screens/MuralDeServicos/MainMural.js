import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import ToggleList from "../../components/ToggleList";
import TaskBox from "../../components/Serviços/TaskBox";
import MuralMenu from "../../components/Serviços/MuralMenu";
import TaskPopUp from "../../components/Serviços/TaskPopUp";

import { API_URL } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export default function MainMuralScreen({ navigation, route }) {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);

    const loadTasks = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/servicos?id_usuario=${user?.id}`);
            const data = await response.json();
            if (response.ok) {
                setTasks(data);
            }
        } catch (error) {
            console.log("Erro ao carregar serviços:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, [user?.id]);

    const handleOpenTaskById = async (taskId) => {
        const found = tasks.find(t => Number(t.id_servico) === Number(taskId));
        if (found) {
            setSelectedTask(found);
        } else {
            // Se não estiver na lista carregada, busca individualmente
            try {
                const response = await fetch(`${API_URL}/servicos?id_usuario=${user?.id}`);
                const data = await response.json();
                if (response.ok && Array.isArray(data)) {
                    setTasks(data);
                    const target = data.find(t => Number(t.id_servico) === Number(taskId));
                    if (target) {
                        setSelectedTask(target);
                    } else {
                        Alert.alert("Atenção", "Este serviço não está mais disponível ou foi removido.");
                    }
                }
            } catch (e) {
                console.log("Erro ao buscar serviço específico:", e);
            }
        }
    };

    useEffect(() => {
        const targetId = route?.params?.openTaskId;
        if (targetId) {
            handleOpenTaskById(targetId);
            navigation.setParams({ openTaskId: null });
        }
    }, [route?.params?.openTaskId, tasks]);

    const myTasks = tasks.filter(item => String(item.id_ofertante) === String(user?.id));
    const otherTasks = tasks.filter(item => {
        if (String(item.id_ofertante) === String(user?.id)) return false;

        const isFull = Number(item.inscritos_confirmados) >= Number(item.vagas_max);
        const isAlreadyInvolved = item.minha_situacao === 'aprovado' || item.minha_situacao === 'pendente';

        if (isFull && !isAlreadyInvolved) return false;
        return true;
    });

    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <ScrollView style={styles.main} showVerticalScrollIndicator={false}>
                    {myTasks.length > 0 && (
                        <>
                            <ToggleList text={'Seus Serviços'}>
                                {loading ? (
                                    <ActivityIndicator size="large" color={Colors.greenLA1}/>
                                ) : (
                                    myTasks.map((item) => (
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
                                            latitude={item.latitude}
                                            longitude={item.longitude}
                                            imagens={item.imagens}
                                            username={item.nome_ofertante}
                                            registeredPeople={item.inscritos_confirmados}
                                            personLimit={item.vagas_max}
                                            minhaSituacao={item.minha_situacao}
                                            idOfertante={item.id_ofertante}
                                            avatar={item.foto_ofertante}
                                            onRefresh={loadTasks}
                                            edicao_sensivel_usada={item.edicao_sensivel_usada}
                                        />
                                    ))
                                )}
                            </ToggleList>

                            <View style={{ height: 20 }}/>
                        </>
                    )}

                    <ToggleList text={'Serviços disponíveis'}>
                        {loading ? (
                            <ActivityIndicator size='large' color={Colors.greenLA1} />
                        ) : otherTasks.length > 0 ? (
                            otherTasks.map((item) => (
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
                                    latitude={item.latitude}
                                    longitude={item.longitude}
                                    imagens={item.imagens}
                                    username={item.nome_ofertante}
                                    registeredPeople={item.inscritos_confirmados}
                                    personLimit={item.vagas_max}
                                    minhaSituacao={item.minha_situacao}
                                    idOfertante={item.id_ofertante}
                                    avatar={item.foto_ofertante}
                                    onRefresh={loadTasks}
                                    edicao_sensivel_usada={item.edicao_sensivel_usada}
                                />
                            ))
                        ) : (
                            <Text style={styles.emptyText}>Não há serviços disponíveis no momento.</Text>
                        )}
                    </ToggleList>
                </ScrollView>

                <MuralMenu onServiceCreated={loadTasks} />

                {selectedTask && (
                    <TaskPopUp
                        visible={!!selectedTask}
                        onClose={() => setSelectedTask(null)}
                        idServico={selectedTask.id_servico}
                        idOfertante={selectedTask.id_ofertante}
                        name={selectedTask.titulo}
                        rawTitle={selectedTask.titulo}
                        description={selectedTask.descricao}
                        taskType={selectedTask.tipo}
                        date={selectedTask.data}
                        rawDate={selectedTask.data}
                        startTime={selectedTask.horario_inicio}
                        endTime={selectedTask.horario_fim}
                        address={selectedTask.endereco}
                        latitude={selectedTask.latitude}
                        longitude={selectedTask.longitude}
                        image={selectedTask.imagens}
                        personCount={selectedTask.inscritos_confirmados}
                        personLimit={selectedTask.vagas_max}
                        username={selectedTask.nome_ofertante}
                        avatar={selectedTask.foto_ofertante}
                        minhaSituacao={selectedTask.minha_situacao}
                        edicaoSensivelUsada={selectedTask.edicao_sensivel_usada}
                        onRefresh={loadTasks}
                    />
                )}
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
        marginTop: 66.6,
        marginBottom: 76
    },
    main: {
        flex: 1,
        width: '100%',
    }
})