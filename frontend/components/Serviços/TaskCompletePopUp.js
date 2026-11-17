import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from "react-native";

// Expo
import { Image } from "expo-image";
import { MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
import Button from "../Button";
import { API_URL } from "../../services/api";

export default function TaskCompletePopUp({
    visible, onClose, name, approvedUsers = [], avatarPlaceholder, lightColor, color, onConfirm, loading
}) {
    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        if (visible) {
            const initial = {};
            approvedUsers.forEach((u) => {
                initial[u.id_participacao] = 'presente';
            });
            setAttendance(initial);
        }
    }, [visible, approvedUsers]);

    const togglePresence = (id_participacao, status) => {
        setAttendance(prev => ({ ...prev, [id_participacao]: status }));
    };

    const handleConfirm = () => {
        const presencesArray = approvedUsers.map((u) => ({
            id_participacao: u.id_participacao,
            id_usuario: u.id_usuario,
            presenca: attendance[u.id_participacao] || 'ausente'
        }));
        onConfirm(presencesArray);
    };

    const formatUri = (uri) => (uri && (uri.startsWith('http') || uri.startsWith('file://'))) ? uri : `${API_URL}${uri}`;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.bgShadow}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            <Text style={styles.text1}>Concluir o seguinte serviço?</Text>

                            <View style={styles.innerCont}>
                                <Text style={styles.text2}>{name}</Text>
                            </View>

                            {approvedUsers.length > 0 ? (
                                <View style={styles.listBox}>
                                    <Text style={[styles.sectionTitle, { color }]}>
                                        Lista de Presença ({approvedUsers.length}):
                                    </Text>

                                    <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
                                        {approvedUsers.map((item) => {
                                            const current = attendance[item.id_participacao] || 'presente';
                                            return (
                                                <View key={item.id_participacao} style={styles.userRow}>
                                                    <Image
                                                        source={item.foto_perfil ? { uri: formatUri(item.foto_perfil) } : null}
                                                        placeholder={avatarPlaceholder}
                                                        style={[styles.avatar, { backgroundColor: lightColor }]}
                                                        contentFit="cover"
                                                        placeholderContentFit="cover"
                                                    />

                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.userName} numberOfLines={1}>
                                                            {item.nome_exibicao || item.nome}
                                                        </Text>
                                                        <Text style={styles.statusSub}>
                                                            {current === 'presente' ? 'Presente' : 'Ausente'}
                                                        </Text>
                                                    </View>

                                                    <View style={{ flexDirection: 'row', gap: 6 }}>
                                                        <TouchableOpacity
                                                            style={[
                                                                styles.badge,
                                                                { backgroundColor: current === 'presente' ? Colors.greenLA1 : Colors.b10 }
                                                            ]}
                                                            onPress={() => togglePresence(item.id_participacao, 'presente')}
                                                        >
                                                            <MaterialIcons
                                                                name="check"
                                                                size={18}
                                                                color={current === 'presente' ? Colors.white : Colors.white}
                                                            />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity
                                                            style={[
                                                                styles.badge,
                                                                { backgroundColor: current === 'ausente' ? Colors.plastico : Colors.b10 }
                                                            ]}
                                                            onPress={() => togglePresence(item.id_participacao, 'ausente')}
                                                        >
                                                            <MaterialIcons
                                                                name="close"
                                                                size={18}
                                                                color={current === 'ausente' ? Colors.white : Colors.white}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            ) : (
                                <Text style={styles.emptyUsers}>
                                    Nenhum participante confirmado neste serviço.
                                </Text>
                            )}

                            <View style={[styles.innerCont, { flexDirection: 'row', gap: 10, marginTop: '6%' }]}>
                                <Button
                                    text={'Voltar'}
                                    color={Colors.black}
                                    flex={true}
                                    onPress={onClose}
                                    disabled={loading}
                                />
                                <Button
                                    text={loading ? 'Concluindo...' : 'Concluir'}
                                    color={Colors.greenLA1}
                                    flex={true}
                                    onPress={handleConfirm}
                                    disabled={loading}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
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
    container: {
        backgroundColor: Colors.background,
        borderRadius: 24,
        padding: '5%',
        width: '85%',
        maxHeight: '85%',
        alignItems: 'center'
    },
    innerCont: {
        alignItems: 'center',
        marginTop: '4%'
    },
    text1: {
        fontFamily: Fonts.light,
        fontSize: 16,
        textAlign: 'center'
    },
    text2: {
        fontFamily: Fonts.condensedSemiBold,
        fontSize: 20,
        textAlign: 'center'
    },
    listBox: {
        width: '100%',
        backgroundColor: Colors.formInputBg,
        borderRadius: 18,
        padding: 12,
        marginTop: 14
    },
    sectionTitle: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        marginBottom: 8
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6
    },
    avatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        marginRight: 10
    },
    userName: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        color: Colors.black
    },
    statusSub: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.b50
    },
    badge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    emptyUsers: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.b50,
        textAlign: 'center',
        marginTop: 14
    }
});