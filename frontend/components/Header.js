import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// Expo
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "./Theme";
import NotificationsPopUp from "./NotificationsPopUp";
import { API_URL } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Header({ txt, navigation }) {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const loadNotifications = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await fetch(`${API_URL}/notificacoes/${user.id}`);
            const data = await response.json();
            if (response.ok && Array.isArray(data)) {
                setNotifications(data);
            }
        } catch (error) {
            console.log('Erro ao carregar notificações:', error);
        }
    }, [user?.id]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    // Atualização em tempo real via WebSocket
    useEffect(() => {
        if (!user?.id) return;

        const wsUrl = API_URL.replace(/^http/, 'ws');
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'register', userId: user.id }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'notification_update') {
                    loadNotifications();
                }
            } catch (e) {}
        };

        return () => ws.close();
    }, [user?.id, loadNotifications]);

    const handleOpenNotifications = () => {
        loadNotifications();
        setIsNotifOpen(true);
    };

    const handleMarkAsRead = (id_notificacao) => {
        setNotifications(prev =>
            prev.map(n => n.id_notificacao === id_notificacao ? { ...n, lida: 1 } : n)
        );
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    const hasUnread = notifications.some(n => Number(n.lida) === 0);

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation && navigation.navigate('Settings')}
                >
                    <MaterialCommunityIcons
                        name='cog-outline'
                        size={32}
                        color={Colors.black}
                    />
                </TouchableOpacity>

                <Text style={styles.text}>{txt}</Text>

                <TouchableOpacity onPress={handleOpenNotifications}>
                    <MaterialIcons
                        name={hasUnread ? 'notifications' : 'notifications-none'}
                        size={32}
                        color={hasUnread ? Colors.greenLA1 : Colors.black}
                    />
                </TouchableOpacity>
            </View>

            <NotificationsPopUp
                visible={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                notifications={notifications}
                navigation={navigation}
                onMarkAsRead={handleMarkAsRead}
                onClearAll={handleClearAll}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,

        paddingHorizontal: '5%',
        paddingVertical: '2%',
        paddingTop: '12%',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,

        backgroundColor: Colors.white
    },
    text: {
        fontFamily: Fonts.bold,
        fontSize: 20
    }
});