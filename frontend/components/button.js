import { StyleSheet, TouchableOpacity, Text } from 'react-native'

export default function Button({ text, color = '#000000' }) {
    return (
        <TouchableOpacity style={styles.button(color)}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: (color) => ({
        backgroundColor: color,

        padding: 8,
        width: '75%',
        borderRadius: 100,

        alignItems: 'center',
        justifyContent: 'center'
    }),
    text: {
        color: '#ffffff',
        fontWeight: 'bold'
    }
})