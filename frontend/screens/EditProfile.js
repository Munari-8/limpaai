import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Text, Platform } from "react-native";

// Expo
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';
import { File } from "expo-file-system";

// Local
import { Colors, Fonts } from "../components/Theme";
import ScreenWrapper from "../components/ScreenWrapper";
import LogoTitle from "../components/LogoTitle";
import Avatar from "../components/Avatar";
import FormInput from "../components/FormInput";
import FormSelect from '../components/FormSelect';
import Button from '../components/Button';
import { useAuth } from "../contexts/AuthContext";

// IP
import { API_URL } from '../services/api';

const RS_DATA = {
    'Novo Hamburgo': [
        'Alpes do Vale', 'Boa Saúde', 'Boa Vista', 'Canudos', 'Centro', 'Diehl', 'Guarani', 'Hamburgo Velho',
        'Ideal', 'Industrial', 'Liberdade', 'Lomba Grande', 'Mauá', 'Operário', 'Ouro Branco', 'Pátria Nova',
        'Petrópolis', 'Primavera', 'Rincão', 'Rio Branco', 'Rondônia', 'Roselândia', 'São Jorge', 'Santo Afonso',
        'São José', 'Vila Nova', 'Vila Rosa'
    ],
    'São Leopoldo': [
        'Arroio da Manteiga', 'Boa Vista', 'Campestre', 'Campina', 'Centro', 'Cristo Rei', 'Duque de Caxias', 'Fazenda São Borja',
        'Feitoria', 'Fião', 'Jardim América', 'Morro do Espelho', 'Padre Reus', 'Pinheiro', 'Rio Branco', 'Rio dos Sinos',
        'Santa Teresa', 'Santo André', 'Santos Dumont', 'São João Batista', 'São José', 'São Miguel', 'Scharlau', 'Vicentina'
    ]
};

export default function EditProfile() {
    const { user, updateUserContext } = useAuth();
    const userId = user?.id;

    const [profileImg, setProfileImg] = useState(null);
    const [newImgUri, setNewImgUri] = useState(null);
    const [nomeExibicao, setNomeExibicao] = useState('');
    const [gender, setGender] = useState();
    const [city, setCity] = useState(null);
    const [neighborhood, setNeighborhood] = useState(null);

    const genderList = [
        `Masculino`,
        `Feminino`,
        `Não Binário`
    ];
    const cityOptions = Object.keys(RS_DATA);
    const neighborhoodOptions = city ? RS_DATA[city] : [];

    // Gets data instantly
    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`${API_URL}/usuarios/${userId}`)
                const data = await response.json();

                if (response.ok) {
                    setNomeExibicao(data.nome_exibicao || '');
                    setGender(data.genero || null);
                    setCity(data.cidade || null);
                    setNeighborhood(data.bairro || null);

                    if (data.foto_perfil) {
                        setProfileImg(`${API_URL}${data.foto_perfil}`);
                    }
                }
            } catch (error) {
                console.log(error);
                Alert.alert(`Erro`, `Não foi possível carregar seus dados`);
            }
        };

        fetchUserData();
    }, [userId]);

    // Send data 2 db
    const handleSave = async () => {
        try {
            const formData = new FormData();

            formData.append('nome_exibicao', nomeExibicao || '');
            formData.append('genero', gender || '');
            formData.append('cidade', city || '');
            formData.append('bairro', neighborhood || '');

            if (newImgUri) {
                const filename = newImgUri.split('/').pop() || 'perfil.jpg';

                if (Platform.OS === 'web') {
                    const blob = await (await fetch(newImgUri)).blob();
                    formData.append('foto_perfil', blob, filename);
                } else {
                    formData.append('foto_perfil', new File(newImgUri));
                }
            } else {
                const relativePath = profileImg && profileImg.startsWith(API_URL)
                    ? profileImg.replace(API_URL, '')
                    : '';
                formData.append('foto_perfil_atual', relativePath);
            }

            const response = await fetch(`${API_URL}/usuarios/${userId}`, {
                method: `PUT`,
                body: formData
            });

            if (response.ok) {
                const userResponse = await fetch(`${API_URL}/usuarios/${userId}`);
                const updatedData = await userResponse.json();

                await updateUserContext({
                    nome_exibicao: updatedData.nome_exibicao,
                    genero: updatedData.genero,
                    foto_perfil: updatedData.foto_perfil
                });
            } else {
                Alert.alert(`Erro`, `Falha ao salvar alterações`);
            }
        } catch (error) {
            console.log(error);
            Alert.alert(`Erro`, `Falha de conexão com o servidor`);
        }
    };

    // Picks img from gallery
    const handlePickImg = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== `granted`) {
            Alert.alert(`Permissão necessária`, `Precisamos de permissão para acessar suas fotos`);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            setProfileImg(result.assets[0].uri);
            setNewImgUri(result.assets[0].uri);
        }
    };

    const handleCityChange = (selectedCity) => {
        setCity(selectedCity);
        setNeighborhood(null);
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.main}>
                    <Avatar
                        source={profileImg}
                        onPress={handlePickImg}
                    />

                    <View style={{ height: 24 }}/>

                    <Text style={styles.text1}>Nome de exibição</Text>
                    <FormInput
                        placeholder={`Digite um nome à ser exibido`}
                        value={nomeExibicao}
                        setValue={setNomeExibicao}
                    />

                    <Text style={styles.text1}>Gênero</Text>
                    <FormSelect
                        placeholder={`Selecione seu gênero`}
                        options={genderList}
                        selectedValue={gender}
                        onSelect={setGender}
                        width={80}
                        zIndex={3}
                    />

                    <Text style={styles.text1}>Cidade</Text>
                    <FormSelect
                        placeholder={`Selecione sua cidade`}
                        options={cityOptions}
                        selectedValue={city}
                        onSelect={handleCityChange}
                        width={80}
                        zIndex={2}
                    />

                    <Text style={styles.text1}>Bairro</Text>
                    <FormSelect
                        placeholder={city ? `Selecione seu bairro` : `Selecione a cidade primeiro`}
                        options={neighborhoodOptions}
                        selectedValue={neighborhood}
                        onSelect={setNeighborhood}
                        width={80}
                    />
                </View>

                <Button
                        text={`Salvar Mudanças`}
                        color={Colors.greenLA1}
                        style={{ marginTop: `10%` }}
                        onPress={handleSave}
                    />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    // View
    container: {
        flex: 1,
        alignItems: `center`,
        justifyContent: `flex-start`,

        paddingVertical: `5%`,
    },
    top: {
        width: '100%' ,
        alignItems: 'center',
        marginBottom: '8%'
    },
    main: {
        width: '100%',

        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    // Text
    text1: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: Colors.greenLA2,

        marginBottom: 4,
        marginTop: 6,
    }
});