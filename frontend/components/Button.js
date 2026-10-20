import { StyleSheet, TouchableOpacity, Text, useWindowDimensions } from 'react-native'

// Componentes locais
import { Colors, Fonts } from './Theme'

export default function Button({ text, color = Colors.black, flex = false, onPress, style }) {
    const { width } = useWindowDimensions();

    const getWidth = () => {
        if (width > 1024) return '25%'; // Big desktop
        if (width > 768) return '50%';  // Tablet or small desktop
        return '80%';                   // Cell phone
    };

    let flexB = ''

    if (flex) {
        flexB = 1
    }

    const buttonWidth = getWidth();

    return (
        <TouchableOpacity style={[
                styles.button(color, flexB),
                { width: buttonWidth},
                style
            ]} onPress={onPress}>
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