import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native';

// Expo
import { Image } from "expo-image";
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";

export default function CatalogMenu() {
    const navigation = useNavigation();

    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    return (
        <View style={styles.container}>
            {isSubMenuOpen && (
                <View style={{ gap: 8, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={styles.submenuBox}
                        onPress={() => {
                            setIsSubMenuOpen(false);
                            navigation.navigate('YourSuggestions');
                        }}    
                    >
                        <Text style={styles.submenuText}>Suas sugestões</Text>
                    </TouchableOpacity>
                
                    <TouchableOpacity style={styles.submenuBox}>
                        <Text style={styles.submenuText}>Criar sugestão</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => setIsSubMenuOpen(!isSubMenuOpen)}
            >
                <Image
                    source={require('../../assets/limpaai-isotipo-white.svg')}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    // View
    container: {
        position: 'absolute',
        zIndex:8,

        bottom: '11.9%',
        right: '4.6%',

        alignItems: 'flex-end',
        gap: 8
    },
    button: {
        borderRadius: 40,
        width: 80,
        height: 80,
        backgroundColor: Colors.black,

        alignItems: 'center',
        justifyContent: 'center'
    },
    submenuBox: {
        backgroundColor: Colors.b50,
        borderRadius: 128,
        width: '100%',

        paddingHorizontal: 12,
        paddingVertical: 4
    },

    //Text
    submenuText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        color: Colors.white
    },

    // Outro
    icon: {
        width: '66.6%',
        height: '66.6%'
    }
})