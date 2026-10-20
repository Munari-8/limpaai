import React from "react";
import {
    StyleSheet, KeyboardAvoidingView, ScrollView, Pressable, Keyboard, Platform, View
} from "react-native";

// Componentes locais
import { Colors } from "./Theme";

export default function ScreenWrapper({ children }) {
    const WrapperComponent = Platform.OS === 'web' ? View : Pressable;
    const wrapperProps = Platform.OS === 'web'
        ? { style: styles.presssableArea }
        : { onPress: Keyboard.dismiss, style: styles.presssableArea };

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
                <WrapperComponent {...wrapperProps}> 
                    {children}
                </WrapperComponent>
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