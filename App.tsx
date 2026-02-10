import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { RootStackParamList } from './src/types';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PlaceOrderScreen from './src/screens/PlaceOrderScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';

const Stack = createStackNavigator<RootStackParamList>();

function AuthStack() {
    return (
        <Stack.Navigator id="auth" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
}

function MainStack() {
    return (
        <Stack.Navigator id="main" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PlaceOrder" component={PlaceOrderScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        </Stack.Navigator>
    );
}

function Navigation() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator color="#007AFF" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
    );
}

import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <StatusBar style="auto" />
                <Navigation />
            </AuthProvider>
        </SafeAreaProvider>
    );
}
