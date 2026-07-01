import React, { useState } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity, FlatList, Dimensions, TouchableWithoutFeedback } from "react-native";

// Expo
import { Image } from "expo-image";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WastePopUp({ visible, onClose, name, type, description, currentState, why }) {
    // Define a cor baseado no tipo do resíduo
    const mappingColor = {
        vidro: Colors.vidro,
        metal: Colors.metal,
        plastico: Colors.plastico,
        papel: Colors.papel,
        organico: Colors.organico,
    };

    const color = mappingColor[type] || Colors.naoReciclavel;

    // Formata a escrita do tipo do resíduo
    const mappingType = {
        vidro: 'Vidro',
        metal: 'Metal',
        plastico: 'Plástico',
        papel: 'Papel',
        organico: 'Orgânico',
        naoReciclavel: 'Não Reciclável'
    };

    const formattedType = mappingType[type];

    // Controle das imagens
    const [activeIndex, setActiveIndex] = useState(null);
    const [imageSize, setImageSize] = useState({})

    const images = [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxMLLIm-K9jJ8xaJ0GZXNfbfs5CwtanGKzXbDzQGoK1hzK7dUPU9TnOHvE&s=10',
        'https://cloudfront-us-east-1.images.arcpublishing.com/estadao/THWRKLGVOVEZVC5D4Q3UD2K3VM.jpg',
        'https://futebolatino.com.br/wp-content/uploads/2023/11/Suarez-Gremio.jpg'
    ];

    return (
        <>
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

                        <Text style={[styles.textType, { color: color }]}>{formattedType}</Text>
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

                    {currentState === 'disapproved' && (
                        <View style={styles.why}>
                            <Text style={styles.textResponse}>POR QUÊ?</Text>

                            <Text style={styles.textWhy}>{why}</Text>
                        </View>
                    )}
                </View>
            </View>
        </Modal>

        <Modal
            visible={activeIndex !== null}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setActiveIndex(null)}
        >
            <View style={styles.fullscreenContainer}>
                <FlatList
                    style={{ flex: 1 }}
                    data={images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={activeIndex}
                    getItemLayout={(data, index) => ({
                        length: screenWidth,
                        offset: screenHeight * index,
                        index
                    })}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const dims = imageSize[index];

                        const boxStyle = dims
                            ? { width: dims.width, height: dims.height }
                            : { width: screenWidth, height: screenHeight };

                        return (
                            <View style={styles.fullscreenBg}>
                                <TouchableOpacity
                                    style={styles.fullscreenClickableArea}
                                    activeOpacity={1}
                                    onPress={() => setActiveIndex(null)}
                                >
                                    <TouchableWithoutFeedback onPress={() => {}}>
                                        <View style={boxStyle}>
                                            <Image
                                                source={item}
                                                style={{ width: '100%', height: '100%' }}
                                                contentFit="contain"
                                                onLoad={(event) => {
                                                    const { width, height } = event.source;

                                                    if( !dims) {
                                                        const scale = Math.min(screenWidth / width, screenHeight / height);
                                                        setImageSize(prev => ({
                                                            ...prev,
                                                            [index]: { width: width * scale, height: height * scale }
                                                        }));
                                                    }
                                                }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            </View>
        </Modal>
        </>
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
    fullscreenContainer: {
        flex: 1,
        backgroundColor: Colors.b75
    },
    fullscreenBg: {
        width: screenWidth,
        flex: 1
    },
    fullscreenClickableArea: {
        flex: 1,
        width: '100%',

        justifyContent: 'center',
        alignItems: 'center'
    },
    why: {
        alignItems: 'center',
        width: '100%',

        marginTop: 8
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
    },
    textResponse: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 20
    },
    textWhy: {
        fontFamily: Fonts.regular,
        fontSize: 14,

        textAlign: 'center'
    }
})