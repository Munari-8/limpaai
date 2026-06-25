import React from "react";
import { StyleSheet, View, Text } from "react-native";

// Componentes locais
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import MessageBox from "../../components/MessageBox";

export default function InboxScreen() {
    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>                    
                <View style={styles.main}>
                    <MessageBox
                        wasViewed={true}
                        userName={'João'}
                        taskType={'animais'}

                        lastMessage={'Opa, vai ter o negócio de cultivo amanhã, tu vai?'}
                        submittedByUser={false}
                        data={'08:32'}
                    />

                    <MessageBox
                        wasViewed={false}
                        userName={'Vitor'}
                        taskType={'hortas'}

                        lastMessage={'Posso te passar o link do documento?'}
                        submittedByUser={true}
                        data={'15/06/2026'}
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
        top: '10%',
        width: '100%',
        alignItems: 'center',

        rowGap: '2%'
    },
})