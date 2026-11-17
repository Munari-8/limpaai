import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet, View, Text, TouchableOpacity, TextInput,
    ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator
} from "react-native";

// Expo
import { Image } from "expo-image";
import { MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import UserType from "../../components/UserType";
import Button from "../../components/Button";
import { API_URL } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const getDateLabel = (dateString) => {
    if (!dateString) return '';
    const msgDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const sameDay = (d1, d2) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();

    if (sameDay(msgDate, today)) return 'Hoje';
    if (sameDay(msgDate, yesterday)) return 'Ontem';
    return msgDate.toLocaleDateString('pt-BR');
};

export default function ChatScreen({ navigation, route }) {
    const { user } = useAuth();
    const {
        idConversa,
        otherUserName = 'Usuário',
        otherUserAvatar = null,
        taskType = 'limpeza',
        status: initialStatus = 'aceito',
        isOwner = false
    } = route.params || {};

    const [messages, setMessages] = useState([]);
    const [chatStatus, setChatStatus] = useState(initialStatus);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const scrollViewRef = useRef(null);

    const formatUri = (uri) => (uri && (uri.startsWith('http') || uri.startsWith('file://'))) ? uri : `${API_URL}${uri}`;

    const loadMessages = async (silent = false) => {
        if (!idConversa || !user?.id) return;
        try {
            if (!silent) setLoading(true);
            const response = await fetch(`${API_URL}/mensagens/${idConversa}?id_usuario=${user.id}`);
            const data = await response.json();
            if (response.ok) {
                setMessages(data);
            }
        } catch (error) {
            console.log('Erro ao buscar mensagens:', error);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const WS_URL = API_URL.replace(/^http/, 'ws');
    const socketRef = useRef(null);

    useEffect(() => {
        loadMessages();

        const socket = new WebSocket(WS_URL);
        socketRef.current = socket;

        socket.onopen = () => {
            if (user?.id) {
                socket.send(JSON.stringify({
                    type: 'register',
                    userId: user.id
                }));
            }
        };

        socket.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);

                // Nova mensagem recebida nesta conversa
                if (
                    payload.type === 'new_message' &&
                    String(payload.message.id_conversa) === String(idConversa)
                ) {
                    setMessages((prev) => {
                        const exists = prev.some((m) => m.id_mensagem === payload.message.id_mensagem);
                        return exists ? prev : [...prev, payload.message];
                    });

                    // Marca como lida no banco se veio do outro usuário
                    if (String(payload.message.id_remetente) !== String(user?.id)) {
                        fetch(`${API_URL}/mensagens/${idConversa}?id_usuario=${user.id}`).catch(() => {});
                    }
                }

                // Organizador aceitou ou recusou a conversa em tempo real
                if (
                    payload.type === 'chat_status' &&
                    String(payload.id_conversa) === String(idConversa)
                ) {
                    if (payload.status === 'recusado') {
                        Alert.alert('Recusado', 'O organizador recusou a solicitação de conversa.');
                        navigation.goBack();
                    } else {
                        setChatStatus(payload.status);
                    }
                }
            } catch (e) {
                console.warn('Mensagem WS inválida');
            }
        };

        return () => {
            socket.close();
        };
    }, [idConversa, user?.id]);

    const handleRespondRequest = async (newStatus) => {
        try {
            setSending(true);
            const response = await fetch(`${API_URL}/conversas/${idConversa}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                if (newStatus === 'recusado') {
                    Alert.alert('Recusado', 'A solicitação de mensagem foi recusada.');
                    navigation.goBack();
                } else {
                    setChatStatus('aceito');
                }
            } else {
                Alert.alert('Erro', 'Não foi possível atualizar a solicitação.');
            }
        } catch (error) {
            Alert.alert('Erro de conexão', 'Não foi possível contatar o servidor.');
        } finally {
            setSending(false);
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim() || sending || chatStatus !== 'aceito') return;

        const textToSend = inputText.trim();
        setInputText('');

        try {
            setSending(true);
            const response = await fetch(`${API_URL}/mensagens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_conversa: idConversa,
                    id_remetente: user.id,
                    conteudo: textToSend
                })
            });

            if (response.ok) {
                loadMessages(true);
            } else {
                const errData = await response.json();
                Alert.alert('Atenção', errData.mensagem || 'Erro ao enviar mensagem.');
            }
        } catch (error) {
            Alert.alert('Erro de conexão', 'Não foi possível contatar o servidor.');
        } finally {
            setSending(false);
        }
    };

    // Agrupa mensagens com separadores de data ("Ontem", "Hoje", etc.)
    const renderMessagesWithDates = () => {
        let lastLabel = '';
        return messages.map((msg) => {
            const currentLabel = getDateLabel(msg.enviada_em);
            const showDateHeader = currentLabel !== lastLabel;
            lastLabel = currentLabel;

            const isMine = String(msg.id_remetente) === String(user?.id);

            return (
                <View key={msg.id_mensagem} style={{ width: '100%' }}>
                    {showDateHeader && (
                        <Text style={styles.dateDivider}>{currentLabel}</Text>
                    )}

                    <View style={[styles.bubbleRow, isMine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}>
                        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
                            <Text style={[styles.bubbleText, isMine ? styles.bubbleTextMine : styles.bubbleTextTheirs]}>
                                {msg.conteudo}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        });
    };

    return (
        <ScreenWrapper>
            <KeyboardAvoidingView
                style={styles.innerContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialIcons name='arrow-back-ios-new' size={26} color='white' />
                    </TouchableOpacity>

                    <View style={styles.avatarWrapper}>
                        <Image
                            source={otherUserAvatar ? { uri: formatUri(otherUserAvatar) } : null}
                            placeholder={require('../../assets/person/personBlack.svg')}
                            style={styles.avatar}
                            contentFit="cover"
                            placeholderContentFit="cover"
                        />
                    </View>

                    <View style={{ flex: 1 }}>
                        <UserType
                            wasViewed={true}
                            userName={otherUserName}
                            taskType={taskType}
                        />
                    </View>
                </View>

                {/* Área das mensagens */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesScroll}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.greenLA1} style={{ marginTop: 40 }} />
                    ) : (
                        renderMessagesWithDates()
                    )}
                </ScrollView>

                {/* Controle de solicitação pendente ou campo de envio */}
                {chatStatus === 'pendente' ? (
                    isOwner ? (
                        <View style={styles.requestBanner}>
                            <Text style={styles.requestBannerText}>
                                {otherUserName} deseja iniciar uma conversa com você.
                            </Text>
                            <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                                <Button
                                    text="Recusar"
                                    color={Colors.plastico}
                                    flex={true}
                                    onPress={() => handleRespondRequest('recusado')}
                                    disabled={sending}
                                />
                                <Button
                                    text="Aceitar"
                                    color={Colors.greenLA1}
                                    flex={true}
                                    onPress={() => handleRespondRequest('aceito')}
                                    disabled={sending}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.waitingBanner}>
                            <Text style={styles.waitingText}>
                                Aguardando o organizador aceitar sua solicitação de mensagem...
                            </Text>
                        </View>
                    )
                ) : (
                    <View style={styles.inputBarWrapper}>
                        <View style={styles.inputBar}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Mensagem"
                                placeholderTextColor={Colors.b50}
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                            />
                            <TouchableOpacity
                                onPress={handleSendMessage}
                                disabled={!inputText.trim() || sending}
                                style={styles.sendBtn}
                            >
                                <MaterialIcons
                                    name="send"
                                    size={24}
                                    color={inputText.trim() ? Colors.black : Colors.b50}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        flex: 1,
        backgroundColor: Colors.background
    },
    header: {
        backgroundColor: Colors.black,
        paddingTop: 48,
        paddingBottom: 14,
        paddingHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10
    },
    backBtn: {
        paddingRight: 10
    },
    avatarWrapper: {
        marginRight: 12,
        marginBottom: -28,
        borderRadius: 40,
        borderWidth: 5,
        borderColor: Colors.black,
        backgroundColor: Colors.white
    },
    avatar: {
        width: 58,
        height: 58,
        borderRadius: 29
    },
    messagesScroll: {
        flex: 1,
        width: '100%'
    },
    messagesContent: {
        paddingHorizontal: '5%',
        paddingTop: 32,
        paddingBottom: 16
    },
    dateDivider: {
        fontFamily: Fonts.bold,
        fontSize: 13,
        color: Colors.black,
        textAlign: 'center',
        marginVertical: 14
    },
    bubbleRow: {
        width: '100%',
        marginBottom: 8,
        flexDirection: 'row'
    },
    bubbleRowMine: {
        justifyContent: 'flex-end'
    },
    bubbleRowTheirs: {
        justifyContent: 'flex-start'
    },
    bubble: {
        maxWidth: '80%',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 16
    },
    bubbleMine: {
        backgroundColor: Colors.greenLA1,
        borderBottomRightRadius: 2
    },
    bubbleTheirs: {
        backgroundColor: Colors.b10,
        borderBottomLeftRadius: 2
    },
    bubbleText: {
        fontFamily: Fonts.regular,
        fontSize: 15,
        lineHeight: 20
    },
    bubbleTextMine: {
        color: Colors.white
    },
    bubbleTextTheirs: {
        color: Colors.black
    },
    inputBarWrapper: {
        paddingHorizontal: '5%',
        paddingVertical: 12,
        backgroundColor: Colors.background
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.b10,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 6
    },
    textInput: {
        flex: 1,
        fontFamily: Fonts.regular,
        fontSize: 15,
        color: Colors.black,
        maxHeight: 100,
        paddingVertical: 6
    },
    sendBtn: {
        paddingLeft: 10
    },
    requestBanner: {
        backgroundColor: Colors.formInputBg,
        padding: '5%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        alignItems: 'center',
        gap: 12
    },
    requestBannerText: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        color: Colors.black,
        textAlign: 'center'
    },
    waitingBanner: {
        backgroundColor: Colors.formInputBg,
        padding: 16,
        alignItems: 'center'
    },
    waitingText: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        color: Colors.b50,
        textAlign: 'center'
    }
});