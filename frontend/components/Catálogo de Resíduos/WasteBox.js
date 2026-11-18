import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";

// Expo
import { Image } from "expo-image";

// Local
import { Colors } from "../Theme";
import WastePopUp from "./WastePopUp";
import { API_URL } from "../../services/api";

// Aceita: array, string JSON ('["/uploads/a.jpg","/uploads/b.jpg"]'),
// caminho único ('/uploads/a.jpg') ou require() de asset local.
const parseImages = (value) => {
    if (!value) return [];

    if (Array.isArray(value)) return value.filter(Boolean);

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return [];

        if (trimmed.startsWith('[')) {
            try {
                const parsed = JSON.parse(trimmed);
                return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
            } catch {
                return [];
            }
        }

        return [trimmed];
    }

    // require() de asset local (number) ou objeto de source
    return [value];
};

// Mesma lógica do TaskPopUp: caminhos do servidor ganham o prefixo da API
const formatUri = (src) => {
    if (typeof src !== 'string') return src;
    if (/^(https?:|file:|data:)/.test(src)) return src;
    return `${API_URL}${src}`;
};

export default function WasteBox({ image, images, name, type, description, currentState, why }) {
    const [isOpen, setIsOpen] = useState(false);

    const imageList = parseImages(images ?? image).map(formatUri);

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
                images={imageList}
            />

            {/* Mesma estrutura do Wastes.js: View externa define a largura, a caixa define o quadrado */}
            <View style={styles.wrapper}>
                <TouchableOpacity
                    style={[styles.container, { backgroundColor: bgColor }]}
                    onPress={() => setIsOpen(true)}
                >
                    <Image
                        source={imageList[0]}
                        placeholder={require('../../assets/brokenImage400.svg')}
                        style={styles.image}
                        contentFit="cover"
                        contentPosition="center"
                        placeholderContentFit="contain"
                    />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '48%'
    },
    container: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 24,

        overflow: 'hidden'
    },
    image: {
        position: 'absolute',
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,

        borderRadius: 16
    }
})