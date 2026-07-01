import React, { useState } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity } from "react-native";

// Expo
import { Image } from "expo-image";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";

export default function WastePopUp({ visible, onClose, name, type, description }) {
    // Define a cor baseado no tipo do resíduo
    const mappingColor = {
        vidro: Colors.vidro,
        metal: Colors.metal,
        plastico: Colors.plastico,
        papel: Colors.papel,
        organico: Colors.organico,
    }

    const color = mappingColor[type] || Colors.naoReciclavel

    //
    const capitalize = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Controle das imagens
    const [activeIndex, setActiveIndex] = useState(null);
    const [imageSize, setImageSize] = useState({})

    const images = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxMLLIm-K9jJ8xaJ0GZXNfbfs5CwtanGKzXbDzQGoK1hzK7dUPU9TnOHvE&s=10',
        'https://cloudfront-us-east-1.images.arcpublishing.com/estadao/THWRKLGVOVEZVC5D4Q3UD2K3VM.jpg',
        'https://futebolatino.com.br/wp-content/uploads/2023/11/Suarez-Gremio.jpg'
    ];

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

                    <View style={{ alignItems: 'center', marginVertical: '2.5%' }}>
                        <Text style={styles.textName}>{name}</Text>

                        <Text style={[styles.textType, { color: color }]}>{capitalize(type)}</Text>
                    </View>
                    
                    <Text style={styles.textDescription}>{description}</Text>

                    <View style={styles.imageView}>
                        <TouchableOpacity
                            style={{ width: '66.66%', aspectRatio: 1 }}
                            onPress={() => setActiveIndex(0)}
                        >
                            <Image
                                source={images[0]}
                                placeholder={require('../../assets/brokenImage200.svg')}
                                style={{ width: '100%', height: '100%' }}
                                contentFit='cover'
                                placeholderContentFit="cover"
                            />
                        </TouchableOpacity>

                        <View style={{ width: '33.33%' }}>
                            <TouchableOpacity
                                style={{ width: '100%', aspectRatio: 1 }}
                                onPress={() => setActiveIndex(1)}
                            >
                                <Image
                                    source={images[1]}
                                    placeholder={require('../../assets/brokenImage400.svg')}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit='cover'
                                    placeholderContentFit="cover"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ width: '100%', aspectRatio: 1 }}
                                onPress={() => setActiveIndex(2)}
                            >
                                <Image
                                    source={images[2]}
                                    placeholder={require('../../assets/brokenImage400.svg')}
                                    style={{ width: '100%', height: '100%' }}
                                    contentFit='cover'
                                    placeholderContentFit="cover"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
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
    imageView: {
        flexDirection: 'row',
        width: '100%',
        
        marginTop: '5%',

        borderRadius: 24,
        overflow: 'hidden'
    },

    // Text
    textTitle: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 24,
    },
    textName: {
        fontFamily: Fonts.bold,
        fontSize: 18
    },
    textType: {
        fontFamily: Fonts.bold,
        fontSize: 16
    },
    textDescription: {
        fontFamily: Fonts.light,
        fontSize: 14
    }
})