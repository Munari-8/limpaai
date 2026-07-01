import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Componentes locais
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import ToggleList from "../../components/ToggleList";
import TaskBox from "../../components/Serviços/TaskBox";

export default function MainMuralScreen() {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <View style={styles.main}>
                    <ToggleList
                        text={'Serviços por perto'}
                    >
                        <TaskBox
                            taskType={'animais'}
                            name={'SERVIÇO'}
                            description={'Descrição.'}
                            date={'dd/mm/aaaa'}
                            startTime={'00:00'}
                            endTime={'00:00'}
                            address={'Endereço'}
                            username={'Usuário'}
                        />
                    </ToggleList>

                    <ToggleList
                        text={'Outros Serviços'}
                    >

                    </ToggleList>
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
    }
})