import { StyleSheet, TouchableOpacity, Text } from 'react-native'

// Componentes locais
import { Colors, Fonts } from './Theme'

export default function Button({ text, color = Colors.black, flex = false, onPress }) {
    let flexB = ''
    let width = '80%'

    if (flex) {
        flexB = 1
        width = 'auto'
    }

    return (
        <TouchableOpacity style={styles.button(color, flexB, width)} onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: (color, flexB, width) => ({
        backgroundColor: color,

        padding: 8,
        borderRadius: 100,

        alignItems: 'center',
        justifyContent: 'center',

        flex: flexB,
        width: width
    }),
    text: {
        color: '#ffffff',
        fontFamily: Fonts.bold,
        fontSize: 16
    }
})