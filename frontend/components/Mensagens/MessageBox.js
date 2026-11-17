import React, { use, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
import { Image } from "expo-image";
import UserType from "../UserType";
import { API_URL } from "../../services/api";

export default function MessageBox({
    wasViewed = false, userName, taskType, userIcon, lastMessage, submittedByUser,
    data, idConversa, status, isOwner, onRefresh
}) {
    const navigation = useNavigation();

    const cardColor = wasViewed ? Colors.greenLA1 : Colors.b10;
    const varColor = wasViewed ? Colors.white : Colors.black;
    const avatarPlaceholder = wasViewed
        ? require('../../assets/person/personGreen.svg')
        : require('../../assets/person/personBlack.svg');
    const submitted = submittedByUser ? 'arrow-top-right' : 'arrow-bottom-left';

    const formatUri = (uri) => (uri && (uri.startsWith('http') || uri.startsWith('file://'))) ? uri : `${API_URL}${uri}`;

    return (
        <TouchableOpacity
            style={{ width: '100%' }}
            onPress={() => navigation.navigate('Chat', {
                idConversa,
                otherUserName: userName,
                otherUserAvatar: userIcon,
                taskType,
                status,
                isOwner
            })}
        >
            <View style={[styles.container, { backgroundColor: cardColor }]}>
                <Image
                    source={userIcon ? { uri: formatUri(userIcon) } : null}
                    placeholder={avatarPlaceholder}
                    style={styles.avatar}
                    contentFit="cover"
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

                    {status === 'pendente' && (
                        <Text style={[styles.pendingTag, { color: varColor }]}>
                            {isOwner ? '• Solicitação de mensagem' : '• Aguardando aprovação'}
                        </Text>
                    )}

                    <View style={styles.subCon1}>
                        <MaterialCommunityIcons name={submitted} size={24} color={varColor} />

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
        justifyContent: 'center'
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    subCon1: {
        width: '100%',
        
        flexDirection: 'row',
        alignItems: 'center'
    },
    timeDate: {
        alignSelf: 'center',

        marginLeft: '2%',

        flexShrink: 0
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 160,

        marginRight: '4%',

        backgroundColor: Colors.white
    },

    // Text
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
    pendingTag: {
        fontFamily: Fonts.bold,
        fontSize: 12,

        marginVertical: 2
    }
})