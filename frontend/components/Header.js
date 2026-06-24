import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";

export default function Header({ txt }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity>
                <MaterialCommunityIcons
                    name='cog-outline'
                    size={32}
                    color={Colors.black}
                />
            </TouchableOpacity>

            <Text style={styles.text}>{txt}</Text>

            <TouchableOpacity>
                <MaterialIcons
                    name='notifications-none'
                    size={32}
                    color={Colors.black}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',

        top: '4.5%',
        left: 0,
        right: 0,

        paddingHorizontal: '5%',
        paddingVertical: '2%',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,

        backgroundColor: Colors.white
    },
    text: {
        fontFamily: Fonts.bold,
        fontSize: 20
    }
})