import React from "react"
import { StyleSheet, TextInput } from "react-native"

// Componentes locais
import { Colors, Fonts } from "./theme"

export default function FormInput({ placeholder, value, setValue, secureTextEntry = false, editable = true }) {
    const isPlaceholderActive = value === '';

    return (
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
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.formInputBg,

        padding: 8,
        paddingHorizontal: 16,
        width: '80%',
        borderRadius: 100,

        justifyContent: 'center'
    }
})