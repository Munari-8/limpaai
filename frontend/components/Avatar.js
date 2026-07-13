import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// Expo
import { Image } from "expo-image";
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";

export default function Avatar({ source, size = 180, onPress }) {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Image
                source={source}
                placeholder={require(`../assets/person/personGreen.svg`)}
                style={styles.bgImage}
                contentFit="cover"
                placeholderContentFit="contain"
            />

            {onPress && (
                <TouchableOpacity
                    style={styles.edit}
                    onPress={onPress}
                    activeOpacity={0.66}
                >
                    <MaterialCommunityIcons
                        name='pencil'
                        size={size * 0.25}
                        color={Colors.white}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: `relative`,
        alignSelf: `center`
    },
    bgImage: {
        width: `100%`,
        height: `100%`,
        borderRadius: 999,

        backgroundColor: Colors.greenLA0
    },
    edit: {
        position: `absolute`,

        backgroundColor: Colors.b25,
        borderRadius: 999,
        padding: `37.5%`,
        
        justifyContent: `center`,
        alignItems: `center`
    }
})