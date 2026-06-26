import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { Image } from "expo-image";
import { MaterialIcons } from '@expo/vector-icons'

// Componentes locais
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import UserType from "../../components/UserType";

export default function ChatScreen({ navigation }) {
    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}> 
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name='arrow-back-ios-new' size={32} color='white'/>
                    </TouchableOpacity>

                    <Image
                        placeholder={require('../../assets/person/personBlack.svg')}
                        style={styles.avatar}
                        contentFit="fill"
                        placeholderContentFit="cover"
                    />

                    <UserType
                        wasViewed={true}
                        userName={'João'}
                        taskType={'animais'}
                    />
                </View>             

                <View style={styles.main}>

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
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,

        paddingHorizontal: '5%',
        paddingVertical: '2%',
        paddingTop: '12%',

        gap: '25%',

        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 10,

        backgroundColor: Colors.black,
    },
    main: {
        flex: 1,
        top: '10%',
        width: '100%',
        alignItems: 'center',
    },

    avatar: {
        position: 'absolute',

        width: 64,
        height: 64,

        borderRadius: 160,
        boxShadow: '0 0 0 7px black',

        marginLeft: '17%',
        marginTop: '14%',

        backgroundColor: Colors.white
    }
})