import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

// Local
import { Colors, Fonts } from "../../components/Theme";
import CatalogMenu from "../../components/Catálogo de Resíduos/CatalogMenu";
import ScreenWrapper from "../../components/ScreenWrapper";
import ToggleList from "../../components/ToggleList";
import WasteBox from "../../components/Catálogo de Resíduos/WasteBox";

export default function YourSuggestionsScreen() {
    const [isAnyWaste, setIsAnyWaste] = useState(false);

    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                {isAnyWaste && (
                    <Text style={styles.textDefault}>Você ainda não enviou nenhuma sugestão... Contribua agora mesmo!</Text>
                )}

                {!isAnyWaste && (
                    <View style={styles.suggestionsList}>
                        <ToggleList
                            text={'Sugestões Pendentes'}
                        >
                            <WasteBox
                                
                            />
                        </ToggleList>

                        <ToggleList
                            text={'Sugestões Aprovadas'}
                        >

                        </ToggleList>

                        <ToggleList
                            text={'Sugestões Reprovadas'}
                        >

                        </ToggleList>
                    </View>
                )}
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    // View
    innerContainer: {
        flex: 1,
        position: 'relative',

        backgroundColor: Colors.background,

        alignItems: 'center',
        justifyContent: 'center',

        paddingVertical: '5%',
        paddingHorizontal: '5%'
    },
    suggestionsList: {
        width: '100%'
    },

    // Text
    textDefault: {
        fontFamily: Fonts.light,
        textAlign: 'center'
    }
})