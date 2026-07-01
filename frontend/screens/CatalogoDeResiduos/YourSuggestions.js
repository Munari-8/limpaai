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
                            <View style={styles.suggestionsContainer}>
                                <WasteBox
                                    name={'Resíduo épico'}
                                    type={'vidro'}
                                    description={'Descrição super híper legal.'}
                                    currentState={'pending'}
                                    why={'Não foi aprovado por piriri, póróró, parara e tururu.'}
                                />
                            </View>
                        </ToggleList>

                        <ToggleList
                            text={'Sugestões Aprovadas'}
                        >
                            <WasteBox
                                type={'plastico'}
                            />
                        </ToggleList>

                        <ToggleList
                            text={'Sugestões Reprovadas'}
                        >
                            <WasteBox
                                type={'naoReciclavel'}
                            />
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

        backgroundColor: Colors.background,

        paddingHorizontal: '5%'
    },
    suggestionsList: {
        width: '100%',

        paddingVertical: 96,

        gap: 8
    },
    suggestionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 13.75,
        
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    // Text
    textDefault: {
        flex: 1,
        fontFamily: Fonts.light,

        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: '50%'
    }
})