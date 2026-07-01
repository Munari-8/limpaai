import React, { useState } from "react";
import { StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
 
export default function CatalogAddMenu() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.button}

        >
            <MaterialCommunityIcons
            
            />

        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        
    }
})