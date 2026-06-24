import React from "react"
import { StyleSheet, View, Text } from 'react-native';

import { Image } from 'expo-image';

// Componentes locais
import { Colors, Fonts } from './Theme';

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
        width: 120,
        height: 120,

        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 40,

        position: 'absolute',
        textAlign: 'center',

        top: 0,
        left: -125,
        right: -125,

        height: 120,
        lineHeight: 120,
    },
    logoBg: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    }
})