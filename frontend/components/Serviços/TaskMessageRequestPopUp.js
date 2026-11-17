import React, { useState } from "react";
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors, Fonts } from "../Theme";
import Button from "../Button";
import FormInput2 from "../FormInput2";

export default function TaskMessageRequestPopUp({ visible, onClose, ownerName, taskName, onConfirm, loading }) {
    const [message, setMessage] = useState('');

    const handleConfirm = () => {
        if (!message.trim()) {
            Alert.alert('Atenção', 'Escreva uma mensagem inicial para o organizador.');
            return;
        }

        onConfirm(message.trim());
        setMessage('');
    };

    const handleClose = () => {
        setMessage('');
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
                            <Text style={styles.text1}>Enviar solicitação de mensagem para o organizador:</Text>

                            <View style={styles.innerCont}>
                                <Text style={styles.text2}>{ownerName}</Text>
                                <Text style={styles.taskSub}>{taskName}</Text>
                            </View>

                            <View style={[styles.innerCont, { width: '100%' }]}>
                                <Text style={styles.label}>Sua mensagem:</Text>
                                <FormInput2
                                    placeholder="Tire sua dúvida ou apresente-se..."
                                    characterLimit={true}
                                    maxLength={150}
                                    value={message}
                                    setValue={setMessage}
                                />
                            </View>

                            <View style={styles.innerCont}>
                                <MaterialCommunityIcons
                                    name="alert-circle"
                                    size={24}
                                    color={Colors.greenLA1}
                                />
                                <Text style={styles.textDesc}>
                                    O organizador precisará aceitar sua solicitação antes que vocês possam conversar livremente.
                                </Text>
                            </View>

                            <View style={[styles.innerCont, { flexDirection: 'row', gap: 10, marginTop: '6%' }]}>
                                <Button
                                    text="Voltar"
                                    color={Colors.b50}
                                    flex={true}
                                    onPress={handleClose}
                                    disabled={loading}
                                />
                                <Button
                                    text={loading ? 'Enviando...' : 'Enviar'}
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
    taskSub: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        color: Colors.b50,
        textAlign: 'center',
        marginTop: 2
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
});