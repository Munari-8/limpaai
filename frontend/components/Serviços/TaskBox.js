import React, { use, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
import TaskPopUp from "./TaskPopUp";

// Formata a data para ser exibida
const formatDate = (dateString) => {
    if (!dateString) return '';

    const [day, month, year] = dateString.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateObj.getTime() === today.getTime()) return 'Hoje';

    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const monthName = months[dateObj.getMonth()];

    return (year === today.getFullYear())
        ? `${day} de ${monthName}`
        : `${day} de ${monthName} de ${year}`;
};

export default function TaskBox({
    taskType, name, description, date, showDate = true, startTime, endTime, address, image, registeredPeople = 0, personLimit = 0, username,
    showDateTag = false, ...props
}) {
    // Definição do ícone baseado no tipo do serviço
    let selectedIcon = ''

    const iconMapping = {
        animais: 'paw',
        hortas: 'leaf',
        limpeza: 'broom'
    };
    
    const baseIcon = iconMapping[taskType] || 'alert';

    // Definição do avatar baseado no tipo de serviço
    const avatarPlaceholderMapping = {
        animais: require('../../assets/person/personAnimais.svg'),
        hortas: require('../../assets/person/personHortas.svg'),
        limpeza: require('../../assets/person/personLimpeza.svg')
    }

    const avatarPlaceholder = avatarPlaceholderMapping[taskType];

    // Definição de cores baseado no tipo do serviço
    const bgColorMapping = {
        animais: Colors.animais,
        hortas: Colors.hortas,
        limpeza: Colors.limpeza
    }

    const color = bgColorMapping[taskType] || Colors.naoReciclavel;
    const darkColor = Colors[`${taskType}Dark`] || Colors.black;
    const lightColor = Colors[`${taskType}Light`] || Colors.white;

    const taskName = name.toUpperCase();

    // Formatação da data
    const formattedDate = formatDate(date);

    // Controles do TaskPopUp
    const [isOpen, setIsOpen] = useState(false);

    // Ajuste de variáveis para exibição
    const personCount = `${registeredPeople}/${personLimit}`

    const resDate = date?.slice(0, -5) || '';

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
                date={date}
                startTime={startTime}
                endTime={endTime}
                address={address}
                image={image}
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

                                    <Text style={styles.text2}>
                                        {resDate}
                                    </Text>
                                </View>
                            )}

                        <View style={styles.centerProps}>
                            <MaterialCommunityIcons
                                name='clock'
                                size={24}
                                color={Colors.white}
                            />

                            <Text style={styles.text2}>
                                {startTime}
                            </Text>
                        </View>
                        
                        <View style={styles.centerProps}>
                            <MaterialIcons
                                name='location-pin'
                                size={24}
                                color={Colors.white}
                            />

                            <Text style={styles.text2}>
                                {address}
                            </Text>
                        </View>
                        
                        <View style={styles.centerProps}>
                            <MaterialIcons
                                name='group'
                                size={24}
                                color={Colors.white}
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