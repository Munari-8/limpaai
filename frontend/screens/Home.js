import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from "expo-image";

// Componentes locais
import { Colors, Fonts } from "../components/Theme";
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button'
import Panel from "../components/Panel";
import Header from "../components/Header";

export default function HomeScreen({ navigation }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <Header txt={'Página Inicial'}/>

                <View style={styles.main}>
                    <Image
                        placeholder={require('../assets/person.svg')}
                        style={styles.icon}
                        contentFit='fill'
                        placeholderContentFit="cover"
                    />
                    <Text style={styles.text2}>BEM-VINDO(A),</Text>
                    <Text style={styles.textUsername}>USUÁRIO</Text>

                    <Text style={styles.text1}>
                        <Text style={styles.serviceCounterText}>0 </Text>
                        Serviços realizados
                    </Text>

                    <Text style={styles.rank}>Ranque</Text>
                    
                    <Button
                        text={'Editar perfil'}
                        color={Colors.greenLA1}
                    />
                </View>
                
                <View style={styles.tasks}>
                    <View style={{backgroundColor: Colors.greenLA0, width: '100%', height: '1%', borderRadius: '50%'}}></View>

                    <View style={{alignItems: 'center', right: '27.5%', flexDirection: 'row', marginTop: '1%'}}>
                        <Text style={styles.text3}>Proximas tarefas</Text>

                        <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                            <MaterialIcons
                                name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                size={32}
                                color={Colors.black}
                            />
                        </TouchableOpacity>

                        {isOpen && (
                            <View style={styles.taskList}>
                                
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    // View
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
    tasks: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },

    // Text
    textUsername: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 44,

        marginVertical: '-2%'
    },
    serviceCounterText: {
        color: Colors.greenLA1,
        fontFamily: Fonts.bold,
        fontSize: 16
    },
   text1: {
        fontFamily: Fonts.regular,
        fontSize: 16
    },
    text2: {
        color: Colors.greenLA2,
        fontFamily: Fonts.bold,
        fontSize: 16
    },
    text3: {
        fontFamily: Fonts.bold,
        fontSize: 16
    },

    // Outro
    rank: {
        fontFamily: Fonts.bold,
        color: 'white',

        backgroundColor: Colors.bronze,
        borderRadius: 100,

        paddingVertical: '1.5%',
        paddingHorizontal: '3%',
        marginVertical: '2%'
    },
    icon: {
        width: 180,
        height: 180,
        borderRadius: 100,
        backgroundColor: Colors.greenLA0,

        marginBottom: '5%'
    }
})