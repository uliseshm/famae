import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { updateClient } from '../services/api';
import { getAccessToken } from '../services/AuthService';
import { IClientForm } from '../types/ClientTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { RouteProp } from '@react-navigation/native';

type ClientEditScreenRouteProp = RouteProp<RootStackParamList, 'ClientEdit'>;
type ClientEditScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ClientEdit'>;

const ClientEditScreen = () => {
    const route = useRoute<ClientEditScreenRouteProp>();
    const navigation = useNavigation<ClientEditScreenNavigationProp>();
    const { client } = route.params;

    const [form, setForm] = useState<IClientForm>({
        nombre: client.nombre,
        apellidos: client.apellidos,
        email: client.email,
        telefono: client.telefono || '',
        direccion: client.direccion,
        ciudad: client.ciudad,
        estado: client.estado,
        codigo_postal: client.codigo_postal || '',
    });

    const handleUpdate = async () => {
        console.log('Cliente ID a actualizar:', client.id);
        try {
            const token = await getAccessToken();
            if (token) {
                await updateClient(client.id, form, token);
                Alert.alert('Éxito', 'Cliente actualizado correctamente.');
                navigation.goBack();
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Cliente</Text>
            <TextInput style={styles.input} placeholder="Nombre" value={form.nombre} onChangeText={t => setForm({ ...form, nombre: t })} />
            <TextInput style={styles.input} placeholder="Apellidos" value={form.apellidos} onChangeText={t => setForm({ ...form, apellidos: t })} />
            <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={t => setForm({ ...form, email: t })} keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Teléfono" value={form.telefono} onChangeText={t => setForm({ ...form, telefono: t })} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Dirección" value={form.direccion} onChangeText={t => setForm({ ...form, direccion: t })} />
            <TextInput style={styles.input} placeholder="Ciudad" value={form.ciudad} onChangeText={t => setForm({ ...form, ciudad: t })} />
            <TextInput style={styles.input} placeholder="Estado" value={form.estado} onChangeText={t => setForm({ ...form, estado: t })} />
            <TextInput style={styles.input} placeholder="Código Postal" value={form.codigo_postal} onChangeText={t => setForm({ ...form, codigo_postal: t })} keyboardType="numeric" />
            <Button title="Actualizar Cliente" onPress={handleUpdate} />
        </View>
    );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
});

export default ClientEditScreen;