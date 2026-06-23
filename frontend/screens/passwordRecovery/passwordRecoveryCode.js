import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";

// Componentes locais
import { Colors, Fonts } from "../../components/theme";
import LogoTitle from "../../components/logoTitle";
import Button from "../../components/button";
import CodeInput from "../../components/CodeInput";
import ScreenWrapper from "../../components/ScreenWrapper";

export default function PasswordRecoveryCodeScreen() {
    const [code, setCode] = useState('');

    const handleVerifyCode = () => {
        if (code.length < 4) {
            alert('digita aí os 4 número pf :(');
            return;
        }
        alert('GAMESS!!!');
    };

    return(
        <ScreenWrapper>
            <View style={styles.innerContainer}>
                <View style={styles.top}>
                    <LogoTitle text={'RECUPERAR SENHA'}/>
                </View>
                
                <View style={styles.bottom}>
                    <Text style={styles.text1}>Código de recuperação de senha</Text>
                    <CodeInput code={code} setCode={setCode}/>

                    <Button
                        text={'Redefinir senha'}
                        color={Colors.greenLA1}
                        onPress={handleVerifyCode}
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
    // View
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

        paddingTop: '20%',
        marginTop: '5%'
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
    }
})