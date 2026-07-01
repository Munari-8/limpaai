import React  from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useNavigationState } from '@react-navigation/native';

// Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";

// Componentes locais
import { Colors } from "./Theme";

export default function Panel({ navigation }) {
    const currentRouteName = useNavigationState(state => {
        let route = state;
        while (route.routes && route.routes[route.index]) {
            route = route.routes[route.index];
        }
        return route.name;
    })

    // Muda a cor do icon relativo a página atual
    const getIconColor = (screenNames)=> {
        if (Array.isArray(screenNames)) {
            return screenNames.includes(currentRouteName) ? Colors.greenLA1 : Colors.white;
        }
        return currentRouteName === screenNames ? Colors.greenLA1 : Colors.white;
    }

    // Varia a outline relativo a página atual
    const getIconName = (screenName, baseName) => {
        return currentRouteName === screenName ? baseName : `${baseName}-outline`;
    }

    return (
        <LinearGradient
            colors={[Colors.b10, Colors.b25]}

            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}

            style={styles.container}
        >
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <MaterialCommunityIcons
                    name={getIconName('Home', 'home')}
                    size={44}
                    color={getIconColor('Home')}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Inbox')}>
                <MaterialCommunityIcons
                    name={getIconName('Inbox', 'message-text')}
                    size={40}
                    color={getIconColor(['Inbox'])}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('MainCatalogo', {
                screen: 'MainCatalogoScreen'
            })}>
                <MaterialCommunityIcons
                    name={getIconName('MainCatalogo', 'trash-can')}
                    size={40}
                    color={getIconColor(['MainCatalogo', 'CatalogoDeResiduos', 'YourSuggestions'])}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('MainMural')}>
                <MaterialCommunityIcons
                    name={getIconName('MainMural', 'clipboard-text')}
                    size={40}
                    color={getIconColor(['MainMural'])}
                />
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',

        paddingVertical: '3%',
        bottom: '1.89%',
        width: '92%',
        height: 64,

        borderRadius: 1000,

        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        alignSelf: 'center',
        zIndex: 10
    }
})