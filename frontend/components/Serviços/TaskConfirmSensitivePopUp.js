import React from "react";
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback } from "react-native";

// Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
import Button from "../Button";

export default function TaskConfirmSensitivePopUp({ visible, onClose, name, onConfirm, loading }) {
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
                            <Text style={styles.text1}>Deseja salvar as alterações no seguinte serviço?</Text>

                            <View style={styles.innerCont}>
                                <Text style={styles.text2}>{name}</Text>
                            </View>

                            <View style={styles.innerCont}>
                                <MaterialCommunityIcons
                                    name='alert-circle'
                                    size={24}
                                    color={Colors.greenLA1}
                                />

                                <Text style={styles.text3}>ATENÇÃO:</Text>

                                <Text style={styles.textDesc}>
                                    Você alterou dados sensíveis (data, horário, localização ou vagas). Eles só podem ser editados uma única vez e ficarão bloqueados após salvar
                                </Text>
                            </View>

                            <View style={[styles.innerCont, { flexDirection: 'row', gap: 10, marginTop: '8%' }]}>
                                <Button
                                    text={'Voltar'}
                                    color={Colors.b50}
                                    flex={true}
                                    onPress={onClose}
                                    disabled={loading}
                                />
                                <Button
                                    text={loading ? 'Salvando...' : 'Confirmar'}
                                    color={Colors.greenLA1}
                                    flex={true}
                                    onPress={onConfirm}
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
    text3: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 16,
        color: Colors.greenLA2
    },
    textDesc: {
        fontFamily: Fonts.bold,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20
    }
});