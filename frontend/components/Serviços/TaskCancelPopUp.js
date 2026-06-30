import React from "react";
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback } from "react-native";

//Expo
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
import Button from "../Button";

export default function TaskCancelPopUp({ visible, onClose, name, onConfirm }){
    return(
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
                            <Text style={styles.text1}>Deseja cancelar sua inscrição no seguinte serviço?</Text>

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

                                <Text style={styles.textDesc}>Após cancelar sua inscrição, você não poderá participar deste mesmo serviço novamente e perderá pontos de participação</Text>

                            </View>

                            <View style={[styles.innerCont, { flexDirection: 'row', marginTop: '8%' }]}>
                                <Button
                                    text={'Cancelar Participação'}
                                    color={Colors.greenLA1}
                                    flex={true}
                                    onPress={onConfirm}
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
    // View
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
        textAlign: 'center',
        
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
})