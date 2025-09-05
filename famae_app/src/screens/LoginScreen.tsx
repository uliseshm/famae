import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

import { login } from '../services/api';
import { ILoginCredentials } from '../types/AuthTypes';
import { saveTokens } from '../services/AuthService';

type LoginScreenNavigationPro = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationPro>();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const credentials: ILoginCredentials = { username, password };
            const response = await login(credentials);

            await saveTokens(response.access, response.refresh)

            navigation.navigate('Home');

            // console.log('Login exitoso. Tokens recibidos:', response);
            // Alert.alert('Éxito', '¡Bienvenido a FAE!');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión en FAMAE</Text>
            <TextInput
                style={styles.input}
                placeholder='Nombre de usuario'
                value={username}
                onChangeText={setUsername}
                autoCapitalize='none'
            />
            <TextInput
                style={styles.input}
                placeholder='Contraseña'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title='Entrar' onPress={handleLogin}/>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});

export default LoginScreen;