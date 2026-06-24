import React, { use } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

// Componentes locais
import { Colors } from "./Theme";

export default function Panel({ state, navigation }) {
    const currentRouteName = state ? state.routes[state.index].name : '';

    // Muda a cor do icon relativo a página atual
    const getIconColor = (screenNames)=> {
        if (Array.isArray(screenNames)) {
            return screenNames.includes(currentRouteName) ? Colors.greenLA1 : Colors.white;
        }
        return currentRouteName === screenNames ? Colors.greenLA1 : Colors.white;
    }

    return (
        <LinearGradient
            colors={['transparent', Colors.b75]}
            style={styles.container}
        >
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <MaterialCommunityIcons
                    name='home-outline'
                    size={44}
                    color={getIconColor('Home')}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Inbox')}>
                <MaterialCommunityIcons
                    name='message-text-outline'
                    size={40}
                    color={getIconColor(['Inbox'])}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('MainCatalogo')}>
                <MaterialCommunityIcons
                    name='trash-can-outline'
                    size={40}
                    color={getIconColor(['MainCatalogo'])}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('MainMural')}>
                <MaterialCommunityIcons
                    name='clipboard-text-outline'
                    size={40}
                    color={getIconColor(['MainMural'])}
                />
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: '2%',
        paddingVertical: '5%',

        position: 'absolute',

        bottom: 0,
        width: '111%',

        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: 10
    }
})