import React from "react";
import { StyleSheet, View, Text } from "react-native";

// Expo
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";

export default function TaskBox({ taskType, showTaskType=true, name, date, time, address, peopleCount }) {
    const bgColorMapping = {
        animais: Colors.animais,
        hortas: Colors.hortas,
        limpeza: Colors.limpeza
    }

    let selectedIcon = ''

    if (showTaskType) {
        const iconMapping = {
            animais: 'paw',
            hortas: 'leaf',
            limpeza: 'broom'
        }

        selectedIcon = iconMapping[taskType];
    } else {
        selectedIcon = ''
    }

    const selectedBgColor = bgColorMapping[taskType] || Colors.naoReciclavel;

    return (
        <View>
            <View style={[styles.container, { backgroundColor: selectedBgColor }]}>
                <MaterialCommunityIcons
                    name={selectedIcon}
                    size={92}
                />
                
                <View>
                    <Text style={styles.text1}>{name}</Text>

                    <Text style={styles.text2}>
                        <MaterialCommunityIcons
                            name='calendar'
                            size={24}
                        /> {date}
                    </Text>

                    <Text style={styles.text2}>
                        <MaterialCommunityIcons
                            name='clock'
                            size={24}
                        /> {time}
                    </Text>

                    <Text style={styles.text2}>
                        <MaterialIcons
                            name='location-on'
                            size={24}
                        /> {address}
                    </Text>

                    <Text style={styles.text2}>
                        <MaterialIcons
                            name='group'
                            size={24}
                        /> {peopleCount}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',

        padding: '5%',
        borderRadius: 16
    },

    // Text
    text1: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 24
    },
    text2: {
        fontFamily: Fonts.medium,
        fontSize: 16
    }
})