import React, { use, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";

export default function ToggleList({ children, text }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.text3}>{text}</Text>
                    
                <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                    <MaterialIcons
                        name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={32}
                        color={Colors.black}
                    />
                </TouchableOpacity>
            </View>

            {isOpen && (
                <View style={styles.taskList}>
                    {children} 
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    text3: {
        fontFamily: Fonts.bold,
        fontSize: 16
    },
    taskList: {
        
    }
})