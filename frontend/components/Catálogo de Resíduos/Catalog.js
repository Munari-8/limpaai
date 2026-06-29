import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialIcons } from '@expo/vector-icons'
import { Image } from "expo-image";

// Local
import { Colors, Fonts } from "../Theme";
import Header from '../Header'
import HeaderCatalog from "./HeaderCatalog";
import Wastes from "./Wastes";

export default function Catalog({ children, titleHeader, image }) {
    const text = titleHeader.toUpperCase();

    return (
        <View style={styles.container}>
            <HeaderCatalog txt={text}/>
                <View style={styles.main}>
                    {children}  
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    main: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: '4%',

        top: '4%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
})