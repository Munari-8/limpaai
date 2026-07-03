import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";

export default function FormSelect({ placeholder, options, selectedValue, onSelect, isWaste }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (item) => {
        onSelect(item);
        setIsOpen(false);
    };

    // Gere a cor do tipo selecionado caso for relacionado aos resíduos
    let selectedTextColor = Colors.black;
    const mappingSelectedTextColor = {
        'vidro': Colors.vidro,
        'metal': Colors.metal,
        'plastico': Colors.plastico,
        'papel': Colors.papel,
        'organico': Colors.organico,
        'naoReciclavel': Colors.naoReciclavel
    }

    if (isWaste && selectedValue) {
        const key = selectedValue.toLowerCase();
        selectedTextColor = mappingSelectedTextColor[key] || Colors.black;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.selectTrigger, isOpen && styles.selectTriggerActive]}
                activeOpacity={0.8}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text style={[styles.selectedText, !selectedValue && { fontFamily: Fonts.light }]}>
                    {selectedValue || placeholder}
                </Text>

                <MaterialIcons
                    name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color={Colors.b50}
                />
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.dropdown}>
                    {options.map((item, index) => {
                        const isSelected = item === selectedValue;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                                activeOpacity={0.7}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 16,
        zIndex: 64
    },
    selectTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        backgroundColor: Colors.formInputBg,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 24
    },
    selectTriggerActive: {
        backgroundColor: Colors.b10
    },
    dropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,

        backgroundColor: Colors.background,
        borderRadius: 16,
        marginTop: 6,
        paddingVertical: 6,

        overflow: 'hidden',
        zIndex: 128,

        elevation: 16,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5
    },
    optionItem: {
        alignItems: 'center',

        paddingVertical: 3,
        paddingHorizontal: 8,

        backgroundColor: Colors.background
    },
    optionItemSelected: {
        backgroundColor: Colors.formInputBg,
    },

    // Text
    selectedText: {
        fontSize: 14,
        fontFamily: Fonts.bold,
        color: Colors.black
    },
    optionText: {
        fontSize: 15,
        fontFamily: Fonts.regular,
        color: Colors.black
    },
    optionTextSelected: {
        fontFamily: Fonts.medium
    }
})