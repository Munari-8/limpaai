import React, { use, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
import TaskPopUp from "./TaskPopUp";

export default function TaskBox({ taskType, showTaskType=true, name, description, date, showDate=true, startTime, endTime, address, image, registeredPeople=0, personLimit=0, username }) {
    // Definição do ícone baseado no tipo do serviço
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

    // Definição de cores baseado no tipo do serviço
    const bgColorMapping = {
        animais: Colors.animais,
        hortas: Colors.hortas,
        limpeza: Colors.limpeza
    }

    const color = bgColorMapping[taskType] || Colors.naoReciclavel;
    const darkColor = Colors[`${taskType}Dark`] || Colors.black;

    const taskName = name.toUpperCase();

    // Controles do TaskPopUp
    const [isOpen, setIsOpen] = useState(false);

    // 
    const personCount = `${registeredPeople}/${personLimit}`

    const resDate = date?.slice(0, -5) || '';

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <TaskPopUp
                visible={isOpen}
                onClose={() => setIsOpen(false)}
                color={darkColor}
                icon={selectedIcon}
                name={taskName}
                description={description}
                date={date}
                startTime={startTime}
                endTime={endTime}
                address={address}
                image={image}
                personCount={personCount}
                username={username}
            />

            <TouchableOpacity onPress={() => setIsOpen(true)}>
                <View style={[styles.container, { backgroundColor: color }]}>
                    <MaterialCommunityIcons
                        name={selectedIcon}
                        size={96}
                    />

                    <View>
                        <Text
                            style={styles.text1}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >{taskName}</Text>
                        
                            {showDate && (
                                <View style={styles.centerProps}>
                                    <MaterialCommunityIcons
                                        name='calendar'
                                        size={24}
                                    />

                                    <Text style={styles.text2}>
                                        {resDate}
                                    </Text>
                                </View>
                            )}

                        <View style={styles.centerProps}>
                            <MaterialCommunityIcons
                                name='clock'
                                size={24}
                            />

                            <Text style={styles.text2}>
                                {startTime}
                            </Text>
                        </View>
                        
                        <View style={styles.centerProps}>
                            <MaterialIcons
                                name='location-pin'
                                size={24}
                            />

                            <Text style={styles.text2}>
                                {address}
                            </Text>
                        </View>
                        
                        <View style={styles.centerProps}>
                            <MaterialIcons
                                name='group'
                                size={24}
                            />

                            <Text style={styles.text2}>
                                {personCount}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
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
    },

    // Outro
    centerProps: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: '3%'
    }
})