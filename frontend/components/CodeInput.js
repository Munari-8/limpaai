import React, { useRef } from "react";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";

// Componentes locais
import { Colors, Fonts } from "./theme";

export default function CodeInput({ code, setCode }) {
    const inputRef = useRef(null);
    const maxLength = 4;

    const boxesArray = Array(maxLength).fill('');

    const handlePress = () => {
        inputRef.current?.focus()
    };

    return (
        <Pressable style={styles.container} onPress={handlePress}>
            <TextInput
                ref={inputRef}
                value={code}
                onChange={setCode}
                maxLength={maxLength}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                style={styles.hiddenTextInput}
            />

            <View style={styles.boxesContainer}>
                {boxesArray.map((_, index) => {
                    const char = code[index] || '';

                    const isCurrentBox = index === code.length;

                    return (
                        <View
                            key={index}
                            style={[
                                styles.box,
                                isCurrentBox && styles.boxFocused
                            ]}
                        >
                            <Text style={styles.boxText}>{char}</Text>
                        </View>
                    );
                })}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',

        justifyContent: 'center',
        alignItems: 'center',

        marginVertical: 20
    },
    boxesContainer: {
        width: '100%',

        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: '6%'
    },
    box: {
        width: 70,
        height: 70,
        backgroundColor: Colors.formInputBg,
        borderRadius: 20,

        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 2,
        borderColor: 'transparent',
    },

    boxFocused: {
        backgroundColor: Colors.greenLA0
    },

    boxText: {
        fontSize: 32,
        fontFamily: Fonts.bold
    },
    hiddenTextInput: {
        position: 'absolute',

        width: '100%',
        height: '100%',

        opacity: 0
    }
})