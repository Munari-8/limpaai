import React, { useState } from "react";
import { StyleSheet, View, Modal, Text, TouchableOpacity, Alert, ScrollView, Platform } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';

import { Colors, Fonts } from "../Theme";
import FormInput2 from "../FormInput2";
import Button from '../Button';
import FormSelect from '../FormSelect';
import { useAuth } from "../../contexts/AuthContext";
import { API_URL } from "../../services/api";

const sendForm = (url, formData) =>
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.onload = () => {
            let data = null;
            try { data = JSON.parse(xhr.responseText); } catch {}
            resolve({ ok: xhr.status >= 200 && xhr.status < 300, status: xhr.status, data });
        };
        xhr.onerror = () => reject(new Error('Network request failed'));
        xhr.ontimeout = () => reject(new Error('Timeout'));
        xhr.timeout = 30000;
        xhr.send(formData); // não setar Content-Type manualmente
    });

export default function AddWastePopUp({ visible, onClose }) {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [wasteType, setWasteType] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const typeList = ['Vidro', 'Metal', 'Plástico', 'Papel', 'Orgânico', 'Não Reciclável'];

    const pickImages = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permissão negada", "Precisamos de permissão para acessar sua galeria.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            selectionLimit: 3 - images.length,
            quality: 0.8,
        });

        if (!result.canceled && result.assets) {
            const selected = result.assets.map(asset => asset.uri);
            setImages(prev => [...prev, ...selected].slice(0, 3));
        }
    };

    const removeImage = (indexToRemove) => {
        setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSendSuggestion = async () => {
        if (!name.trim() || !wasteType) {
            Alert.alert('Atenção', 'Preencha o nome e selecione o tipo do resíduo.');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('id_usuario', String(user?.id));
            formData.append('nome', name);
            formData.append('tipo', wasteType.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
            formData.append('observacoes', notes);

            // Adiciona as imagens apenas se houver selecionadas
            images.forEach((uri, index) => {
                const filename = uri.split('/').pop() || `image_${index}.jpg`;
                const ext = (/\.(\w+)$/.exec(filename)?.[1] || 'jpg').toLowerCase();
                const mime = ext === 'jpg' ? 'jpeg' : ext;

                formData.append('images', {
                    uri,                       
                    name: filename,
                    type: `image/${mime}`,
                });
            });

            const { ok, data } = await sendForm(`${API_URL}/sugestoes-residuos`, formData);

            if (ok) {
                Alert.alert('Sucesso', 'Sugestão enviada com sucesso!');
                setName('');
                setNotes('');
                setWasteType('');
                setImages([]);
                onClose();
            } else {
                Alert.alert('Erro', data?.mensagem || 'Não foi possível enviar a sugestão.');
            }
        } catch (error) {
            console.log('Erro ao enviar sugestão:', error);
            Alert.alert('Erro', 'Falha na conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <View style={styles.bgShadow}>
                <TouchableOpacity style={styles.backdropTouch} activeOpacity={1} onPress={onClose} />
                <View style={styles.container}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
                    >
                        <Text style={styles.textTitle}>SUGESTÃO DE RESÍDUO</Text>
                        
                        <FormInput2
                            placeholder={'Insira o nome do resíduo'}
                            characterLimit={true}
                            maxLength={32}
                            value={name}
                            setValue={setName}
                        />
                        
                        <View style={styles.label}>
                            <MaterialIcons name='bookmark' size={24} />
                            <Text style={styles.textLabel}>Tipo do Resíduo</Text>
                        </View>
                        <FormSelect
                            placeholder={'Selecione o tipo do resíduo'}
                            options={typeList}
                            selectedValue={wasteType}
                            onSelect={setWasteType}
                        />
                        
                        <View style={styles.label}>
                            <MaterialIcons name='edit' size={24} />
                            <Text style={styles.textLabel}>Observações</Text>
                        </View>
                        <FormInput2
                            placeholder={'Insira observações sobre o resíduo'}
                            characterLimit={true}
                            maxLength={80}
                            value={notes} 
                            setValue={setNotes}
                        />

                        <View style={styles.label}>
                            <MaterialIcons name='image' size={24} />
                            <Text style={styles.textLabel}>Anexar imagens ({images.length}/3)</Text>
                        </View>

                        <ScrollView 
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ width: '100%', marginTop: 8 }}
                        >
                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                {images.map((uri, index) => (
                                    <View key={index} style={styles.imagePreviewBox}>
                                        <Image
                                            source={{ uri }}
                                            style={{ width: '100%', height: '100%', borderRadius: 12 }}
                                            contentFit="cover"
                                        />
                                        <TouchableOpacity style={styles.removeImgBtn} onPress={() => removeImage(index)}>
                                            <MaterialIcons name="close" size={16} color={Colors.white} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {images.length < 3 && (
                                    <TouchableOpacity style={styles.addImageBtn} onPress={pickImages}>
                                        <MaterialIcons name="add-a-photo" size={28} color={Colors.b50} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </ScrollView>

                        <View style={{ width: '100%', marginTop: 24, flexDirection: 'row' }}>
                            <Button
                                text={loading ? 'Enviando...' : 'Enviar Sugestão'}
                                flex={true}
                                onPress={handleSendSuggestion}
                                disabled={loading}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    bgShadow: {
        flex: 1,
        backgroundColor: Colors.b25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backdropTouch: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0
    },
    container: {
        backgroundColor: Colors.background,
        borderRadius: 24,
        width: '85%',
        maxHeight: '85%',
        padding: '5%',
        overflow: 'hidden'
    },
    label: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginTop: 12,
        width: '100%'
    },
    textTitle: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 24,
        marginBottom: 8,
        textAlign: 'center'
    },
    textLabel: {
        fontFamily: Fonts.bold,
        fontSize: 16
    },
    imagePreviewBox: {
        width: 75,
        height: 75,
        borderRadius: 12,
        backgroundColor: Colors.formInputBg,
        position: 'relative'
    },
    removeImgBtn: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: Colors.b50,
        borderRadius: 24,
        padding: 2
    },
    addImageBtn: {
        width: 75,
        height: 75,
        borderRadius: 16,
        backgroundColor: Colors.formInputBg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.b10,
        borderStyle: 'dashed'
    }
});