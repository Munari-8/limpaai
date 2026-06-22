import React from "react"
import { StyleSheet, View, Text } from 'react-native';

import { Image } from 'expo-image';

// Componentes locais
import { Colors, Fonts } from '../components/theme';

export default function LogoTitle({ text }) {
    return (
        <View style={styles.logo}>
            <Image
                source={require('../assets/limpaai-isotipo.svg')}
                style={styles.logoBg}
                contentFit='contain'
            />
            
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 150,
        height: 150,

        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 48,

        position: 'absolute',
        textAlign: 'center',

        top: 0,
        left: -125,
        right: -125,

        height: 150,
        lineHeight: 150,
    },
    logoBg: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    }
})