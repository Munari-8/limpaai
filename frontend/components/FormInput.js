import React from "react"
import { StyleSheet, TextInput, Text, View } from "react-native"

// Componentes locais
import { Colors, Fonts } from "./theme"

export default function FormInput({ placeholder, value, setValue, secureTextEntry = false, editable = true, error }) {
    const isPlaceholderActive = value === '';

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.input,
                    {fontFamily: isPlaceholderActive ? Fonts.light : Fonts.regular}
                ]}
                placeholder={placeholder}
                value={value}
                onChangeText={setValue}
                secureTextEntry={secureTextEntry}
                editable={editable}
           />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center'
    },
    input: {
        backgroundColor: Colors.formInputBg,

        padding: 8,
        paddingHorizontal: 16,
        width: '80%',
        borderRadius: 100,

        justifyContent: 'center'
    },
    errorText: {
        color: 'red',
        fontFamily: Fonts.light,
        marginTop: 4
    }
})