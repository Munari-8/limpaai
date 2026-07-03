import React, { useState } from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity } from "react-native";

// Expo
import { Image } from "expo-image";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
import FormInput2 from "../FormInput2";
import Button from '../Button';

export default function AddWastePopUp({ visible, onClose }) {
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [wasteType, setWasteType] = useState('');

    const typeList = [
        'Vidro',
        'Metal',
        'Plástico',
        'Papel',
        'Orgânico',
        'Não Reciclável'
    ]

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
                    <Text style={styles.textTitle}>SUGESTÃO DE RESÍDUO</Text>

                    <FormInput2
                        placeholder={'Insira o nome do resíduo'}
                        characterLimit={true}
                        maxLength={32}
                        value={name}
                        setValue={setName}
                    />

                    <View style={styles.tag}>
                        <MaterialIcons
                            name='image'
                            size={24}
                        />

                        <Text style={styles.textTag}>Tipo do Resíduo</Text>
                    </View>

                    <View style={styles.tag}>
                        <MaterialIcons
                            name='edit'
                            size={24}
                        />

                        <Text style={styles.textTag}>Observações</Text>
                    </View>

                    <FormInput2
                        placeholder={'Insira observações sobre o resíduo'}
                        characterLimit={true}
                        maxLength={80}
                        value={notes}
                        setValue={setNotes}
                    />

                    <View style={styles.tag}>
                        <MaterialIcons
                            name='image'
                            size={24}
                        />

                        <Text style={styles.textTag}>Anexar imagem</Text>
                    </View>

                    <View style={{ width: '100%', marginTop: 24, flexDirection: 'row' }}>
                        <Button
                            text={'Enviar Sugestão'}
                            flex={true}
                            
                        />
                    </View>
                </View>
            </View>
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
        maxHeight: '85%',

        padding: '5%',
        alignItems: 'center',
        overflow: 'hidden'
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        width: '100%'
    },

    // Text
    textTitle: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 24,

        marginBottom: 8
    },
    textTag: {
        fontFamily: Fonts.bold,
        fontSize: 16
    }
})