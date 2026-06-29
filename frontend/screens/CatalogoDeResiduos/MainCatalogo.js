import React from "react";
import { StyleSheet, View, Text } from "react-native";

// Locais
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import Wastes from "../../components/Catálogo de Resíduos/Wastes";

export default function MainCatalogoScreen() {
    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <View style={styles.main}>
                    <Wastes
                        color={Colors.vidro}
                        text={'vidro'}
                        screen={'Vidro'}
                    />

                    <Wastes
                        color={Colors.metal}
                        text={'metal'}
                        screen={'Metal'}
                    />

                    <Wastes
                        color={Colors.plastico}
                        text={'plástico'}
                        screen={'Plastico'}
                    />

                    <Wastes
                        color={Colors.papel}
                        text={'papel'}
                        screen={'Papel'}
                    />

                    <Wastes
                        color={Colors.organico}
                        text={'orgânico'}
                        screen={'Organico'}
                    />

                    <Wastes
                        color={Colors.naoReciclavel}
                        text={'não reciclável'}
                        screen={'NaoReciclavel'}
                    />
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: '1.75%',

        top: '10%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})