import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Colors } from "../components/theme";

export default function HomeScreen()  {
    return (
        <View>
            <Text>gay</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,

        alignItems: 'center',
        justifyContent: 'center',

        paddingTop: '5%',
        paddingBottom: '5%'
    }
})