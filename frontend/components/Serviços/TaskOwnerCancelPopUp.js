import React, { useState } from "react";
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback, Alert } from "react-native";

// Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
import Button from "../Button";
import FormInput2 from "../FormInput2";

export default function TaskOwnerCancelPopUp({ visible, onClose, name, onConfirm, loading }) {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        if (!reason.trim()) {
            Alert.alert('Atenção', 'Por favor, informe o motivo do cancelamento do serviço.');
            return;
        }
        onConfirm(reason.trim());
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
                            <Text style={styles.text1}>Deseja cancelar o seguinte serviço?</Text>

                            <View style={styles.innerCont}>
                                <Text style={styles.text2}>{name}</Text>
                            </View>

                            <View style={[styles.innerCont, { width: '100%' }]}>
                                <Text style={styles.label}>Justificativa (obrigatória):</Text>
                                <FormInput2
                                    placeholder="Explique o motivo do cancelamento..."
                                    characterLimit={true}
                                    maxLength={120}
                                    value={reason}
                                    setValue={setReason}
                                />
                            </View>

                            <View style={styles.innerCont}>
                                <MaterialCommunityIcons
                                    name='alert-circle'
                                    size={24}
                                    color={Colors.greenLA1}
                                />

                                <Text style={[styles.text3, { color: Colors.greenLA1 }]}>ATENÇÃO:</Text>

                                <Text style={styles.textDesc}>
                                    Esta ação é permanente. O serviço será removido do mural e todos os participantes inscritos serão notificados com a justificativa
                                </Text>
                            </View>

                            <View style={[styles.innerCont, { flexDirection: 'row', gap: 10, marginTop: '8%' }]}>
                                <Button
                                    text={'Voltar'}
                                    color={Colors.black}
                                    flex={true}
                                    onPress={handleClose}
                                    disabled={loading}
                                />
                                <Button
                                    text={loading ? 'Cancelando...' : 'Cancelar Serviço'}
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
    text3: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 16
    },
    textDesc: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20
    }
});