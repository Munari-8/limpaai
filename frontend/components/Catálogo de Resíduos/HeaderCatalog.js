import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";

export default function HeaderCatalog({ txt }) {
    const route = useRoute();
    const navigation = useNavigation();

    // Screen switcher
    const SCREEN_SEQUENCE = ['Vidro', 'Metal', 'Plastico', 'Papel', 'Organico', 'NaoReciclavel'];

    const curScreen = route.name
    const curIndex = SCREEN_SEQUENCE.indexOf(curScreen);

    const nextIndex = (curIndex + 1) % SCREEN_SEQUENCE.length;
    const nextScreen = SCREEN_SEQUENCE[nextIndex];

    const prevIndex = (curIndex - 1 + SCREEN_SEQUENCE.length) % SCREEN_SEQUENCE.length;
    const prevScreen = SCREEN_SEQUENCE[prevIndex];

    // Other
    let color = ''

    switch (txt) {
        case 'VIDRO':
            color = Colors.vidro;
            break;
        case 'METAL':
            color = Colors.metal;
            break;
        case 'PLÁSTICO':
            color = Colors.plastico;
            break;
        case 'PAPEL':
            color = Colors.papel;
            break;
        case 'ORGÂNICO':
            color = Colors.organico;
            break;
        case 'NÃO RECICLÁVEL':
            color = Colors.naoReciclavel;
            break;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate(prevScreen)}>
                <MaterialIcons
                    name='arrow-back-ios'
                    size={32}
                    color={color}
                />
            </TouchableOpacity>

            <Text style={[styles.text, { color: color }]}>{txt}</Text>

            <TouchableOpacity onPress={() => navigation.navigate(nextScreen)}>
                <MaterialIcons
                    name='arrow-forward-ios'
                    size={32}
                    color={color}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '20%',

        width: '100%'
    },

    text: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 28
    }
})