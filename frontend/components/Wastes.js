import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Touchable } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Expo
import { Image } from "expo-image";

// Local
import { Colors, Fonts } from "./Theme";

export default function Wastes({ color, text, image, screen }) {
    const navigation = useNavigation();

    const img = `return(${image})`;

    return (
        <View style={{ width: '48%' }}>
            <TouchableOpacity onPress={() => screen && navigation.navigate(screen)}>
                <View style={[styles.container, {backgroundColor: color}]}>
                    <Text style={styles.text}>
                        {text}
                    </Text>

                    <Image
                        source={img}
                    />
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
    }
})