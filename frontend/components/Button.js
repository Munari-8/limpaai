import { StyleSheet, TouchableOpacity, Text } from 'react-native'

// Componentes locais
import { Fonts } from './Theme'

export default function Button({ text, color = '#000000', onPress }) {
    return (
        <TouchableOpacity style={styles.button(color)} onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: (color) => ({
        backgroundColor: color,

        padding: 8,
        width: '80%',
        borderRadius: 100,

        alignItems: 'center',
        justifyContent: 'center'
    }),
    text: {
        color: '#ffffff',
        fontFamily: Fonts.bold,
        fontSize: 16
    }
})