import React from "react";
import {
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Pressable,
    Keyboard,
    Platform 
} from "react-native";

// Componentes locais
import { Colors } from "./Theme";

export default function ScreenWrapper({ children }) {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode="on-drag"
                bounces={false}
            >
                <Pressable
                    onPress={Keyboard.dismiss}
                    style={styles.presssableArea}
                >
                    {children}
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background
    },
    scrollContainer: {
        flexGrow: 1
    },
    presssableArea: {
        flex: 1,
        width: `100%`
    }
});