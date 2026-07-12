import React, { useState } from "react";
import { StyleSheet, View, Alert, Text } from "react-native";

// Expo
import { Image } from "expo-image";
import * as ImagePicker from 'expo-image-picker';

// Local
import { Colors, Fonts } from "../components/Theme";
import ScreenWrapper from "../components/ScreenWrapper";
import LogoTitle from "../components/LogoTitle";
import Avatar from "../components/Avatar";
import FormInput from "../components/FormInput";
import FormSelect from '../components/FormSelect';

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
    const [profileImg, setProfileImg] = useState(null);

    // Pronomes
    const [pronoun, setPronoun] = useState();

    const pronounList = [
        `Ele/Dele`,
        `Ela/Dela`,
        `Elu/Delu`
    ]

    // Escolher imagem da galeria
    const handlePickImg = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== `granted`) {
            Alert.alert(`Permissão necessária`, `Precisamos de permissão para acessar suas fotos`);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImg(result.assets[0].uri);
        }
    };

    const [city, setCity] = useState(null);
    const [neighborhood, setNeighborhood] = useState(null);

    const cityOptions = Object.keys(RS_DATA);
    const neighborhoodOptions = city ? RS_DATA[city] : [];

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

                    <Text style={styles.text1}>Nome de exibição</Text>
                    <FormInput
                        placeholder={`Digite um nome à ser exibido aos outros`}
                    />

                    <Text style={styles.text1}>Nome completo</Text>
                    <FormInput
                        placeholder={`Digite seu nome completo`}
                    />

                    <Text style={styles.text1}>Pronomes</Text>
                        <FormSelect
                            placeholder={`Selecione seus pronomes`}
                            options={pronounList}
                            selectedValue={pronoun}
                            onSelect={setPronoun}
                            isWaste={false}
                            width={80}
                            zIndex={3}
                        />

                    <Text style={styles.text1}>Cidade</Text>
                    <FormSelect
                        placeholder={`Selecione sua cidade`}
                        options={cityOptions}
                        selectedValue={city}
                        onSelect={handleCityChange}
                        isWaste={false}
                        width={80}
                        zIndex={2}
                    />

                    <Text style={styles.text1}>Bairro</Text>
                    <FormSelect
                        placeholder={city ? `Selecione seu bairro` : `Selecione a cidade primeiro`}
                        options={neighborhoodOptions}
                        selectedValue={neighborhood}
                        onSelect={(item) => setNeighborhood(item)}
                        isWaste={false}
                        width={80}
                    />
                </View>
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
        marginBottom: '5%'
    },

    // Text
    text1: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: Colors.greenLA2,

        marginBottom: 4,
        marginTop: 6,
    }
})