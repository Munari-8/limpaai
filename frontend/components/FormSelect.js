import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Pressable } from "react-native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";

export default function FormSelect({ placeholder, options, selectedValue, onSelect, isWaste, width = 100, zIndex = 1 }) {
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
        <View style={[styles.container, { width: `${width}%`, zIndex: zIndex }]}>
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

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{placeholder}</Text>

                        <ScrollView
                            nestedScrollEnabled={true}
                            keyboardShouldPersistTaps='handled'
                            style={styles.dropdownScroll}
                            persistentScrollbar={true}
                        >
                            {options.map((item, index) => {
                                const isSelected = item === selectedValue;
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                                        activeOpacity={0.7}
                                        onPress={() => handleSelect(item)}
                                    >
                                        <Text style={[styles.optionText, isSelected && styles.optionItemSelected]}>{item}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 0,
    },
    selectTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        backgroundColor: Colors.formInputBg,
        padding: 6,
        paddingHorizontal: 16,
        borderRadius: 24,
    },
    selectTriggerActive: {
        backgroundColor: Colors.b10
    },
    modalOverlay: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: Colors.b25
    },
    modalContent: {
        width: '80%',
        backgroundColor: Colors.background,
        borderRadius: 16,

        paddingVertical: 12,
        paddingHorizontal: 8
    },
    modalTitle: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        textAlign: 'center',
        color: Colors.greenLA2,

        marginBottom: 8
    },
    dropdownScroll: {
        maxHeight: 160
    },
    optionItem: {
        alignItems: 'center',

        paddingVertical: 8,
        paddingHorizontal: 8,
        marginVertical: 2,

        borderRadius: 8
    },
    optionItemSelected: {
        backgroundColor: Colors.formInputBg,
    },

    // Text
    selectedText: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.black,
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