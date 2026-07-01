import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

// Expo
import { Image } from "expo-image";

// Local
import { Colors } from "../Theme";
import WastePopUp from "./WastePopUp";

export default function WasteBox({ image }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View>
            <WastePopUp
                visible={isOpen}
                onClose={() => setIsOpen(false)}
                name={'Resíduo X'}
                type={'vidro'}
                description={'Observações épicas sobre tal resíduo.'}
            />

            <TouchableOpacity
                style={styles.container}
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.b10,
        width: 176,
        aspectRatio: 1,
        borderRadius: 24,

        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '90%',
        height: '90%'
    }
})