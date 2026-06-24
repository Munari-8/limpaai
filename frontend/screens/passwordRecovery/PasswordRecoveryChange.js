import React from "react";
import { StyleSheet, View, Text } from "react-native";

// Componentes locais
import { Colors, Fonts } from "../../components/Theme";
import ScreenWrapper from "../../components/ScreenWrapper";
import LogoTitle from "../../components/LogoTitle";
import FormInput from "../../components/FormInput";
import Button from "../../components/Button";

export default function PasswordRecoveryChangeScreen({ navigation }) {
    return (
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <View style={styles.top}>
                    <LogoTitle text={'RECUPERAR SENHA'}/>
                </View>

                <View style={styles.bottom}>
                    <Text style={styles.text1}>Nova senha</Text>
                    <FormInput
                        placeholder={'Digite sua nova senha'}
                        secureTextEntry={true}
                    />

                    <Text style={styles.text1}>Confirmar nova senha</Text>
                    <FormInput
                        placeholder={'Digite sua nova senha novamente'}
                        secureTextEntry={true}
                    />

                    <View style={{marginTop: '9%'}}></View>
                    
                    <Button
                        text={'Redefinir senha'}
                        color={Colors.greenLA1}
                        onPress={() =>
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Welcome' }]
                            })
                        }
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.text2, {fontSize: 15}]}>Combatendo a poluição urbana com a união entre as pessoas</Text>
                </View>
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        flex: 1,
        backgroundColor: Colors.background,

        alignItems: 'center',
        justifyContent: 'center',

        paddingVertical: '5%'
    },
    top: {
        width: '100%' ,
        alignItems: 'center',

        paddingTop: '15%',
    },
    bottom: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'auto',
        marginBottom: '5%'
    },
    footer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: '8%'
    },

    // Text
    text1: {
        fontFamily: Fonts.bold,
        fontSize: 16,
        color: Colors.greenLA2,

        marginBottom: 4,
        marginTop: 6
    },
    text2: {
        fontFamily: Fonts.light,
        fontSize: 16,

        textAlign: 'center',

        marginBottom: 8,
        marginTop: 16
    },
    errorText: {
        color: 'red',
        fontFamily: Fonts.light,
        marginTop: '-3%'
    }
})