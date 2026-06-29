import React, { useState, useRef } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from "react-native";

// Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";

// Largura total da tela
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function UserType({ wasViewed, userName, taskType }) {
    // Cores
    const varColor = wasViewed ? Colors.white : Colors.black;

    // taskType
    const [isOpen, setIsOpen] = useState(false);

    const iconMapping = {
        animais: 'paw',
        hortas: 'leaf',
        limpeza: 'broom'
    }

    const selectedIcon = iconMapping[taskType] || 'star-circle';

    // Altura da tela
    const iconRef = useRef(null);
    const [positionMode, setPositionMode] = useState('right');

    const getTooltipPositionStyle = () => {
        switch (positionMode) {
            case 'left':
                return { right: 28, left: undefined, top: undefined };
            case 'bottom':
                return { right: 28, left: -50, top: undefined };
            case 'right':
            default:
                return { left: 28, right: undefined, top: undefined };
        }
    };

    const toggleTooltip = () => {
        if (!isOpen) {
            iconRef.current?.measureInWindow((x, y, width, height) => {
                const spaceRight = SCREEN_WIDTH - (x + width);
                const spaceLeft = x;

                const estimatedTooltipWidth = 140;

                if (spaceRight >= estimatedTooltipWidth) {
                    setPositionMode('right');
                } else if (spaceLeft >= estimatedTooltipWidth) {
                    setPositionMode('left');
                } else {
                    setPositionMode('bottom');
                }

                setIsOpen(true);
            });
        } else {
            setIsOpen(false);
        }
    };

    return (
        <View style={[styles.subCon1, { flex: 1, flexShrink: 1 }]}>
            {isOpen && (
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                />
            )}

            <Text
                style={[styles.username, { color: varColor }]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {userName} </Text>

            <View
                ref={iconRef}
                style={{
                    flexDirection: 'row',
                    position: 'relative',
                    alignItems: 'center',
                    zIndex: 10
                }}
            >
                <TouchableOpacity onPress={toggleTooltip}>
                    <MaterialCommunityIcons
                        name={selectedIcon}
                        size={24}
                        color={varColor}
                    />
                </TouchableOpacity>
            
                {isOpen && (
                    <View style={[styles.eventName, { backgroundColor: Colors.b50 }, getTooltipPositionStyle()]}>
                        <Text style={styles.eventText}>Nome do Evento</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    subCon1: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eventName: {
        position: 'absolute',

        backgroundColor: Colors.b25,
        borderRadius: 100,

        paddingHorizontal: 12,
        paddingVertical: 4,

        marginHorizontal: '1%',

        justifyContent: 'center',
        alignItems: 'center',

        zIndex: 20
    },

    // Text
    username: {
        fontFamily: Fonts.bold,
        fontSize: 18,

        flexShrink: 1,
        marginRight: '2%'
    },
    eventText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.white
    },

    // Outros
    backdrop: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,

        backgroundColor: 'black',

        zIndex: 1
    }
})