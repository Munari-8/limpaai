import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Touchable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// Expo
import { Image } from "expo-image";

// Local
import { Colors, Fonts } from "../Theme";

const COLOR_BY_SCREEN = {
    Vidro: Colors.vidro30,
    Metal: Colors.metal30,
    Plastico: Colors.plastico30,
    Papel: Colors.papel30,
    Organico: Colors.organico30,
    NaoReciclavel: Colors.naoReciclavel30
};

export default function Wastes({ color, text='', image, screen }) {
    const navigation = useNavigation();
    const route = useRoute();
    
    const currentScreen = route.name;
    const dynamicColor = COLOR_BY_SCREEN[currentScreen] || color

    const tag = text.toUpperCase();

    return (
        <View style={{ width: '48%' }}>
            <TouchableOpacity onPress={() => screen && navigation.navigate('CatalogoDeResiduos', { screen: screen })}>
                <View style={[styles.container, {backgroundColor: dynamicColor}]}>
                    {text.length > 0 && (
                        <Text style={styles.text}>
                            {tag}
                        </Text>
                    )}

                    {text.length === 0 && (
                        <Image
                            source={image}
                            style={styles.image}
                            contentFit='contain'
                        />
                    )}
                </View>
            </TouchableOpacity>
        </View>
       
    );
}

const styles = StyleSheet.create({
    container: {
        aspectRatio: 1,
        borderRadius: 24,

        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 28,
        color: Colors.white,
        textAlign: 'center'
    },

    image: {
        width: '80%',
        height: '80%',
    }
})