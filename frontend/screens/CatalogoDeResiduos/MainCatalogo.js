import React from "react";
import { StyleSheet, View, Text } from "react-native";

// Componentes locais
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import Panel from "../../components/Panel";

export default function MainCatalogoScreen() {
    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <Header txt={'Catálogo de Resíduos'}/>

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
    main: {
        flex: 1,
        top: '10%',
        width: '100%',
        alignItems: 'center',
    },
})