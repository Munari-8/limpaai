import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialIcons } from '@expo/vector-icons'

// Componentes locais
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function ChatScreen() {
    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}> 
                <View style={styles.header}>
                    <TouchableOpacity>
                        <MaterialIcons name='arrow-back-ios-new' size={32} color='white'/>
                    </TouchableOpacity>
                </View>             

                <View style={styles.main}>

                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        flex: 1,
        backgroundColor: Colors.background,

        alignItems: 'center',
        justifyContent: 'center',

        paddingVertical: '5%',
        paddingHorizontal: '5%'
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,

        paddingHorizontal: '5%',
        paddingVertical: '2%',
        paddingTop: '12.5%',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,

        backgroundColor: Colors.black,
    },
    main: {
        flex: 1,
        top: '10%',
        width: '100%',
        alignItems: 'center',
    },
})