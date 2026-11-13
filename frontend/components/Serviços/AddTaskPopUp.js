import React, { useState } from "react";
import { Alert, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import { WebView } from 'react-native-webview';

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { File } from 'expo-file-system'

// Local
import { Colors, Fonts } from "../Theme";
import FormInput2 from "../FormInput2";
import Button from "../Button";
import { API_URL } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import FormSelect from "../FormSelect";
import FormInput from "../FormInput";

export default function AddTaskPopUp({ visible, onClose, onSuccess }) {
    const { user } = useAuth();

    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [taskType, setTaskType] = useState('');
    const [data, setData] = useState('');
    const [horarioInicio, setHorarioInicio] = useState('');
    const [horarioFim, setHorarioFim] = useState('');
    const [vagasMax, setVagasMax] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [endereco, setEndereco] = useState('');
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [coords, setCoords] = useState({
        lat: -29.7604,
        lng: -51.1474
    });

    // Pickers control
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const typeList = [
        'Animais',
        'Hortas',
        'Limpeza'
    ];

    // Location picker stuff
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
                headers: {
                    'User-Agent': 'LimpaAI-App'
                }
            });
            const json = await res.json();
            
            setEndereco(json.display_name || `Lat: ${coords.lat.toFixed(4)}, Long: ${coords.lng.toFixed(4)}`);
        } catch (error) {
            setEndereco(`Lat: ${coords.lat.toFixed(4)}, Long: ${coords.lng.toFixed(4)}`);
        }
        setIsMapModalOpen(false);
    };

    // Image picker stuff
    const handlePickImages = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("Permissão negada", "Precisamos de permissão para acessar suas fotos.");
            return;
        }

        const remainingSlots = 10 - images.length;
        if (remainingSlots <= 0) {
            Alert.alert("Limite atingido", "Máximo de 10 imagens.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            selectionLimit: remainingSlots,
            quality: 0.8
        });

        if (!result.canceled && result.assets) {
            setImages(prev => [...prev, ...result.assets.map(a => a.uri)].slice(0, 10));
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

    const handleRemoveImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    // Date and time formatters
    const formatDateForMySQL = (dateObj) => {
        if (!dateObj || !(dateObj instanceof Date)) return '';
        const year = dateObj.getFullYear();
        let month = '' + (dateObj.getMonth() + 1);
        let day = '' + dateObj.getDate();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${year}-${month}-${day}`;
    };

    const formatTimeForMySQL = (dateObj) => {
        if (!dateObj || !(dateObj instanceof Date)) return '';
        let hours = '' + dateObj.getHours();
        let minutes = '' + dateObj.getMinutes();
        let seconds = '' + dateObj.getSeconds();

        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;
        if (seconds.length < 2) seconds = '0' + seconds;

        return `${hours}:${minutes}:${seconds}`;
    };

    const handleWebDateChange = (e) => {
        const val = e.target.value;
        if (val) {
            const [year, month, day] = val.split('-');
            setData(new Date(year, month - 1, day));
        } else {
            setData(null);
        }
    };

    const handleWebStartTimeChange = (e) => {
        const val = e.target.value;
        if (val) {
            const [hours, minutes] = val.split(':');
            const timeObj = new Date();
            timeObj.setHours(parseInt(hours), parseInt(minutes), 0);
            setHorarioInicio(timeObj);
        } else {
            setHorarioInicio(null);
        }
    };

    const handleWebEndTimeChange = (e) => {
        const val = e.target.value;
        if (val) {
            const [hours, minutes] = val.split(':');
            const timeObj = new Date();
            timeObj.setHours(parseInt(hours), parseInt(minutes), 0);
            setHorarioFim(timeObj);
        } else {
            setHorarioFim(null);
        }
    };

    const formattedDate = data && data instanceof Date ? data.toLocaleDateString('pt-BR') : '';
    const webDateValue = data && data instanceof Date ? formatDateForMySQL(data) : '';

    const formattedStartTime = horarioInicio && horarioInicio instanceof Date
        ? horarioInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : '';
    const webStartTimeValue = horarioInicio && horarioInicio instanceof Date
        ? `${String(horarioInicio.getHours()).padStart(2, '0')}:${String(horarioInicio.getMinutes()).padStart(2, '0')}`
        : '';

    const formattedEndTime = horarioFim && horarioFim instanceof Date
        ? horarioFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : '';
    const webEndTimeValue = horarioFim && horarioFim instanceof Date
        ? `${String(horarioFim.getHours()).padStart(2, '0')}:${String(horarioFim.getMinutes()).padStart(2, '0')}`
        : '';

    const handleCreateService = async () => {
        if (!titulo || !endereco || !data || !horarioInicio || !horarioFim) {
            Alert.alert("Atenção", "Preencha todos os campos obrigatórios, incluindo os horários.");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('id_ofertante', String(user?.id));
            formData.append('titulo', titulo);
            formData.append('descricao', descricao);
            formData.append('taskType', taskType || 'Outros');
            formData.append('endereco', endereco);
            formData.append('data', formatDateForMySQL(data));
            formData.append('horario_inicio', formatTimeForMySQL(horarioInicio));
            formData.append('horario_fim', formatTimeForMySQL(horarioFim));
            formData.append('vagas_max', String(parseInt(vagasMax) || 10));

            for (let i = 0; i < images.length; i++) {
                await appendImage(formData, images[i], i);
            }

            const response = await fetch(`${API_URL}/servicos`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert("Sucesso!", "Serviço criado com sucesso.");
                setTitulo('');
                setDescricao('');
                setTaskType('');
                setEndereco('');
                setData('');
                setHorarioInicio('');
                setHorarioFim('');
                setVagasMax('');
                setImages([]);
                if (onSuccess) onSuccess();
            } else {
                Alert.alert("Erro", result.mensagem || "Não foi possível criar o serviço.");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Erro de conexão", "Não foi possível contatar o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Map Modal */}
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
                        <Text style={styles.textTitle}>CRIAR SERVIÇO</Text>

                        <FormInput2
                            placeholder={'Insira o nome do serviço'}
                            maxLength={21}
                            value={titulo}
                            setValue={setTitulo}
                        />

                        <FormInput2
                            placeholder={'Descreva o serviço'}
                            maxLength={88}
                            value={descricao}
                            setValue={setDescricao}
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

                        {/* DATA */}
                        <View style={styles.label}>
                            <MaterialCommunityIcons name="calendar" size={24} />
                            <Text style={styles.labelText}>Data</Text>
                        </View>

                        {Platform.OS === 'web' ? (
                            <View style={{ width: '100%', marginBottom: 8 }}>
                                <input
                                    type="date"
                                    value={webDateValue}
                                    onChange={handleWebDateChange}
                                    style={styles.webInput}
                                />
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
                                    style={{ width: '100%' }}
                                    activeOpacity={0.7}
                                >
                                    <View pointerEvents="none" style={{ width: '100%', alignItems: 'center' }}>
                                        <FormInput
                                            placeholder={'Selecione a data'}
                                            value={formattedDate}
                                            setValue={() => {}}
                                            editable={false}
                                            fullWidth={true}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={data || new Date()}
                                        mode='date'
                                        display='default'
                                        minimumDate={new Date()}
                                        onValueChange={(event, selectedDate) => {
                                            if (Platform.OS === 'android') setShowDatePicker(false);
                                            if (selectedDate) setData(selectedDate);
                                        }}
                                        onDismiss={() => setShowDatePicker(false)}
                                    />
                                )}
                            </>
                        )}

                        {/* HORÁRIO DE INÍCIO */}
                        <View style={styles.label}>
                            <MaterialCommunityIcons name="clock-start" size={24} />
                            <Text style={styles.labelText}>Horário de Início</Text>
                        </View>

                        {Platform.OS === 'web' ? (
                            <View style={{ width: '100%', marginBottom: 8 }}>
                                <input
                                    type='time'
                                    value={webStartTimeValue}
                                    onChange={handleWebStartTimeChange}
                                    style={styles.webInput}
                                />
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity
                                    onPress={() => setShowStartPicker(true)}
                                    style={{ width: '100%' }}
                                    activeOpacity={0.7}
                                >
                                    <View pointerEvents="none" style={{ width: '100%' }}>
                                        <FormInput
                                            placeholder={'Selecione o horário de início'}
                                            value={formattedStartTime}
                                            setValue={() => {}}
                                            editable={false}
                                            fullWidth={true}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {showStartPicker && (
                                    <DateTimePicker
                                        value={horarioInicio || new Date()}
                                        mode="time"
                                        display="default"
                                        is24Hour={true}
                                        onValueChange={(event, selectedTime) => {
                                            if (Platform.OS === 'android') setShowStartPicker(false);
                                            if (selectedTime) setHorarioInicio(selectedTime);
                                        }}
                                    />
                                )}
                            </>
                        )}

                        {/* HORÁRIO DE TÉRMINO */}
                        <View style={styles.label}>
                            <MaterialCommunityIcons name="clock-end" size={24} />
                            <Text style={styles.labelText}>Horário de Término</Text>
                        </View>

                        {Platform.OS === 'web' ? (
                            <View style={{ width: '100%', marginBottom: 8 }}>
                                <input
                                    type='time'
                                    value={webEndTimeValue}
                                    onChange={handleWebEndTimeChange}
                                    style={styles.webInput}
                                />
                            </View>
                        ) : (
                            <>
                                <TouchableOpacity
                                    onPress={() => setShowEndPicker(true)}
                                    style={{ width: '100%' }}
                                    activeOpacity={0.7}
                                >
                                    <View pointerEvents="none" style={{ width: '100%' }}>
                                        <FormInput
                                            placeholder={'Selecione o horário de término'}
                                            value={formattedEndTime}
                                            setValue={() => {}}
                                            editable={false}
                                            fullWidth={true}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {showEndPicker && (
                                    <DateTimePicker
                                        value={horarioFim || new Date()}
                                        mode="time"
                                        display="default"
                                        is24Hour={true}
                                        onValueChange={(event, selectedTime) => {
                                            if (Platform.OS === 'android') setShowEndPicker(false);
                                            if (selectedTime) setHorarioFim(selectedTime);
                                        }}
                                    />
                                )}
                            </>
                        )}

                        {/* FOTOS */}
                        <View style={styles.label}>
                            <MaterialIcons name="image" size={24} />
                            <Text style={styles.labelText}>Fotos do Local</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.imagePickerButton}
                            onPress={handlePickImages}
                        >
                            <MaterialIcons name="add-photo-alternate" size={32} color={Colors.b50} />
                            <Text style={styles.imagePickerText}>Anexar Imagens ({images.length}/10)</Text>
                        </TouchableOpacity>

                        {images.length > 0 && (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
                                {images.map((uri, index) => (
                                    <View key={index} style={styles.thumbnailWrapper}>
                                        <Image source={{ uri }} style={styles.thumbnail}/>
                                        <TouchableOpacity
                                            style={styles.removeImgBtn}
                                            onPress={() => handleRemoveImage(index)}
                                        >
                                            <MaterialIcons name="close" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>
                        )}

                        {/* LOCALIZAÇÃO */}
                        <View style={styles.label}>
                            <MaterialIcons name="location-pin" size={24} />
                            <Text style={styles.labelText}>Localização</Text>
                        </View>

                        <FormInput
                            placeholder={'Digite o endereço completo'}
                            value={endereco}
                            setValue={setEndereco}
                            fullWidth={true}
                        />

                        <TouchableOpacity
                            style={styles.mapPreviewCard}
                            activeOpacity={0.8}
                            onPress={() => setIsMapModalOpen(true)}
                        >
                            <View style={styles.mapPlaceholderBg}>
                                <MaterialCommunityIcons name="map-marker-radius" size={48} color={Colors.b50} />
                                <Text style={styles.mapPlaceholderText}>Clique aqui para selecionar no mapa</Text>
                            </View>
                            <View style={styles.mapAdressBar}>
                                <MaterialIcons name="location-pin" size={20} color={Colors.black} />
                                <Text style={styles.mapAdressText} numberOfLines={2}>{endereco || 'Clique aqui para abrir o mapa...'}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* VAGAS */}
                        <View style={styles.label}>
                            <MaterialIcons name="group" size={24} />
                            <Text style={styles.labelText}>Participantes</Text>
                        </View>

                        <FormInput2
                            placeholder={'Insira o número máx. de participantes'}
                            keyboardType='numeric'
                            value={vagasMax}
                            setValue={setVagasMax}
                        />

                        <View style={{ width: '100%', marginTop: 24, flexDirection: 'row' }}>
                            <Button
                                text={loading ? 'Publicando...' : 'Publicar no Mural'}
                                flex={true}
                                onPress={handleCreateService}
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.b25
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
        backgroundColor: Colors.formInputBg || '#f0f0f0',
        padding: '12px 16px',
        width: '100%',
        borderRadius: '12px',
        border: '1px solid #ccc',
        outline: 'none',
        fontFamily: 'sans-serif',
        fontSize: '14px',
        color: '#333',
        boxSizing: 'border-box'
    },
    imagePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.formInputBg,
        width: '100%',
        borderRadius: 16,
        padding: 12,
        marginTop: 6,
        gap: 8,
        borderWidth: 2,
        borderColor: Colors.b10,
        borderStyle: 'dashed'
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 8,
        marginBottom: 8
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
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
        elevation: 5
    },
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