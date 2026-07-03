import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";

export default function FormSelect({ placeholder, options, selectedValue, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (item) => {
        onSelect(item);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.selectedTrigger, isOpen && styles.selectedTriggerActive]}
                activeOpacity={0.8}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text style={[styles.seletedText, !selectedValue && { fontFamily: Fonts.light }]}>
                    {selectedValue || placeholder}
                </Text>

                <MaterialIcons
                    name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                    size={24}
                    color={Colors.black}
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

})