import React, { useState, useEffect } from "react";
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker";
import { WebView } from 'react-native-webview';

// Expo
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { File } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

// Local
import { Colors, Fonts } from "../Theme";
import FormInput2 from "../FormInput2";
import Button from "../Button";
import FormSelect from "../FormSelect";
import FormInput from "../FormInput";
import TaskConfirmSensitivePopUp from "./TaskConfirmSensitivePopUp";
import { API_URL } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";


export default function EditTaskPopUp({ visible, onClose, onSuccess, taskData }) {
    const { user } = useAuth();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [taskType, setTaskType] = useState('');
    const [date, setDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [maxSpots, setMaxSpots] = useState('');
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('');
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [coords, setCoords] = useState({
        lat: -29.7604,
        lng: -51.1474
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const typeList = ['Animais', 'Hortas', 'Limpeza'];

    // Get n fill fields w task data
    useEffect(() => {
        if (visible && taskData) {
            setTitle(taskData.titulo || '');
            setDescription(taskData.descricao || '');
            setTaskType(taskData.tipo || '');
            setAddress(taskData.endereco || '');
            setMaxSpots(taskData.vagas_max ? String(taskData.vagas_max) : '10');
            setExistingImages(Array.isArray(taskData.imagens) ? taskData.imagens : []);
            setNewImages([]);

            if (taskData.latitude && taskData.longitude) {
                setCoords({
                    lat: Number(taskData.latitude),
                    lng: Number(taskData.longitude)
                });
            }

            if (taskData.data) {
                const cleanDate = String(taskData.data).split('T')[0];
                const [year, month, day] = cleanDate.split('-');
                if (year && month && day) {
                    setDate(new Date(Number(year), Number(month) - 1, Number(day)));
                }
            }

            if (taskData.horario_inicio) {
                const [h, m] = String(taskData.horario_inicio).split(':');
                const d = new Date();
                d.setHours(Number(h) || 0, Number(m) || 0, 0);
                setStartTime(d);
            }

            if (taskData.horario_fim) {
                const [h, m] = String(taskData.horario_fim).split(':');
                const d = new Date();
                d.setHours(Number(h) || 0, Number(m) || 0, 0);
                setEndTime(d);
            }
        }
    }, [visible, taskData]);
    
    const openStreetMapHTML = `
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
                var map = L.map('map').setView([${coords.lat}, ${coords.lng}], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                var marker = L.marker([${coords.lat}, ${coords.lng}], {draggable: true}).addTo(map);
                function sendCoords(lat, lng) { window.ReactNativeWebView.postMessage(JSON.stringify({ lat: lat, lng: lng })); }
                marker.on('dragend', function(e) { sendCoords(marker.getLatLng().lat, marker.getLatLng().lng); });
                map.on('click', function(e) { marker.setLatLng(e.latlng); sendCoords(e.latlng.lat, e.latlng.lng); });
            </script>
        </body>
        </html>
    `;

    const handleWebMapMessage = (event) => {
        try {
            const parsed = JSON.parse(event.nativeEvent.data);
            if (parsed.lat && parsed.lng) setCoords({ lat: parsed.lat, lng: parsed.lng });
        } catch (err) {
            console.log(err);
        }
    };

    const handleConfirmLocation = async () => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&zoom=18&addressdetails=1`, {
                headers: { 'User-Agent': 'LimpaAí-App' }
            });
            const json = await res.json();
            setAddress(json.display_name || `Lat: ${coords.lat.toFixed(4)}, Long: ${coords.lng.toFixed(4)}`);
        } catch (error) {
            setAddress(`Lat: ${coords.lat.toFixed(4)}, Long: ${coords.lng.toFixed(4)}`);
        }
        setIsMapModalOpen(false);
    };

    const totalImagesCount = existingImages.length + newImages.length;

    const handlePickImages = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permissão negada", "Precisamos de permissão para acessar suas fotos.");
            return;
        }

        const remainingSlots = 10 - totalImagesCount;
        if (remainingSlots <= 0) {
            Alert.alert("Limite atingido", "Máximo de 10 imagens.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            selectionLimit: remainingSlots,
            quality: 0.8
        });

        if (!result.canceled && result.assets) {
            setNewImages(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 10 - existingImages.length));
        }
    };

    const appendImage = async (formData, uri, index) => {
        const filename = uri.split('/').pop() || `image_${index}.jpg`;
        if (Platform.OS === 'web') {
            const blob = await (await fetch(uri)).blob();
            formData.append('images', blob, filename);
        } else {
            formData.append('images', new File(uri));
        }
    };

    const handleRemoveExistingImage = (indexToRemove) => {
        setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
    };

    const handleRemoveNewImage = (indexToRemove) => {
        setNewImages(newImages.filter((_, index) => index !== indexToRemove));
    };

    const formatDateForMySQL = (dateObj) => {
        if (!dateObj || !(dateObj instanceof Date)) return '';
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatTimeForMySQL = (dateObj) => {
        if (!dateObj || !(dateObj instanceof Date)) return '';
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const handleWebDateChange = (e) => {
        const val = e.target.value;
        if (val) {
            const [year, month, day] = val.split('-');
            setDate(new Date(year, month - 1, day));
        } else {
            setDate(null);
        }
    };

    const handleWebStartTimeChange = (e) => {
        const val = e.target.value;
        if (val) {
            const [hours, minutes] = val.split(':');
            const timeObj = new Date();
            timeObj.setHours(parseInt(hours), parseInt(minutes), 0);
            setStartTime(timeObj);
        } else {
            setStartTime(null);
        }
    };

    const handleWebEndTimeChange = (e) => {
        const val = e.target.value;
        if (val) {
            const [hours, minutes] = val.split(':');
            const timeObj = new Date();
            timeObj.setHours(parseInt(hours), parseInt(minutes), 0);
            setEndTime(timeObj);
        } else {
            setEndTime(null);
        }
    };

    const formattedDate = date && date instanceof Date ? date.toLocaleDateString('pt-BR') : '';
    const webDateValue = date && date instanceof Date ? formatDateForMySQL(date) : '';

    const formattedStartTime = startTime && startTime instanceof Date
        ? startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : '';
    const webStartTimeValue = startTime && startTime instanceof Date
        ? `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}`
        : '';

    const formattedEndTime = endTime && endTime instanceof Date
        ? endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : '';
    const webEndTimeValue = endTime && endTime instanceof Date
        ? `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`
        : '';

    const executeUpdateTask = async () => {
        setIsConfirmSensitiveOpen(false);

        if (!title || !address || !date || !startTime || !endTime) {
            Alert.alert("Atenção", 'Preencha todos os campos obrigatórios, incluindo os horários');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();

            formData.append('id_ofertante', String(user?.id));
            formData.append('titulo', title);
            formData.append('descricao', description);
            formData.append('taskType', taskType || 'Outros');
            formData.append('endereco', address);
            formData.append('latitude', String(coords.lat));
            formData.append('longitude', String(coords.lng));
            formData.append('data', formatDateForMySQL(date));
            formData.append('horario_inicio', formatTimeForMySQL(startTime));
            formData.append('horario_fim', formatTimeForMySQL(endTime));
            formData.append('vagas_max', String(parseInt(maxSpots) || 10));
            formData.append('existingImages', JSON.stringify(existingImages));

            for (let i = 0; i < newImages.length; i++) {
                await appendImage(formData, newImages[i], i);
            }

            const response = await fetch(`${API_URL}/servicos/${taskData.idServico}`, {
                method: 'PUT',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert("Sucesso!", "Serviço atualizado com sucesso.");
                if (onSuccess) onSuccess();
            } else {
                Alert.alert("Erro", result.mensagem || "Não foi possível atualizar o serviço.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Erro de conexão", "Não foi possível contatar o servidor.");
        } finally {
            setLoading(false);
        }
    };

    const formatPreviewUri = (uri) => (uri && (uri.startsWith('http') || uri.startsWith('file://'))) ? uri : `${API_URL}${uri}`;

    // Sensitible edit ctrl
    const [isConfirmSensitiveOpen, setIsConfirmSensitiveOpen] = useState(false);
    const isSensitiveLocked = Boolean(taskData?.edicao_sensivel_usada);

    const hasSensitiveChanges = () => {
        if (!taskData) return false;
        const origDate = taskData.data ? String(taskData.data).split('T')[0] : '';
        const origStart = taskData.horario_inicio ? String(taskData.horario_inicio).slice(0, 5) : '';
        const origEnd = taskData.horario_fim ? String(taskData.horario_fim).slice(0, 5) : '';

        const curDate = formatDateForMySQL(date);
        const curStart = formatTimeForMySQL(startTime).slice(0, 5);
        const curEnd = formatTimeForMySQL(endTime).slice(0, 5);
    
        return (
            origDate !== curDate ||
            origStart !== curStart ||
            origEnd !== curEnd ||
            (taskData.endereco || '') !== address ||
            Number(taskData.vagas_max || 10) !== Number(parseInt(maxSpots) || 10)
        );
    };

    const handlePreSave = () => {
        if (!title || !address || !date || !startTime || !endTime) {
            Alert.alert('Atenção', 'Preencha todos os campos obrigatórios, incluindo os horários');
            return;
        }

        if (!isSensitiveLocked && hasSensitiveChanges()) {
            setIsConfirmSensitiveOpen(true);
            return;
        }

        executeUpdateTask();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TaskConfirmSensitivePopUp
                visible={isConfirmSensitiveOpen}
                onClose={() => setIsConfirmSensitiveOpen(false)}
                name={title.toUpperCase()}
                onConfirm={executeUpdateTask}
                loading={loading}
            />

            <Modal
                visible={isMapModalOpen}
                animationType="slide"
                onRequestClose={() => setIsMapModalOpen(false)}
            >
                <View style={styles.mapModalContainer}>
                    {Platform.OS !== 'web' ? (
                        <WebView
                            originWhitelist={['*']}
                            source={{ html: openStreetMapHTML }}
                            style={styles.fullMap}
                            onMessage={handleWebMapMessage}
                        />
                    ) : (
                        <View style={styles.webMapFallback}>
                            <MaterialCommunityIcons name="map-search" size={64} color={Colors.greenLA1} />
                            <Text style={styles.webMapText}>Seleção de mapa disponível no mobile</Text>
                        </View>
                    )}

                    <View style={styles.mapModalFooter}>
                        <Text style={styles.mapInstructionText}>Toque no mapa ou arraste o pino para definir a posição</Text>
                        <Button
                            text={'Confirmar localização'}
                            color={Colors.greenLA1}
                            onPress={handleConfirmLocation}
                        />
                    </View>
                </View>
            </Modal>

            <View style={styles.bgShadow}>
                <TouchableOpacity
                    style={styles.backdropTouch}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <Text style={styles.textTitle}>EDITAR SERVIÇO</Text>

                        <FormInput2
                            placeholder={'Insira o nome do serviço'}
                            characterLimit={true}
                            maxLength={21}
                            value={title}
                            setValue={setTitle}
                        />

                        <FormInput2
                            placeholder={'Descreva o serviço'}
                            characterLimit={true}
                            maxLength={88}
                            value={description}
                            setValue={setDescription}
                        />

                        <View style={styles.label}>
                            <MaterialIcons name="bookmark" size={24} />
                            <Text style={styles.labelText}>Tipo do Serviço</Text>
                        </View>

                        <FormSelect
                            placeholder={'Selecione o tipo do serviço'}
                            options={typeList}
                            selectedValue={taskType}
                            onSelect={setTaskType}
                        />

                        <View style={[styles.label, { opacity: isSensitiveLocked ? 0.5 : 1 }]}>
                            <MaterialCommunityIcons
                                name="calendar"
                                size={24}
                            />
                            <Text style={styles.labelText}>Data</Text>
                        </View>

                        {Platform.OS === 'web' ? (
                            <View style={{ width: '100%', marginBottom: 8, opacity: isSensitiveLocked ? 0.5 : 1 }}>
                                <input
                                    type="date"
                                    value={webDateValue}
                                    onChange={handleWebDateChange}
                                    style={styles.webInput}
                                    disabled={isSensitiveLocked}
                                    editable={!isSensitiveLocked}
                                />
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
                                    style={{ width: '100%' }}
                                    activeOpacity={0.7}
                                >
                                    <View pointerEvents="none" style={{ width: '100%', alignItems: 'center', opacity: isSensitiveLocked ? 0.5 : 1 }}>
                                        <FormInput
                                            placeholder={'Selecione a data'}
                                            value={formattedDate}
                                            setValue={() => {}}
                                            fullWidth={true}
                                            disabled={isSensitiveLocked}
                                            editable={!isSensitiveLocked}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date || new Date()}
                                        mode='date'
                                        display='default'
                                        onValueChange={(event, selectedDate) => {
                                            if (Platform.OS === 'android') setShowDatePicker(false);
                                            if (selectedDate) setDate(selectedDate);
                                        }}
                                        onDismiss={() => setShowDatePicker(false)}
                                    />
                                )}
                            </>
                        )}

                        <View style={[styles.label, { opacity: isSensitiveLocked ? 0.5 : 1 }]}>
                            <MaterialCommunityIcons name="clock-start" size={24} />
                            <Text style={styles.labelText}>Horário de Início</Text>
                        </View>

                        {Platform.OS === 'web' ? (
                            <View style={{ width: '100%', marginBottom: 8, opacity: isSensitiveLocked ? 0.5 : 1 }}>
                                <input
                                    type='time'
                                    value={webStartTimeValue}
                                    onChange={handleWebStartTimeChange}
                                    style={styles.webInput}
                                    disabled={isSensitiveLocked}
                                    editable={!isSensitiveLocked}
                                />
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity
                                    onPress={() => setShowStartPicker(true)}
                                    style={{ width: '100%' }}
                                    activeOpacity={0.7}
                                >
                                    <View pointerEvents="none" style={{ width: '100%', opacity: isSensitiveLocked ? 0.5 : 1 }}>
                                        <FormInput
                                            placeholder={'Selecione o horário de início'}
                                            value={formattedStartTime}
                                            setValue={() => {}}
                                            fullWidth={true}
                                            disabled={isSensitiveLocked}
                                            editable={!isSensitiveLocked}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {showStartPicker && (
                                    <DateTimePicker
                                        value={startTime || new Date()}
                                        mode="time"
                                        display="default"
                                        is24Hour={true}
                                        onValueChange={(event, selectedTime) => {
                                            if (Platform.OS === 'android') setShowStartPicker(false);
                                            if (selectedTime) setStartTime(selectedTime);
                                        }}
                                    />
                                )}
                            </>
                        )}

                        <View style={[styles.label, { opacity: isSensitiveLocked ? 0.5 : 1 }]}>
                            <MaterialCommunityIcons name="clock-end" size={24} />
                            <Text style={styles.labelText}>Horário de Término</Text>
                        </View>

                        {Platform.OS === 'web' ? (
                            <View style={{ width: '100%', marginBottom: 8, opacity: isSensitiveLocked ? 0.5 : 1 }}>
                                <input
                                    type='time'
                                    value={webEndTimeValue}
                                    onChange={handleWebEndTimeChange}
                                    style={styles.webInput}
                                    disabled={isSensitiveLocked}
                                    editable={!isSensitiveLocked}
                                />
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity
                                    onPress={() => setShowEndPicker(true)}
                                    style={{ width: '100%' }}
                                    activeOpacity={0.7}
                                >
                                    <View pointerEvents="none" style={{ width: '100%', opacity: isSensitiveLocked ? 0.5 : 1 }}>
                                        <FormInput
                                            placeholder={'Selecione o horário de término'}
                                            value={formattedEndTime}
                                            setValue={() => {}}
                                            fullWidth={true}
                                            disabled={isSensitiveLocked}
                                            editable={!isSensitiveLocked}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {showEndPicker && (
                                    <DateTimePicker
                                        value={endTime || new Date()}
                                        mode="time"
                                        display="default"
                                        is24Hour={true}
                                        onValueChange={(event, selectedTime) => {
                                            if (Platform.OS === 'android') setShowEndPicker(false);
                                            if (selectedTime) setEndTime(selectedTime);
                                        }}
                                    />
                                )}
                            </>
                        )}

                        <View style={styles.label}>
                            <MaterialIcons name="image" size={24} />
                            <Text style={styles.labelText}>Fotos do Local</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.imagePickerButton}
                            onPress={handlePickImages}
                        >
                            <MaterialIcons name="add-photo-alternate" size={32} color={Colors.b50} />
                            <Text style={styles.imagePickerText}>Anexar Imagens ({totalImagesCount}/10)</Text>
                        </TouchableOpacity>

                        {totalImagesCount > 0 && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
                                {existingImages.map((uri, index) => (
                                    <View key={`existing-${index}`} style={styles.thumbnailWrapper}>
                                        <Image source={{ uri: formatPreviewUri(uri) }} style={styles.thumbnail} />
                                        <TouchableOpacity
                                            style={styles.removeImgBtn}
                                            onPress={() => handleRemoveExistingImage(index)}
                                        >
                                            <MaterialIcons name="close" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                {newImages.map((uri, index) => (
                                    <View key={`new-${index}`} style={styles.thumbnailWrapper}>
                                        <Image source={{ uri }} style={styles.thumbnail} />
                                        <TouchableOpacity
                                            style={styles.removeImgBtn}
                                            onPress={() => handleRemoveNewImage(index)}
                                        >
                                            <MaterialIcons name="close" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        )}

                        <View style={[styles.label, { opacity: isSensitiveLocked ? 0.5 : 1 }]}>
                            <MaterialIcons name="location-pin" size={24} />
                            <Text style={styles.labelText}>Localização</Text>
                        </View>
                        <View style={[styles.label, { opacity: isSensitiveLocked ? 0.5 : 1 }]}>
                            <FormInput
                                placeholder={'Digite o endereço completo'}
                                value={address}
                                setValue={setAddress}
                                fullWidth={true}
                                disabled={isSensitiveLocked}
                                editable={!isSensitiveLocked}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.mapPreviewCard, { opacity: isSensitiveLocked ? 0.5 : 1 }]}
                            activeOpacity={0.8}
                            onPress={() => setIsMapModalOpen(true)}
                            disabled={isSensitiveLocked}
                            editable={!isSensitiveLocked}
                        >
                            <View style={styles.mapPlaceholderBg}>
                                <MaterialCommunityIcons name="map-marker-radius" size={48} color={Colors.b50} />
                                <Text style={styles.mapPlaceholderText}>Clique aqui para selecionar no mapa</Text>
                            </View>
                            <View style={styles.mapAdressBar}>
                                <MaterialIcons name="location-pin" size={20} color={Colors.black} />
                                <Text style={styles.mapAdressText} numberOfLines={2}>{address || 'Clique aqui para abrir o mapa...'}</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={[styles.label, { opacity: isSensitiveLocked ? 0.5 : 1 }]}>
                            <MaterialIcons name="group" size={24} />
                            <Text style={styles.labelText}>Participantes</Text>
                        </View>

                        <View style={[styles.label, { opacity: isSensitiveLocked ? 0.5 : 1 }]}>
                            <FormInput2
                                placeholder={'Insira o número máx. de participantes'}
                                keyboardType='numeric'
                                value={maxSpots}
                                setValue={setMaxSpots}
                                disabled={isSensitiveLocked}
                                editable={!isSensitiveLocked}
                            />
                        </View>

                        <View style={{ width: '100%', marginTop: 24, flexDirection: 'row', gap: 10 }}>
                            <Button
                                text="Cancelar"
                                color={Colors.black}
                                flex={true}
                                onPress={onClose}
                                disabled={loading}
                            />
                            <Button
                                text={loading ? 'Salvando...' : 'Salvar'}
                                color={Colors.greenLA1}
                                flex={true}
                                onPress={handlePreSave}
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
        
        overflow: 'hidden'
    },
    scrollContent: {
        padding: '5%',
        alignItems: 'center'
    },
    label: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        paddingTop: 8,
        paddingBottom: 2,

        width: '100%'
    },
    webInput: {
        backgroundColor: Colors.formInputBg,
        width: '100%',
        borderRadius: '12px',
        border: '1px solid #ccc',
        outline: 'none',

        padding: '12px 16px',
        
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#333',
        boxSizing: 'border-box'
    },
    imagePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginTop: 6,
        gap: 8,

        backgroundColor: Colors.formInputBg,
        width: '100%',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.b10,
        borderStyle: 'dashed'
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 8,

        width: '100%'
    },
    thumbnailWrapper: {
        position: 'relative',

        marginRight: 8,
        borderRadius: 8,
        overflow: 'hidden',

        width: 64,
        height: 64
    },
    thumbnail: {
        width: '100%',
        height: '100%'
    },
    removeImgBtn: {
        position: 'absolute',
        top: 2,
        right: 2,

        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 16,

        padding: 2
    },
    mapPreviewCard: {
        width: '100%',
        height: 160,
        borderRadius: 16,
        backgroundColor: Colors.formInputBg,

        overflow: 'hidden',
        marginTop: 8,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapPlaceholderBg: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        gap: 4
    },
    mapAdressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        backgroundColor: Colors.b10,

        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        gap: 6
    },
    mapModalContainer: {
        flex: 1,
        backgroundColor: Colors.background
    },
    fullMap: {
        flex: 1
    },
    webMapFallback: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center'
    },
    mapModalFooter: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        elevation: 5,

        backgroundColor: Colors.background,
        borderRadius: 16,

        padding: 16,
        alignItems: 'center',
        gap: 12
    },

    // Text
    textTitle: {
        fontFamily: Fonts.condensedBlack,
        fontSize: 24,

        marginBottom: 8
    },
    labelText: {
        fontFamily: Fonts.bold,
        fontSize: 16
    },
    imagePickerText: {
        fontFamily: Fonts.medium,
        fontSize: 14,
        color: Colors.b50
    },
    mapPlaceholderText: {
        fontFamily: Fonts.bold,
        fontSize: 13,
        color: Colors.b50
    },
    mapAdressText: {
        fontFamily: Fonts.regular,
        fontSize: 13,
        color: Colors.black,

        flex: 1
    },
    webMapText: {
        fontFamily: Fonts.bold,
        fontSize: 16,

        marginTop: 12
    },
    mapInstructionText: {
        fontFamily: Fonts.regular,
        fontSize: 14,

        textAlign: 'center'
    }
});