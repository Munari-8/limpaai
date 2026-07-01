import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

// Expo
import { Image } from "expo-image";

// Local
import { Colors } from "../Theme";
import WastePopUp from "./WastePopUp";

export default function WasteBox({ image, name, type, description, currentState, why }) {
    const [isOpen, setIsOpen] = useState(false);

    // Define a cor de fundo baseado no tipo do resíduo
    const mappingBgColor = {
        vidro: Colors.vidro30,
        metal: Colors.metal30,
        plastico: Colors.plastico30,
        papel: Colors.papel30,
        organico: Colors.organico30,
    };

    const bgColor = mappingBgColor[type] || Colors.naoReciclavel30;

    return (
        <>
            <WastePopUp
                visible={isOpen}
                onClose={() => setIsOpen(false)}
                name={name}
                type={type}
                description={description}
                currentState={currentState}
                why={why}
            />

            <TouchableOpacity
                style={[styles.container, { backgroundColor: bgColor }]}
                onPress={() => setIsOpen(true)}
            >
                <Image
                    source={image}
                    placeholder={require('../../assets/brokenImage400.svg')}
                    style={styles.image}
                    contentFit="contain"
                    placeholderContentFit="contain"
                />
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 24,

        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '90%',
        aspectRatio: 1
    }
})