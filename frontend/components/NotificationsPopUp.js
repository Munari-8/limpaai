import React from "react";
import {
    StyleSheet, View, Text, Modal, TouchableOpacity, FlatList
} from "react-native";

// Expo
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function NotificationsPopUp({
    visible, onClose, notifications = [], navigation, onMarkAsRead, onClearAll
}) {
    const { user } = useAuth();

    const getIconName = (item) => {
        if (item.tipo === 'mensagem') return 'message-text';
        if (item.tipo === 'cancelamento') return 'trash-can';
        return 'clipboard-text';
    };

    const handleClearAll = async () => {
        try {
            await fetch(`${API_URL}/notificacoes/usuario/${user?.id}`, {
                method: 'DELETE'
            });
            if (onClearAll) onClearAll();
        } catch (error) {
            console.log('Erro ao limpar notificações:', error);
        }
    };

    const handlePressNotification = async (item) => {
        if (!item.lida) {
            try {
                await fetch(`${API_URL}/notificacoes/${item.id_notificacao}/lida`, {
                    method: 'PUT'
                });
                if (onMarkAsRead) onMarkAsRead(item.id_notificacao);
            } catch (error) {
                console.log('Erro ao marcar notificação como lida:', error);
            }
        }

        onClose();

        if (!navigation) return;

        if (item.tipo === 'mensagem' && item.id_referencia) {
            try {
                const res = await fetch(`${API_URL}/conversas/${user?.id}`);
                const chats = await res.json();
                const targetChat = Array.isArray(chats)
                    ? chats.find(c => Number(c.id_conversa) === Number(item.id_referencia))
                    : null;

                if (targetChat) {
                    const isOwner = Number(targetChat.id_organizador) === Number(user?.id);
                    navigation.navigate('Chat', {
                        idConversa: targetChat.id_conversa,
                        otherUserName: isOwner
                            ? (targetChat.exibicao_solicitante || targetChat.nome_solicitante)
                            : (targetChat.exibicao_organizador || targetChat.nome_organizador),
                        otherUserAvatar: isOwner ? targetChat.foto_solicitante : targetChat.foto_organizador,
                        taskType: targetChat.tipo_servico ? targetChat.tipo_servico.toLowerCase() : '',
                        status: targetChat.status,
                        isOwner
                    });
                    return;
                }
            } catch (e) {
                console.log('Erro ao abrir conversa pela notificação:', e);
            }
            navigation.navigate('Inbox');
        } else if (item.tipo === 'servico' && item.id_referencia) {
            navigation.navigate('MainMural', { openTaskId: Number(item.id_referencia) });
        } else {
            navigation.navigate('MainMural');
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
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                            <MaterialIcons name="chevron-left" size={30} color={Colors.black} />
                        </TouchableOpacity>

                        <Text style={styles.title}>NOTIFICAÇÕES</Text>

                        {notifications.length > 0 ? (
                            <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
                                <MaterialCommunityIcons name="delete-sweep" size={24} color={Colors.plastico || '#E53935'} />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.backBtn} />
                        )}
                    </View>

                    <FlatList
                        data={notifications}
                        keyExtractor={(item) => String(item.id_notificacao)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>Você não possui notificações.</Text>
                        }
                        renderItem={({ item }) => {
                            const isUnread = Number(item.lida) === 0;

                            return (
                                <TouchableOpacity
                                    style={[
                                        styles.pill,
                                        { backgroundColor: isUnread ? Colors.greenLA1 : Colors.formInputBg }
                                    ]}
                                    activeOpacity={0.75}
                                    onPress={() => handlePressNotification(item)}
                                >
                                    <MaterialCommunityIcons
                                        name={getIconName(item)}
                                        size={28}
                                        color={isUnread ? Colors.white : Colors.b50}
                                    />

                                    <Text
                                        style={[
                                            styles.msgText,
                                            { color: isUnread ? Colors.white : Colors.b50 }
                                        ]}
                                        numberOfLines={3}
                                    >
                                        {item.mensagem}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    bgShadow: {
        flex: 1,
        backgroundColor: Colors.b25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdropTouch: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    container: {
        backgroundColor: Colors.background,
        borderRadius: 24,
        width: '85%',
        height: '85%',
        paddingVertical: 16,
        paddingHorizontal: 16
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    backBtn: {
        width: 32,
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    clearBtn: {
        width: 32,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    title: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 20,
        color: Colors.black,
        textAlign: 'center'
    },
    listContent: {
        gap: 12,
        paddingBottom: 12
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16
    },
    msgText: {
        flex: 1,
        fontFamily: Fonts.bold,
        fontSize: 14,
        lineHeight: 18
    },
    emptyText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.b50,
        textAlign: 'center',
        marginTop: 40
    }
});