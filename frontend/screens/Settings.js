import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialIcons } from "@expo/vector-icons";

// Local
import { Colors, Fonts } from "../components/Theme";
import ScreenWrapper from "../components/ScreenWrapper";
import { useAuth } from "../contexts/AuthContext";

export default function SettingsScreen({ navigation }) {
    const { logout } = useAuth();

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.menuList}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('EditAccount')}
                    >
                        <MaterialIcons
                            name="lock"
                            size={24}
                            color={Colors.greenLA2}
                        />
                        <Text style={styles.menuText}>Editar conta</Text>
                        <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color={Colors.b50}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, { backgroundColor: '#FFEBEE' }]}
                        onPress={async () => {
                            await logout();
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Welcome' }]
                            });
                        }}
                    >
                        <MaterialIcons
                            name='logout'
                            size={24}
                            color={Colors.plastico}    
                        />
                        <Text style={[styles.menuText, { color: Colors.plastico, fontFamily: Fonts.bold }]}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        paddingHorizontal: '4%',
        paddingVertical: 8
    },
    menuList: {
        width: '100%',
        gap: 16
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
        
        backgroundColor: Colors.formInputBg,
        borderRadius: 16
    },

    // Text
    menuText: {
        fontFamily: Fonts.medium,
        fontSize: 16,
        color: Colors.black,

        flex: 1
    }
})