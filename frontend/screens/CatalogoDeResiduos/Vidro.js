import React from "react";
import { StyleSheet, View, Text } from "react-native";

// Local
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from '../../components/ScreenWrapper'
import Catalog from "../../components/Catálogo de Resíduos/Catalog";
import Wastes from "../../components/Catálogo de Resíduos/Wastes";

export default function VidroScreen() {
    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <Catalog
                    titleHeader={'vidro'}
                >
                    
                </Catalog>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        flex: 1,
        width: '100%',

        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: '5%',
        paddingHorizontal: '5%'
    }
})