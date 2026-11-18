import React, { useState } from "react";
import { StyleSheet, View, Text, Modal, TouchableOpacity, FlatList, Dimensions, TouchableWithoutFeedback, ScrollView } from "react-native";

// Expo
import { Image } from "expo-image";
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WastePopUp({ visible, onClose, name, type, description, currentState, why, images = [] }) {
    // "Não Reciclável" chega do banco como "nao reciclavel" (com espaço),
    // então normaliza tudo pra minúsculo e sem espaço antes de procurar nos mapas.
    const typeKey = String(type || '').toLowerCase().replace(/\s+/g, '');

    // Define a cor baseado no tipo do resíduo
    const mappingColor = {
        vidro: Colors.vidro,
        metal: Colors.metal,
        plastico: Colors.plastico,
        papel: Colors.papel,
        organico: Colors.organico,
        naoreciclavel: Colors.naoReciclavel
    };

    const color = mappingColor[typeKey] || Colors.naoReciclavel;

    // Define o ícone baseado no tipo do resíduo
    const mappingIcon = {
        vidro : 'glass-fragile',
        metal: 'anvil',
        plastico: 'bottle-soda',
        papel: 'package-variant-closed',
        organico: 'food-apple',
        naoreciclavel: 'delete-off'
    }

    const typeIcon = mappingIcon[typeKey];

    // Formata a escrita do tipo do resíduo
    const mappingType = {
        vidro: 'Vidro',
        metal: 'Metal',
        plastico: 'Plástico',
        papel: 'Papel',
        organico: 'Orgânico',
        naoreciclavel: 'Não Reciclável'
    };

    const formattedType = mappingType[typeKey];

    // Controle das imagens
    const [activeIndex, setActiveIndex] = useState(null);
    const [imageSize, setImageSize] = useState({});

    // Miniatura clicável que abre a imagem em tela cheia
    const renderThumb = (idx, touchStyle, placeholder) => (
        <TouchableOpacity
            key={idx}
            style={touchStyle}
            onPress={() => setActiveIndex(idx)}
        >
            <Image
                source={images[idx]}
                placeholder={placeholder}
                style={styles.fill}
                contentFit='cover'
                placeholderContentFit="cover"
            />
        </TouchableOpacity>
    );

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
                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.textTitle}>SUGESTÃO DE RESÍDUO</Text>

                        <View style={{ alignItems: 'center', marginVertical: '2.5%' }}>
                            <Text style={styles.textName}>{name}</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons
                                    name={typeIcon}
                                    size={24}
                                    color={color}
                                />
                                
                                <Text style={[styles.textType, { color: color }]}>{formattedType}</Text>
                            </View>
                        </View>
                        
                        <Text style={styles.textDescription}>{description}</Text>

                        {images.length > 0 && (
                            <View style={styles.imageView}>
                                {images.length === 1 && renderThumb(
                                    0,
                                    { width: '100%', height: 200 },
                                    require('../../assets/brokenImage200.svg')
                                )}

                                {images.length === 2 && images.map((_, idx) => renderThumb(
                                    idx,
                                    { flex: 1, height: 160 },
                                    require('../../assets/brokenImage200.svg')
                                ))}

                                {images.length === 3 && (
                                    <>
                                        {renderThumb(
                                            0,
                                            { width: '66.66%', aspectRatio: 1 },
                                            require('../../assets/brokenImage200.svg')
                                        )}

                                        <View style={{ width: '33.33%' }}>
                                            {renderThumb(
                                                1,
                                                { width: '100%', aspectRatio: 1 },
                                                require('../../assets/brokenImage400.svg')
                                            )}
                                            {renderThumb(
                                                2,
                                                { width: '100%', aspectRatio: 1 },
                                                require('../../assets/brokenImage400.svg')
                                            )}
                                        </View>
                                    </>
                                )}

                                {images.length >= 4 && images.slice(0, 4).map((_, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={{ width: '48.5%', aspectRatio: 1 }}
                                        onPress={() => setActiveIndex(idx)}
                                    >
                                        <Image
                                            source={images[idx]}
                                            placeholder={require('../../assets/brokenImage200.svg')}
                                            style={styles.fill}
                                            contentFit='cover'
                                            placeholderContentFit="cover"
                                        />

                                        {idx === 3 && images.length > 4 && (
                                            <View style={styles.moreOverlay}>
                                                <Text style={styles.moreText}>+{images.length - 4}</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {currentState === 'disapproved' && (
                            <View style={styles.why}>
                                <Text style={styles.textResponse}>POR QUÊ?</Text>

                                <Text style={styles.textWhy}>{why}</Text>
                            </View>
                        )}
                    </ScrollView>
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
                        offset: screenWidth * index,
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
                                                style={styles.fill}
                                                contentFit="contain"
                                                onLoad={(event) => {
                                                    const { width, height } = event.source;

                                                    if (!dims) {
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

        overflow: 'hidden'
    },
    scrollContainer: {
        width: '100%'
    },
    scrollContent: {
        padding: '5%',
        alignItems: 'center'
    },
    imageView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        
        marginTop: '5%',

        borderRadius: 24,
        overflow: 'hidden'
    },
    fill: {
        width: '100%',
        height: '100%'
    },
    moreOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
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
        fontSize: 16,
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
    },
    moreText: {
        color: '#fff',
        fontFamily: Fonts.bold,
        fontSize: 18
    }
})