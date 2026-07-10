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

export default function EditProfile() {
    const [profileImg, setProfileImg] = useState(null);

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

                    <Text style={styles.text1}>Nome de usuário</Text>
                    <FormInput
                        placeholder={`Digite um nome de usuário válido`}
                    />

                    <Text style={styles.text1}>Data de nascimento</Text>
                    <FormInput
                        placeholder={`Selecione sua data de nascimento`}
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