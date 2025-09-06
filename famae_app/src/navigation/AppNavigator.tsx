import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ClientsScreen from '../screens/ClientsScreen';
import { IClient } from '../types/ClientTypes';
import ClientEditScreen from '../screens/ClientEditScreen';

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Clients: undefined;
    ClientEdit: { client: IClient }
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
            <Stack.Screen name="Clients" component={ClientsScreen} options={{ title: 'Clientes' }} />
            <Stack.Screen name="ClientEdit" component={ClientEditScreen} options={{ title: 'Editar' }} />
        </Stack.Navigator>
    );
};

export default AppNavigator;