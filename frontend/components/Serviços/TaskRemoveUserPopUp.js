import React, { useState } from "react";
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback, Alert } from "react-native";

// Expo
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Local
import { Colors, Fonts } from "../Theme";
import Button from "../Button";
import FormInput2 from "../FormInput2";

export default function TaskRemoveUserPopUp({ visible, onClose, userName, onConfirm, loading }) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (!reason.trim()) {
            Alert.alert("Atenção", "Por favor, informe uma justificativa para remover o participante.")
            return;
        }
        onConfirm(reason);
        setReason('');
    };

    const handleClose = () => {
        setReason('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.bgShadow}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            <Text style={styles.text1}>Deseja remover o seguinte participante do serviço?</Text>

                            <View style={styles.innerCont}>
                                <Text style={styles.text2}>{userName}</Text>
                            </View>

                            <View style={[styles.innerCont, { width: '100%' }]}>
                                <Text style={styles.label}>Justificativa:</Text>
                                <FormInput2
                                    placeholder="Explique o motivo da remoção..."
                                    characterLimit={true}
                                    maxLength={120}
                                    value={reason}
                                    setValue={setReason}
                                />
                            </View>

                            <View style={styles.innerCont}>
                                <MaterialCommunityIcons
                                    name="alert-circle"
                                    size={24}
                                    color={Colors.greenLA1}
                                />
                                <Text style={styles.textDesc}>
                                    O participante será notificado sobre a remoção e o motivo informado.
                                </Text>
                            </View>

                            <View style={[styles.innerCont, { flexDirection: 'row', gap: 10, marginTop: '6%' }]}>
                                <Button
                                    text="Voltar"
                                    color={Colors.greenLA1}
                                    flex={true}
                                    onPress={handleClose}
                                    disabled={loading}
                                />
                                <Button
                                    text={loading ? 'Removendo...' : 'Remover'}
                                    color={Colors.plastico}
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
        backgroundColor: Colors.b25,
        
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        backgroundColor: Colors.background,
        borderRadius: 24,
        width: '85%',
        maxHeight: '85%',

        padding: '5%',
        alignItems: 'center'
    },
    innerCont: {
        alignItems: 'center',
        marginTop: '4%'
    },

    // Text
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
    label: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        color: Colors.black,

        alignSelf: 'flex-start',
        marginBottom: 4
    },
    textDesc: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 4,
        lineHeight: 20
    }
})