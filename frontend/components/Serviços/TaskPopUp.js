import React, { useState, useEffect } from "react";
import {
    StyleSheet, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback,
    FlatList, Dimensions, ScrollView, Alert, Platform, Linking
} from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";

// Expo
import { Image } from "expo-image";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

// Local
import { Colors, Fonts } from "../Theme";
import Button from "../Button";
import TaskCancelPopUp from "./TaskCancelPopUp";
import TaskRemoveUserPopUp from "./TaskRemoveUserPopUp";
import EditTaskPopUp from "./EditTaskPopUp";
import TaskForgivePopUp from "./TaskForgivePopUp";
import TaskMessageRequestPopUp from "./TaskMessageRequestPopUp";

import { API_URL } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function TaskPopUp({
    visible, onClose, lightColor, color, taskIcon, taskType, name, rawTitle, description,
    date, rawDate, startTime, endTime, address, latitude, longitude, image, personCount, personLimit,
    username, avatar, avatarPlaceholder, idServico, idOfertante, minhaSituacao, onRefresh, edicaoSensivelUsada
}){
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    // TaskCancelPopUp ctrl
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState(null);
    const [userToForgive, setUserToForgive] = useState(null);

    const handleRemoveParticipant = async (reason) => {
        if (!userToRemove) return;
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/participacoes/remover`, {
                method: 'PUT',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify({
                    id_participacao: userToRemove.id_participacao,
                    justificativa: reason
                })
            });

            if (response.ok) {
                Alert.alert("Sucesso", 'Participante removido e notificado.');
                setUserToRemove(null);
                loadParticipations();
                if (onRefresh) onRefresh();
            } else {
                const data = await response.json();
                Alert.alert('Erro', data.mensagem || 'Não foi possível remover.');
            }
        } catch (error) {
            Alert.alert('Erro de conexão', 'Não foi possível contatar o servidor.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgiveParticipant = async () => {
        if (!userToForgive) return;
        const targetName = userToForgive.nome_exibicao || userToForgive.nome;
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/participacoes/perdoar`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_participacao: userToForgive.id_participacao })
            });

            if (response.ok) {
                Alert.alert('Sucesso', `${targetName} poderá solicitar participação novamente.`);
                setUserToForgive(null);
                loadParticipations();
                if (onRefresh) onRefresh();
            } else {
                const data = await response.json();
                Alert.alert('Erro', data.mensagem || 'Não foi possível perdoar o usuário.');
            }
        } catch (error) {
            Alert.alert('Erro de conexão', 'Não foi possível contatar o servidor.');
        } finally {
            setLoading(false);
        }
    };

    const isOwner = String(user?.id) === String(idOfertante);
    const [participations, setParticipations] = useState([]);

    const loadParticipations = async () => {
        if (!visible || !isOwner || !idServico) return;
        try {
            const response = await fetch(`${API_URL}/servicos/${idServico}/participacoes`);
            const data = await response.json();
            if (response.ok) {
                setParticipations(data);
            }
        } catch (error) {
            console.log('Erro ao carregar solicitações:', error);
        }
    };

    useEffect(() => {
        loadParticipations();
    }, [visible, idServico]);

    const handleRespondRequest = async (id_participacao, nova_situacao) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/participacoes/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_participacao,
                    nova_situacao
                })
            });

            if (response.ok) {
                loadParticipations();
                if (onRefresh) onRefresh();
            } else {
                Alert.alert("Erro", "Não foi possível realizar a solicitação.");
            }
        } catch (error) {
            Alert.alert("Erro de conexão", "Não foi possível contatar o servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelParticipation = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/participacoes`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_usuario: user?.id,
                    id_servico: idServico
                })
            });

            if (response.ok) {
                Alert.alert("Sucesso", "Participação/Solicitação cancelada com sucesso.");
                if (onRefresh) onRefresh();
                setIsCancelModalOpen(false);
                onClose();
            } else {
                const data = await response.json();
                Alert.alert("Erro", data.mensagem || "Não foi possível cancelar.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Erro de conexão", "Não foi possível contatar o servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleRequestParticipation = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/participacoes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_usuario: user?.id,
                    id_servico: idServico
                })
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Sucesso!", "Sua solicitação foi enviada ao organizador.")
                if (onRefresh) onRefresh();
                onClose();
            } else {
                Alert.alert("Erro", data.mensagem || "Não foi possível enviar a solicitação")
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Erro de conexão", "Não foi possível contatar o servidor.");
        } finally {
            setLoading(false);
        }
    };
    
    const fullTime =  startTime && endTime && endTime !== startTime ? `${startTime}\n${endTime}` : startTime;

    // Image ctrl
    const [activeIndex, setActiveIndex] = useState(null);
    const [imageSize, setImageSize] = useState({});

    const imageList = Array.isArray(image) ? image : (image ? [image] : []);
    const formatUri = (uri) => (uri && (uri.startsWith('http') || uri.startsWith('file://'))) ?  uri : `${API_URL}${uri}`;
    const images = imageList.map(formatUri);

    // Map view ctrl
    const [isMapVisible, setIsMapVisible] = useState(false);

    const hasCoords = latitude !== null && latitude !== undefined && longitude !== null && longitude !== undefined;

    const viewMapHTML = hasCoords ? `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>body, html, #map { height: 100%; margin: 0; padding: 0; }</style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                var map = L.map('map').setView([${latitude}, ${longitude}], 16);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                L.marker([${latitude}, ${longitude}]).addTo(map)
                    .bindPopup("<b>${name}</b><br>${address}")
                    .openPopup();
            </script>
        </body>
        </html>
    ` : '';

    const openExternalMap = () => {
        if (!hasCoords) return;
        const url = Platform.select({
            ios: `maps:0,0?q=${name}@${latitude},${longitude}`,
            android: `geo:0,0?q=${latitude},${longitude}(${name})`,
            default: `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`
        });Linking.openURL(url);
    };

    // EditTaskPopUp ctrl
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // TaskMessageRequestPopUp ctrl
    const [isMsgReqModalOpen, setIsMsgReqModalOpen] = useState(false);

    const handleSendMessageRequest = async (initialMessage) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/conversas/solicitar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_servico: idServico,
                    id_solicitante: user?.id,
                    id_organizador: idOfertante,
                    mensagem_inicial: initialMessage
                })
            });

            const data = await response.json();

            if (response.ok) {
                setIsMsgReqModalOpen(false);
                onClose();
                navigation.navigate('Chat', {
                    idConversa: data.id_conversa,
                    otherUserName: username,
                    otherUserAvatar: avatar,
                    taskType: taskType ?  taskType.toLowerCase() : '',
                    status: data.status,
                    isOwner: false
                });
            } else {
                Alert.alert('Atenção', data.mensagem || 'Não foi possível iniciar a conversa.');
            }
        } catch (error) {
            Alert.alert('Erro de conexão', 'Não foi possível contatar o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TaskCancelPopUp
                visible={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                name={name}
                onConfirm={handleCancelParticipation}
            />

            <TaskRemoveUserPopUp
                visible={!!userToRemove}
                onClose={() => setUserToRemove(null)}
                userName={userToRemove ? (userToRemove.nome_exibicao || userToRemove.nome) : ''}
                onConfirm={handleRemoveParticipant}
                loading={loading}
            />

            <TaskForgivePopUp
                visible={!!userToForgive}
                onClose={() => setUserToForgive(null)}
                userName={userToForgive ? (userToForgive.nome_exibicao || userToForgive.nome) : ''}
                onConfirm={handleForgiveParticipant}
                loading={loading}
            />

            <EditTaskPopUp
                visible={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                taskData={{
                    idServico,
                    titulo: rawTitle || name,
                    descricao: description,
                    tipo: taskType,
                    endereco: address,
                    latitude,
                    longitude,
                    data: rawDate,
                    horario_inicio: startTime,
                    horario_fim: endTime,
                    vagas_max: personLimit,
                    imagens: imageList,
                    edicao_sensivel_usada: Boolean(edicaoSensivelUsada)
                }}
                onSuccess={() => {
                    setIsEditModalOpen(false);
                    if (onRefresh) onRefresh();
                    onClose();
                }}
            />

            <TaskMessageRequestPopUp
                visible={isMsgReqModalOpen}
                onClose={() => setIsMsgReqModalOpen(false)}
                ownerName={username}
                taskName={name}
                onConfirm={handleSendMessageRequest}
                loading={loading}
            />
            
            <View style={styles.bgShadow}>
                <TouchableOpacity
                    style={styles.backdropTouch}
                    activeOpacity={1}
                    onPress={onClose}
                />
                    <View style={styles.container}>
                        <ScrollView
                            style={styles.scrollContainer}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.tag}>
                                <MaterialCommunityIcons
                                    name={taskIcon}
                                    size={96}
                                />

                                <Text style={styles.taskName}>{name}</Text>
                            </View>

                            <Text style={styles.subText}>
                                {description}
                            </Text>

                            <View style={[styles.info, { marginTop: '4%' }]}>
                                <View style={styles.tag}>
                                    <MaterialCommunityIcons
                                        name='calendar'
                                        size={24}
                                        color={color}
                                    />

                                    <Text style={[styles.tagText, { color: color }]}>Data:</Text>
                                </View>

                                <Text style={styles.subText}>{date}</Text>
                            </View>

                            <View style={styles.info}>
                                <View style={styles.tag}>
                                    <MaterialCommunityIcons
                                        name='clock'
                                        size={24}
                                        color={color}
                                    />

                                    <Text style={[styles.tagText, { color: color }]}>Horário:</Text>
                                </View>

                                <Text style={styles.subText}>{fullTime}</Text>
                            </View>

                            <View style={styles.info}>
                                <View style={styles.tag}>
                                    <MaterialIcons
                                        name='location-pin'
                                        size={24}
                                        color={color}
                                    />

                                    <Text style={[styles.tagText, { color: color }]}>Localização:</Text>
                                </View>

                                <Text style={styles.subText}>{address}</Text>

                                {hasCoords && (
                                <TouchableOpacity
                                        style={[styles.mapButton, { borderColor: color }]}
                                        onPress={() => setIsMapVisible(true)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.mapButtonText, { color: color }]}>Visualizar no mapa</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {images.length > 0 && (
                                <View style={{ width: '100%', marginBottom: '4%' }}>
                                    {images.length === 1 && (
                                        <TouchableOpacity
                                            style={{ width: '100%', height: 200, borderRadius: 16, overflow: 'hidden' }}
                                            onPress={() => setActiveIndex(0)}
                                        >
                                            <Image
                                                source={{ uri: images[0] }}
                                                placeholder={require('../../assets/brokenImage200.svg')}
                                                style={{ width: '100%', height: '100%' }}
                                                contentFit='cover'
                                            />
                                        </TouchableOpacity>
                                    )}

                                    {images.length === 2 && (
                                        <View style={{ flexDirection: 'row', width: '100%', height: 160, borderRadius: 16, overflow: 'hidden' }}>
                                            {images.map((uri, idx) => (
                                                <TouchableOpacity
                                                    key={idx}
                                                    style={{ flex: 1, height: '100%' }}
                                                    onPress={() => setActiveIndex(idx)}
                                                >
                                                    <Image
                                                        source={{ uri }}
                                                        placeholder={require('../../assets/brokenImage200.svg')}
                                                        style={{ width: '100%', height: '100%' }}
                                                        contentFit='cover'
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}

                                    {images.length === 3 && (
                                        <View style={[styles.imageView, { borderRadius: 16, overflow: 'hidden' }]}>
                                            <TouchableOpacity
                                                style={{ width: '66.66%', aspectRatio: 1 }}
                                                onPress={() => setActiveIndex(0)}
                                            >
                                                <Image
                                                    source={{ uri: images[0] }}
                                                    placeholder={require('../../assets/brokenImage200.svg')}
                                                    style={{ width: '100%', height: '100%' }}
                                                    contentFit='cover'
                                                />
                                            </TouchableOpacity>

                                            <View style={{ width: '33.33%' }}>
                                                <TouchableOpacity
                                                    style={{ width: '100%', aspectRatio: 1 }}
                                                    onPress={() => setActiveIndex(1)}
                                                >
                                                    <Image
                                                        source={{ uri: images[1] }}
                                                        placeholder={require('../../assets/brokenImage400.svg')}
                                                        style={{ width: '100%', height: '100%' }}
                                                        contentFit='cover'
                                                    />
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={{ width: '100%', aspectRatio: 1 }}
                                                    onPress={() => setActiveIndex(2)}
                                                >
                                                    <Image
                                                        source={{ uri: images[2] }}
                                                        placeholder={require('../../assets/brokenImage400.svg')}
                                                        style={{ width: '100%', height: '100%' }}
                                                        contentFit='cover'
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}

                                    {images.length >= 4 && (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', borderRadius: 16, overflow: 'hidden' }}>
                                            {images.slice(0, 4).map((uri, idx) => (
                                                <TouchableOpacity
                                                    key={idx}
                                                    style={{ width: '48.5%', aspectRatio: 1, position: 'relative' }}
                                                    onPress={() => setActiveIndex(idx)}
                                                >
                                                    <Image
                                                        source={{ uri }}
                                                        placeholder={require('../../assets/brokenImage200.svg')}
                                                        style={{ width: '100%', height: '100%' }}
                                                        contentFit='cover'
                                                    />
                                                    {idx === 3 && images.length > 4 && (
                                                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>
                                                            <Text style={{ color: '#fff', fontFamily: Fonts.bold, fontSize: 18 }}>+{images.length - 4}</Text>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}

                            <View style={[styles.info, { marginTop: '4%' }]}>
                                <View style={styles.tag}>
                                    <MaterialIcons
                                        name='group'
                                        size={24}
                                        color={color}
                                    />

                                    <Text style={[styles.tagText, { color: color }]}>Participantes:</Text>
                                </View>
                                    
                                <Text style={styles.subText}>{personCount}</Text>
                            </View>

                            <View style={styles.info}>
                                <View style={styles.tag}>
                                    <Image
                                    source={avatar ? { uri: formatUri(avatar) } : null}
                                        placeholder={avatarPlaceholder}
                                        style={[styles.avatar, { backgroundColor: lightColor }]}
                                        contentFit="cover"
                                        placeholderContentFit="cover"
                                    />

                                    <Text style={[styles.tagText, { color: color, marginLeft: '1%' }]}>{username}</Text>
                                </View>
                            </View>
                            

                            {isOwner ? (
                                <View style={{ width: '100%', marginTop: '4%' }}>
                                    {participations.filter(p => p.situacao === 'pendente' || p.situacao === 'aprovado').length > 0 && (
                                        <View style={styles.requestsBox}>
                                            <Text style={[styles.tagText, { color: color, marginBottom: 8 }]}>
                                                Gerenciar Participantes:
                                            </Text>

                                            {participations
                                                .filter(p => p.situacao === 'pendente' || p.situacao === 'aprovado')
                                                .map((item) => (
                                                    <View key={item.id_participacao} style={styles.requestRow}>
                                                        <Image
                                                            source={item.foto_perfil ? { uri: formatUri(item.foto_perfil) } : null}
                                                            placeholder={avatarPlaceholder}
                                                            style={[styles.requestAvatar, { backgroundColor: lightColor }]}
                                                            contentFit="cover"
                                                            placeholderContentFit="cover"
                                                        />

                                                        <View style={{ flex: 1 }}>
                                                            <Text style={styles.requestName}>
                                                                {item.nome_exibicao || item.nome}
                                                            </Text>
                                                            <Text style={styles.requestStatus}>
                                                                {item.situacao === 'pendente' ? 'Aguardando aprovação' : 'Confirmado'}
                                                            </Text>
                                                        </View>

                                                        {item.situacao === 'pendente' ? (
                                                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                                                <TouchableOpacity
                                                                    style={[styles.actionBadge, { backgroundColor: Colors.greenLA1 }]}
                                                                    onPress={() => handleRespondRequest(item.id_participacao, 'aprovado')}
                                                                    disabled={loading}
                                                                >
                                                                    <MaterialIcons name="check" size={20} color="#fff" />
                                                                </TouchableOpacity>

                                                                <TouchableOpacity
                                                                    style={[styles.actionBadge, { backgroundColor: Colors.plastico }]}
                                                                    onPress={() => handleRespondRequest(item.id_participacao, 'recusado')}
                                                                    disabled={loading}
                                                                >
                                                                    <MaterialIcons name="close" size={20} color="#fff" />
                                                                </TouchableOpacity>
                                                            </View>
                                                        ) : (
                                                            <TouchableOpacity
                                                                style={[styles.actionBadge, { backgroundColor: Colors.plastico || '#E53935' }]}
                                                                onPress={() => setUserToRemove(item)}
                                                                disabled={loading}
                                                            >
                                                                <MaterialIcons name="person-remove" size={20} color="#fff" />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                ))}
                                        </View>
                                    )}

                                    {participations.filter(p => p.situacao === 'recusado' || p.situacao === 'removido').length > 0 && (
                                        <View style={[styles.requestsBox, { marginTop: 12 }]}>
                                            <Text style={[styles.tagText, { color: Colors.b50, marginBottom: 8 }]}>
                                                Recusados / Removidos:
                                            </Text>

                                            {participations
                                                .filter(p => p.situacao === 'recusado' || p.situacao === 'removido')
                                                .map((item) => (
                                                    <View key={item.id_participacao} style={styles.requestRow}>
                                                        <Image
                                                            source={item.foto_perfil ? { uri: formatUri(item.foto_perfil) } : null}
                                                            placeholder={avatarPlaceholder}
                                                            style={[styles.requestAvatar, { backgroundColor: lightColor }]}
                                                            contentFit="cover"
                                                            placeholderContentFit="cover"
                                                        />

                                                        <View style={{ flex: 1 }}>
                                                            <Text style={styles.requestName}>
                                                                {item.nome_exibicao || item.nome}
                                                            </Text>
                                                            <Text style={styles.requestStatus}>
                                                                {item.situacao === 'recusado' ? 'Recusado' : 'Removido'}
                                                            </Text>
                                                        </View>
                                                        
                                                        <TouchableOpacity
                                                            style={[styles.actionBadge, { backgroundColor: Colors.greenLA1 }]}
                                                            onPress={() => setUserToForgive(item)}
                                                            disabled={loading}
                                                        >
                                                            <MaterialCommunityIcons
                                                                name="account-reactivate"
                                                                size={20}
                                                                color={Colors.white}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                        </View>
                                    )}

                                    <View style={[styles.tag, { marginTop: 12 }]}>
                                        <Button
                                            text={loading ? 'Carregando...' : 'Editar Serviço'}
                                            color={color}
                                            flex={true}
                                            onPress={() => setIsEditModalOpen(true)}
                                            disabled={loading}
                                        />
                                    </View>
                                </View>
                            ) : (
                                <>
                                    {minhaSituacao === 'aprovado' && (
                                        <View style={[styles.tag, { marginTop: '4%' }]}>
                                            <Button
                                                text={loading ? 'Carregando' : 'Cancelar Participação'}
                                                color={color}
                                                flex={true}
                                                onPress={() => setIsCancelModalOpen(true)}
                                                disabled={loading}
                                            />
                                            <TouchableOpacity onPress={() => setIsMsgReqModalOpen(true)}>
                                                <MaterialCommunityIcons name="message-text" size={40} color={color} />
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {minhaSituacao === 'pendente' && (
                                        <View style={[styles.tag, { marginTop: '4%' }]}>
                                            <Button
                                                text={loading ? "Carregando..." : 'Solicitação Pendente (Cancelar)'}
                                                color={Colors.plastico}
                                                flex={true}
                                                onPress={() => setIsCancelModalOpen(true)}
                                                disabled={loading}
                                            />
                                            <TouchableOpacity onPress={() => setIsMsgReqModalOpen(true)}>
                                                <MaterialCommunityIcons name="message-text" size={40} color={color} />
                                            </TouchableOpacity>
                                        </View>
                                    )}

                                    {(minhaSituacao === 'cancelado' || minhaSituacao === 'removido' || minhaSituacao === 'recusado') && (
                                        <View style={styles.blockedStatusBox}>
                                            <MaterialIcons
                                                name="block"
                                                size={24}
                                                color={minhaSituacao === 'cancelado' ? Colors.b50 : (Colors.b50)}
                                            />
                                            <Text
                                                style={[
                                                    styles.blockedStatusText,
                                                    { color: minhaSituacao === 'cancelado' ? Colors.b50 : (Colors.b50) }
                                                ]}
                                            >
                                                {minhaSituacao === 'cancelado'
                                                    ? 'Você cancelou sua participação neste serviço'
                                                    : minhaSituacao === 'removido'
                                                    ? 'Você foi removido pelo organizador'
                                                    : 'Sua solicitação foi recusada pelo organizador'}
                                            </Text>
                                        </View>
                                    )}

                                    {!minhaSituacao && (
                                        <View style={[styles.tag, { marginTop: '4%' }]}>
                                            <Button
                                                text={loading ? "Carregando..." : 'Pedir para Participar'}
                                                color={color}
                                                flex={true}
                                                onPress={handleRequestParticipation}
                                                disabled={loading}
                                            />
                                            <TouchableOpacity onPress={() => setIsMsgReqModalOpen(true)}>
                                                <MaterialCommunityIcons name="message-text" size={40} color={color} />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            )}
                        </ScrollView>
                    </View>
            </View>
        </Modal>

        <Modal
            visible={activeIndex !== null}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setActiveIndex(null)}
        >
            <View style={styles.fullscreenContainer}>
                <FlatList
                    style={{ flex: 1 }}
                    data={images}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={activeIndex}
                    getItemLayout={(data, index) => ({
                        length: screenWidth,
                        offset: screenWidth * index,
                        index
                    })}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const dims = imageSize[index];
                        const boxStyle = dims
                            ? { width: dims.width, height: dims.height }
                            : { width: screenWidth, height: screenHeight };

                        return(
                            <View style={styles.fullscreenBg}>
                                <TouchableOpacity
                                    style={styles.fullscreenClickableArea}
                                    activeOpacity={1}
                                    onPress={() => setActiveIndex(null)}
                                >
                                    <TouchableWithoutFeedback onPress={() => {}}>
                                        <View style={boxStyle}>
                                            <Image
                                                source={{ uri: item }}
                                                style={{ width: '100%', height: '100%' }}
                                                contentFit="contain"
                                                onLoad={(event) => {
                                                    const { width, height } = event.source;
                                                    if (!dims) {
                                                        const scale = Math.min(screenWidth / width, screenHeight / height);
                                                        setImageSize(prev => ({
                                                            ...prev,
                                                            [index]: { width: width * scale, height: height * scale }
                                                        }));
                                                    }
                                                }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            </View>
        </Modal>

        <Modal
            visible={isMapVisible}
            animationType="slide"
            onRequestClose={() => setIsMapVisible(false)}
        >
            <View style={{ flex: 1, backgroundColor: Colors.background }}>
                {Platform.OS !== 'web'? (
                    <WebView
                        originWhitelist={['*']}
                        source={{ html: viewMapHTML }}
                        style={{ flex: 1 }}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Mapa interativo disponível no mobile.</Text>
                    </View>
                )}

                <View style={styles.mapModalFooter}>
                    <Text style={styles.subText} numberOfLines={2}>{address}</Text>
                    <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                        <Button
                            text="Abrir no GPS"
                            color={color}
                            flex={true}
                            onPress={openExternalMap}
                        />
                        <Button
                            text="Fechar"
                            color={Colors.b50}
                            flex={true}
                            onPress={() => setIsMapVisible(false)}
                        />
                    </View>
                </View>
            </View>
        </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    // View
    bgShadow: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: Colors.b25
    },
    backdropTouch: {
        position: 'absolute',

        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    container: {
        backgroundColor: Colors.background,
        borderRadius: 24,

        width: '85%',
        maxHeight: '85%',

        overflow: 'hidden'
    },
    scrollContainer: {
        width: '100%'
    },
    scrollContent: {
        padding: '5%',
        alignItems: 'center'
    },
    tag: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        gap: '1%'
    },
    info: {
        width: '100%',
        paddingBottom: '4%'
    },
    imageView: {
        flexDirection: 'row',
        width: '100%',

        borderRadius: 24,
        overflow: 'hidden'
    },
    fullscreenBg: {
        width: screenWidth,
        flex: 1
    },
    fullscreenContainer: {
        flex: 1,
        backgroundColor: Colors.b75
    },
    fullscreenClickableArea: {
        flex: 1,
        width: '100%',

        justifyContent: 'center',
        alignItems: 'center'
    },

    // Map
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: '2%',
        paddingVertical: '2%',
        paddingHorizontal: '4%',

        marginTop: 8,
        alignSelf: 'flex-start',

        borderRadius: 16,
        borderWidth: 1.5
    },
    mapModalFooter: {
        elevation: 5,
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,

        backgroundColor: Colors.background,
        borderRadius: 16,

        padding: 16,
        gap: 12
    },

    // Request
    requestsBox: {
        width: '100%',
        backgroundColor: Colors.formInputBg,
        borderRadius: 24,

        paddingVertical: 12,
        paddingHorizontal: 16
    },
    requestRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    requestName: {
        fontFamily: Fonts.bold,
        fontSize: 15,
        color: Colors.black
    },
    requestStatus: {
        fontFamily: Fonts.regular,
        fontSize: 12,
        color: Colors.b50
    },
    actionBadge: {
        width: 34,
        height: 34,
        borderRadius: 100,

        alignItems: 'center',
        justifyContent: 'center'
    },
    blockedStatusBox: {
        width: '100%',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: Colors.b50,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: '4%',
        padding: 8
    },

    // Text
    taskName: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 24,
        
        flex: 1
    },
    subText: {
        fontFamily: Fonts.regular,
        fontSize: 14,

        width: '100%',
        textAlign: 'left'
    },
    tagText: {
        fontFamily: Fonts.bold,
        fontSize: 16
    },
    mapButtonText: {
        fontFamily: Fonts.bold,
        fontSize: 14
    },

    // Img
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 100,
    },
    requestAvatar: {
        width: 36,
        height: 36,
        borderRadius: 100,

        marginRight: 10
    },
    blockedStatusText: {
        fontFamily: Fonts.bold,
        fontSize: 14,

        textAlign: 'center',
        flexShrink: 1
    }
})