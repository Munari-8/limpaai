import React, { useState, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Local
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import MessageBox from "../../components/Mensagens/MessageBox";
import { API_URL } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const formatInboxDate = (dateString) => {
    if (!dateString) return '';
    const msgDate = new Date(dateString);
    const now = new Date();

    const isToday =
        msgDate.getDate() === now.getDate() &&
        msgDate.getMonth() === now.getMonth() &&
        msgDate.getFullYear() === now.getFullYear();

    if (isToday) {
        return msgDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    return msgDate.toLocaleDateString('pt-BR');
};

export default function InboxScreen() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadConversations = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/conversas/${user.id}`);
            const data = await response.json();
            if (response.ok) {
                setConversations(data);
            }
        } catch (error) {
            console.log('Erro ao carregar Inbox:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadConversations();
        }, [user?.id])
    );

    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <ScrollView
                    style={{ width: '100%' }}
                    contentContainerStyle={styles.main}
                    showsVerticalScrollIndicator={false}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.greenLA1} style={{ marginTop: 40 }} />
                    ) : conversations.length > 0 ? (
                        conversations.map((conv) => {
                            const isOwner = String(conv.id_organizador) === String(user?.id);
                            const otherName = isOwner
                                ? (conv.exibicao_solicitante || conv.nome_solicitante)
                                : (conv.exibicao_organizador || conv.nome_organizador);
                            const otherAvatar = isOwner ? conv.foto_solicitante : conv.foto_organizador;
                            const hasUnread = Number(conv.nao_lidas) > 0 || (isOwner && conv.status === 'pendente');

                            return (
                                <MessageBox
                                    key={conv.id_conversa}
                                    idConversa={conv.id_conversa}
                                    wasViewed={!hasUnread}
                                    userName={otherName}
                                    userIcon={otherAvatar}
                                    taskType={conv.tipo_servico ? conv.tipo_servico.toLowerCase() : 'limpeza'}
                                    lastMessage={conv.ultima_mensagem || 'Solicitação de mensagem'}
                                    submittedByUser={String(conv.ultimo_remetente) === String(user?.id)}
                                    data={formatInboxDate(conv.data_ultima_mensagem || conv.criada_em)}
                                    status={conv.status}
                                    isOwner={isOwner}
                                    onRefresh={loadConversations}
                                />
                            );
                        })
                    ) : (
                        <Text style={styles.emptyText}>Você ainda não possui conversas.</Text>
                    )}
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
        justifyContent: 'flex-start',
        paddingHorizontal: '5%',
        marginTop: 66.6,
        marginBottom: 76
    },
    main: {
        paddingVertical: '5%',
        alignItems: 'center',
        rowGap: 12,

        width: '100%',
    },

    // Text
    emptyText: {
        fontFamily: Fonts.regular,
        fontSize: 15,
        color: Colors.b50,

        marginTop: 40,
        textAlign: 'center'
    }
});