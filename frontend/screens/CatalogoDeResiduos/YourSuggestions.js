import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Local
import { Colors, Fonts } from "../../components/Theme";
import CatalogMenu from "../../components/Catálogo de Resíduos/CatalogMenu";
import ScreenWrapper from "../../components/ScreenWrapper";
import ToggleList from "../../components/ToggleList";
import WasteBox from "../../components/Catálogo de Resíduos/WasteBox";
import CatalogAddMenu from "../../components/Catálogo de Resíduos/CatalogAddMenu";

import { useAuth } from "../../contexts/AuthContext";
import { API_URL } from "../../services/api";

export default function YourSuggestionsScreen() {
    const { user } = useAuth();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadSuggestions = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/sugestoes-residuos/usuario/${user.id}`);
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setSuggestions(data);
            }
        } catch (error) {
            console.log("Erro ao carregar sugestões:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadSuggestions();
        }, [user?.id])
    );

    const pending = suggestions.filter(s => s.status === 'pending');
    const approved = suggestions.filter(s => s.status === 'approved');
    const disapproved = suggestions.filter(s => s.status === 'disapproved');

    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <CatalogAddMenu />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.suggestionsList}>
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.greenLA1} style={{ marginTop: 50 }} />
                    ) : suggestions.length === 0 ? (
                        <Text style={styles.textDefault}>Você ainda não enviou nenhuma sugestão... Contribua agora mesmo!</Text>
                    ) : (
                        <>
                            <ToggleList text={`Sugestões Pendentes (${pending.length})`}>
                                <View style={styles.suggestionsContainer}>
                                    {pending.map(item => (
                                        <WasteBox
                                            key={item.id_sugestao}
                                            images={item.foto_residuos}
                                            name={item.nome}
                                            type={item.tipo}
                                            description={item.observacoes}
                                            currentState={'pending'}
                                        />
                                    ))}
                                </View>
                            </ToggleList>

                            <ToggleList text={`Sugestões Aprovadas (${approved.length})`}>
                                <View style={styles.suggestionsContainer}>
                                    {approved.map(item => (
                                        <WasteBox
                                            key={item.id_sugestao}
                                            images={item.foto_residuos}
                                            name={item.nome}
                                            type={item.tipo}
                                            description={item.observacoes}
                                            currentState={'approved'}
                                        />
                                    ))}
                                </View>
                            </ToggleList>

                            <ToggleList text={`Sugestões Reprovadas (${disapproved.length})`}>
                                <View style={styles.suggestionsContainer}>
                                    {disapproved.map(item => (
                                        <WasteBox
                                            key={item.id_sugestao}
                                            images={item.foto_residuos}
                                            name={item.nome}
                                            type={item.tipo}
                                            description={item.observacoes}
                                            currentState={'disapproved'}
                                            why={item.motivo_reprovacao}
                                        />
                                    ))}
                                </View>
                            </ToggleList>
                        </>
                    )}
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    innerContainer:{
        flex: 1,
        paddingHorizontal: '5%',

        backgroundColor: Colors.background
    },
    suggestionsList: {
        width: '100%',

        paddingVertical: 100,
        gap: 16
    },
    suggestionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 13.75,
        justifyContent: 'space-between',

        width: '100%'
    },

    // Text
    textDefault: {
        flex: 1,
        marginTop: '25%',

        fontFamily: Fonts.light,
        textAlign: 'center',
    }
});