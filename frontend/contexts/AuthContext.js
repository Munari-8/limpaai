import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storagedUser = await AsyncStorage.getItem('@Auth:user');
            if (storagedUser) {
                setUser(JSON.parse(storagedUser));
            }
            setLoading(false);
        }
        loadStorageData();
    }, []);

    async function login(userData) {
        setUser(userData);
        await AsyncStorage.setItem('@Auth:user', JSON.stringify(userData));
    }

    async function logout() {
        await AsyncStorage.removeItem('@Auth:user');
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ signed: !!user, user, loading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}