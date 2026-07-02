import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

// Local
import { Colors, Fonts } from "./Theme";

export default function FormInput2({ placeholder, value, setValue, characterLimit, maxLength }) {
    const isPlaceholderActive = value === '';

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, { fontFamily: isPlaceholderActive ? Fonts.light : Fonts.regular }]}
                underlineColorAndroid='transparent'
                placeholder={placeholder}
                value={value}
                onChangeText={setValue}
            />

            {characterLimit && (
                <Text style={styles.counter}>{(value?.length || 0)}/{maxLength}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    input: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.black,

        borderBottomWidth: 1.5,
        borderBottomColor: Colors.black,

        paddingBottom: 3,
    },
    counter: {
        alignSelf: 'flex-end',
        marginTop: 3,

        fontSize: 14,
        fontFamily: Fonts.light,
        color: Colors.black
    }
})