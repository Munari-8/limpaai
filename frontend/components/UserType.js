import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

// Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";

export default function UserType({ wasViewed, userName, taskType }) {
    const varColor = wasViewed ? Colors.white : Colors.black;
    const eventColor = wasViewed ? Colors.w25 : Colors.b25;

    const [isOpen, setIsOpen] = useState(false);

    const iconMapping = {
        animais: 'paw',
        hortas: 'leaf',
        limpeza: 'broom'
    }

    const selectedIcon = iconMapping[taskType] || 'star-circle';

    return (
        <View style={styles.subCon1}>
            <Text style={[styles.username, { color: varColor }]}>{userName} </Text>
                            
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                <MaterialCommunityIcons name={selectedIcon} size={24} color={varColor}/>
            </TouchableOpacity>
        
            {isOpen && (
                <View style={[styles.eventName, { backgroundColor: eventColor }]}>
                    <Text style={[styles.eventText, { color: varColor }]}>Nome do Evento</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    subCon1: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    eventName: {
        backgroundColor: Colors.b25,
        borderRadius: 100,

        paddingHorizontal: 12,
        paddingVertical: 4,

        marginLeft: '1%',

        justifyContent: 'center',
        alignItems: 'center'
    },


    username: {
        fontFamily: Fonts.bold,
        fontSize: 18
    },
    eventText: {
        fontFamily: Fonts.regular,
        fontSize: 14
    }
})