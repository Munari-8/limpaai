import React from "react"
import { StyleSheet, TextInput, Text, View, useWindowDimensions } from "react-native"

// Componentes locais
import { Colors, Fonts } from "./Theme"

export default function FormInput({ placeholder, value, setValue, secureTextEntry = false, editable = true, error, ...rest }) {
    const { width } = useWindowDimensions();

    const getWidth = () => {
        if (width > 1024) return '40%'; // Big desktop
        if (width > 768) return '60%';  // Tablet or small desktop
        return '80%';                   // Cell phone
    };

    const isPlaceholderActive = value === '';

    const formWidth = getWidth();

    return (
        <View style={styles.wrapper}>
            <View style={[
                styles.container,
                { width: formWidth }
            ]}>
                <TextInput
                    style={[
                        styles.input,
                        { fontFamily: isPlaceholderActive ? Fonts.regular : Fonts.regular }
                    ]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={setValue}
                    secureTextEntry={secureTextEntry}
                    editable={editable}
                    {...rest}
            />
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 4
    },
    container: {
        alignItems: 'stretch'
    },
    input: {
        backgroundColor: Colors.formInputBg,

        padding: 8,
        paddingHorizontal: 16,
        width: '100%',
        borderRadius: 100,

        justifyContent: 'center'
    },
    errorText: {
        color: 'red',
        fontFamily: Fonts.light,
        marginTop: 4,
        textAlign: 'center'
    }
})