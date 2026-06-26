import React, { use, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";
import { Image } from "expo-image";
import UserType from "./UserType";

export default function MessageBox({ wasViewed=false, userName, taskType, userIcon, lastMessage, submittedByUser, data }) {
    const navigation = useNavigation();

    const cardColor = wasViewed ? Colors.greenLA1 : Colors.b25;
    const varColor = wasViewed ? Colors.white : Colors.black;
    const avatarSource = wasViewed ? require('../assets/person/personGreen.svg') : require('../assets/person/personBlack.svg');
    const submitted = submittedByUser ? 'arrow-top-right' : 'arrow-bottom-left'

    return (
        <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
            <View style={[styles.container, { backgroundColor: cardColor }]}>
                <Image
                    source={userIcon}
                    placeholder={avatarSource}
                    style={styles.avatar}
                    contentFit="fill"
                    placeholderContentFit="cover"
                />

                <View style={styles.textContainer}>
                    <View style={styles.topRow}>
                        <UserType
                            wasViewed={wasViewed}
                            userName={userName}
                            taskType={taskType}
                        />

                        <View style={styles.timeDate}>
                            <Text style={[styles.timeText, { color: varColor }]}>{data}</Text>
                        </View>
                    </View>

                    <View style={styles.subCon1}>
                        <MaterialCommunityIcons name={submitted} size={24} color={varColor}/>

                        <Text
                            style={[styles.content, { color: varColor }]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {lastMessage}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // View
    container: {
        width: '100%',
        padding: '4%',
        borderRadius: 24,

        flexDirection: 'row',
        alignItems: 'center'
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',

    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subCon1: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeDate: {
        alignSelf: 'center',

        marginLeft: '2%',

        flexShrink: 0
    },
    eventName: {
        backgroundColor: Colors.b25,
        borderRadius: 100,

        paddingHorizontal: 12,
        paddingVertical: 4,

        marginLeft: '1%',

        justifyContent: 'center',
        alignItems: 'center'
    },

    avatar: {
        width: 64,
        height: 64,
        borderRadius: 160,

        marginRight: '4%',

        backgroundColor: Colors.white
    },

    // Text
    username: {
        fontFamily: Fonts.bold,
        fontSize: 18
    },
    content: {
        fontFamily: Fonts.regular,
        fontSize: 15,

        flexShrink: 1
    },
    timeText: {
        fontFamily: Fonts.regular,
        fontSize: 14,
        
        opacity: 0.75
    },
    eventText: {
        fontFamily: Fonts.regular,
        fontSize: 14
    }
})