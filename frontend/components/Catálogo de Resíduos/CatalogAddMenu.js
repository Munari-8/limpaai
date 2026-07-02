import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

// Expo
import { MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
import AddWastePopUp from "./AddWastePopUp";
 
export default function CatalogAddMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AddWastePopUp
                visible={isOpen}
                onClose={() => setIsOpen(false)}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => setIsOpen(true)}
            >
                <MaterialIcons
                    name='add'
                    size={64}
                    color={Colors.white}
                />
            </TouchableOpacity>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        zIndex: 8,

        bottom: '11.9%',
        right: '4.6%',
        
        borderRadius: 40,
        width: 80,
        height: 80,
        backgroundColor: Colors.black,

        alignItems: 'center',
        justifyContent: 'center'
    }
})