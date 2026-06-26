import React from "react";
import { StyleSheet, View, Text } from "react-native";

// Locais
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import Wastes from "../../components/Wastes";

export default function MainCatalogoScreen() {
    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <View style={styles.main}>
                    <Wastes
                        color={Colors.vidro}
                        text={'VIDRO'}
                        screen={'Vidro'}
                    />

                    <Wastes
                        color={Colors.metal}
                        text={'METAL'}
                        screen={'Metal'}
                    />

                    <Wastes
                        color={Colors.plastico}
                        text={'PLÁSTICO'}
                        screen={'Plastico'}
                    />

                    <Wastes
                        color={Colors.papel}
                        text={'PAPEL'}
                        screen={'Papel'}
                    />

                    <Wastes
                        color={Colors.organico}
                        text={'ORGÂNICO'}
                        screen={'Organico'}
                    />

                    <Wastes
                        color={Colors.naoReciclavel}
                        text={'NÃO RECICLÁVEL'}
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
        rowGap: '1.7%',

        top: '10%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})