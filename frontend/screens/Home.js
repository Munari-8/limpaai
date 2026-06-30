import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from "expo-image";

// Componentes locais
import { Colors, Fonts } from "../components/Theme";
import ScreenWrapper from '../components/ScreenWrapper';
import Button from '../components/Button'
import ToggleList from "../components/ToggleList";
import TaskBox from "../components/Serviços/TaskBox";

export default function HomeScreen({ navigation }) {
    const name = 'usuário' // Vai ser recebido como 'name' no futuro

    
    const [isOpen, setIsOpen] = useState(true);
        
    const username = name.toUpperCase();

    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <View style={styles.main}>
                    <Image
                        source={''}
                        placeholder={require('../assets/person/personGreen.svg')}
                        style={styles.avatar}
                        contentFit='contain'
                        placeholderContentFit="cover"
                    />
                    <Text style={styles.text2}>BEM-VINDO(A),</Text>
                    <Text style={styles.textUsername}>{username}</Text>

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
                    <View style={{backgroundColor: Colors.greenLA0, width: '100%', height: 2, borderRadius: '50%'}}></View>

                    <ToggleList
                        text={'Próximos Serviços'}
                    >
                        <TaskBox
                            taskType={'animais'}
                            name={'resgate de gatos no fundo do lugar tal'} //Máx. 30
                            description={'Resgate de gatos perto do bairro X na rua Y. Se puder, leve coisa Z e item W.'}
                            date={'08/07/2026'}
                            showDate={false} // Automatizar pra checar em qual screen ele tá
                            startTime={'14:30'}
                            endTime={'16:30'}
                            address={'Novo Hamburgo'}
                            registeredPeople={'2'}
                            personLimit={'4'}
                            username={username}
                        />
                    </ToggleList>
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
        justifyContent: 'flex-start',

        paddingVertical: '5%',
        paddingHorizontal: '5%'
    },
    main: {
        top: '12%',
        width: '100%',
        alignItems: 'center',
        marginBottom: '32%'
    },
    tasks: {
        width: '100%'
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
    avatar: {
        width: 180,
        height: 180,
        borderRadius: 100,
        backgroundColor: Colors.greenLA0,

        marginBottom: '5%'
    }
})