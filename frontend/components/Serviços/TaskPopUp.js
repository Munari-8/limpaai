import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, FlatList, Dimensions } from "react-native";

// Expo
import { Image } from "expo-image";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";

const { width: screenWidth } = Dimensions.get('window');

export default function TaskPopUp({ visible, onClose, color, icon, name, description, date, startTime, endTime, address, image, personCount, username }){
    const fullTime = `${startTime} - ${endTime}`

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
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.bgShadow}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            <View style={styles.tag}>
                                <MaterialCommunityIcons
                                    name={icon}
                                    size={96}
                                />

                                <Text style={styles.taskName}>{name}</Text>
                            </View>

                            <Text style={styles.subText}>
                                {description}
                            </Text>

                            <View style={styles.info}>
                                <View style={styles.tag}>
                                    <MaterialCommunityIcons
                                        name='calendar'
                                        size={24}
                                        color={color}
                                    />

                                    <Text style={[styles.tagText, { color: color }]}>Data:</Text>
                                </View>

                                <Text style={styles.subText}>{date}</Text>
                            </View>

                            <View style={styles.info}>
                                <View style={styles.tag}>
                                    <MaterialCommunityIcons
                                        name='clock'
                                        size={24}
                                        color={color}
                                    />

                                    <Text style={[styles.tagText, { color: color }]}>Horário:</Text>
                                </View>

                                <Text style={styles.subText}>{fullTime}</Text>
                            </View>

                            <View style={styles.info}>
                                <View style={styles.tag}>
                                    <MaterialIcons
                                        name='location-pin'
                                        size={24}
                                        color={color}
                                    />

                                    <Text style={[styles.tagText, { color: color }]}>Localização:</Text>
                                </View>

                                <Text style={styles.subText}>{address}</Text>
                            </View>

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

                            <View style={styles.info}>
                                <View style={styles.tag}>
                                    <MaterialIcons
                                        name='group'
                                        size={24}
                                        color={color}
                                    />

                                    <Text style={[styles.tagText, { color: color }]}>Participantes:</Text>
                                </View>
                                    
                                <Text style={styles.subText}>{personCount}</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
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

                        return(
                            <View style={styles.fullscreenBg}>
                                <TouchableOpacity
                                    style={styles.fullscreenClickableArea}
                                    activeOpacity={1}
                                    onPress={() => setActiveIndex(null)}
                                >
                                    <TouchableWithoutFeedback onPress={() => {}}>
                                        <View style={styles.boxStyle}>
                                            <Image
                                                source={item}
                                                style={{ width: '100%', height: '100%' }}
                                                contentFit="contain"
                                                onLoad={(event) => {
                                                    const { width, height } = event.source;

                                                    if (!dims) {
                                                        const scale = Math.min(screenWidth / width, screenHeight / height);
                                                        setImageSize(prev => ({
                                                            
                                                        }))
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
    container: {
        backgroundColor: Colors.background,
        borderRadius: 24,

        padding: '5%',
        width: '85%',
        maxHeight: '85%',

        alignItems: 'center'
    },
    tag: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        gap: '1%'
    },
    info: {
        width: '100%'
    },
    imageView: {
        flexDirection: 'row',
        width: '100%',

        borderRadius: 24,
        overflow: 'hidden'
    },
    fullscreenBg: {
        width: screenWidth,
        flex: 1
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: Colors.b75
    },
    imageContainer: {
        width: '100%',
        height: '50%',

        justifyContent: 'center',
        alignItems: 'center'
    },
    clickableOverlay: {
        flex: 1,

        width: '100%',
        backgroundColor: 'transparent'
    },
    fullscreenClickableArea: {
        flex: 1,
        width: '100%',

        justifyContent: 'center',
        alignItems: 'center'
    },

    // Text
    taskName: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 24
    },
    subText: {
        fontFamily: Fonts.regular,
        fontSize: 14
    },
    tagText: {
        fontFamily: Fonts.bold,
        fontSize: 16
    },

    // Outro
    fullscreenImage: {
        width: '100%',
        height: '100%'
    }
})