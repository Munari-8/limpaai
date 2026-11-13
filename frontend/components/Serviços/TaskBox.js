import React, { use, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
import TaskPopUp from "./TaskPopUp";

// Format date
const formatDateToBR = (dateString) => {
    if (!dateString) return '';
    const cleanDate = dateString.split('T')[0];
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}/${month}/${year}`;
    }
    return dateString;
};

export default function TaskBox({
    taskType, name, description, date, showDate = true, startTime, endTime, address, image,
    registeredPeople = 0, personLimit = 0, username, showDateTag = false, ...props
}) {
    const normalizedType = taskType ? taskType.toLowerCase() : '';

    // Set icon
    const iconMapping = {
        animais: 'paw',
        hortas: 'leaf',
        limpeza: 'broom'
    };
    
    const baseIcon = iconMapping[normalizedType] || 'alert';

    // Set avatar
    const avatarPlaceholderMapping = {
        animais: require('../../assets/person/personAnimais.svg'),
        hortas: require('../../assets/person/personHortas.svg'),
        limpeza: require('../../assets/person/personLimpeza.svg')
    }

    const avatarPlaceholder = avatarPlaceholderMapping[taskType];

    // Set color
    const bgColorMapping = {
        animais: Colors.animais,
        hortas: Colors.hortas,
        limpeza: Colors.limpeza
    }

    const color = bgColorMapping[normalizedType] || Colors.naoReciclavel;
    const darkColor = Colors[`${normalizedType}Dark`] || Colors.black;
    const lightColor = Colors[`${normalizedType}Light`] || Colors.white;

    const taskName = name ? name.toUpperCase() : '';

    // Format date
    const formattedDate = formatDateToBR(date);

    // TaskPopUp control
    const [isOpen, setIsOpen] = useState(false);

    const personCount = `${registeredPeople}/${personLimit}`
    const formattedStartTime = startTime ? startTime.slice(0, 5) : '';
    const formattedEndTime = endTime ? endTime.slice(0,5) : '';

    // Format time 2 display
    const timeDisplay = formattedEndTime && formattedEndTime !== formattedStartTime
        ? `${formattedStartTime} - ${formattedEndTime}`
        : formattedStartTime;

    const parsedImages = (() => {
        try {
            if (typeof imagens === 'string') return JSON.parse(imagens);
            if (Array.isArray(imagens)) return imagens;
            if (image) return [image];
            return [];
        } catch {
            return [];
        }
    })();

    return (
        <View style={{ width: '100%' }}>
            <TaskPopUp
                visible={isOpen}
                onClose={() => setIsOpen(false)}
                color={color}
                lightColor={lightColor}
                taskIcon={baseIcon}
                name={taskName}
                description={description}
                date={formattedDate}
                startTime={formattedStartTime}
                endTime={formattedEndTime}
                address={address}
                image={parsedImages}
                personCount={personCount}
                username={username}
                avatarPlaceholder={avatarPlaceholder}
            />

            {showDateTag && (
                <Text style={styles.text3}>{formattedDate}</Text>
            )}

            <TouchableOpacity onPress={() => setIsOpen(true)}>
                <View style={[styles.container, { backgroundColor: color }]}>
                    <View style={styles.textContainer}>
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
                                        color={Colors.white}
                                    />
                                    <Text style={styles.text2}>{formattedDate}</Text>
                                </View>
                            )}

                        <View style={styles.centerProps}>
                            <MaterialCommunityIcons
                                name='clock'
                                size={24}
                                color={Colors.white}
                            />

                            <Text style={styles.text2}>{timeDisplay}</Text>
                        </View>
                        
                        <View style={styles.centerProps}>
                            <MaterialIcons
                                name='location-pin'
                                size={24}
                                color={Colors.white}
                            />

                            <Text style={styles.text2} numberOfLines={2} ellipsizeMode="tail">{address}</Text>
                        </View>
                        
                        <View style={styles.centerProps}>
                            <MaterialIcons
                                name='group'
                                size={24}
                                color={Colors.white}
                            />

                            <Text style={styles.text2}>{personCount}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    // View
    container: {
        flexDirection: 'row',

        padding: '5%',
        borderRadius: 16
    },
    textContainer: {
        flex: 1
    },

    // Text
    text1: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 24,
        color: Colors.white
    },
    text2: {
        fontFamily: Fonts.medium,
        fontSize: 16,
        color: Colors.white
    },
    text3: {
        fontFamily: Fonts.condensedSemiBold,
        fontSize: 16,
        textAlign: 'center',
        paddingBottom: 8
    },

    // Outro
    centerProps: {
        flexDirection: 'row',
        alignItems: 'center',

        gap: '3%'
    }
})