import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Local
import { Colors, Fonts } from "../Theme";
import AddTaskPopUp from "./AddTaskPopUp";

export default function MuralMenu({ onServiceCreated }) {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={styles.container}>
            <AddTaskPopUp
                visible={isOpen}
                onClose={() => setIsOpen(false)}
                onSuccess={() => {
                    setIsOpen(false);
                    setIsSubMenuOpen(false);
                    if (onServiceCreated) onServiceCreated();
                }}
            />

            {isSubMenuOpen && (
                <View style={{ gap: 8, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={styles.submenuBox}
                        onPress={() => {
                            setIsSubMenuOpen(false);
                            setIsOpen(true);
                        }}
                    >
                        <Text style={styles.submenuText}>Criar serviço</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => setIsSubMenuOpen(!isSubMenuOpen)}
            >
                <MaterialIcons
                    name="add"
                    size={48}
                    color={Colors.white}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 8,

        bottom: '11.9%',
        right: '4.6%',
        
        alignItems: 'flex-end',
        gap: 8
    },
    button: {
        borderRadius: 40,
        width: 80,
        height: 80,
        backgroundColor: Colors.black,
        
        alignItems: 'center',
        justifyContent: 'center'
    },
    submenuBox: {
        backgroundColor: Colors.b50,
        borderRadius: 128,

        paddingHorizontal: 12,
        paddingVertical: 6
    },
    submenuText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.white
    }
});