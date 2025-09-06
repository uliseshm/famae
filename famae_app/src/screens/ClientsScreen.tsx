import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

import { getClients, createClient, deleteClient } from '../services/api';
import { getAccessToken } from '../services/AuthService';
import { IClient, IClientForm } from '../types/ClientTypes';

type ClientEditScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Clients'>;

const ClientsScreen = () => {
    const isFocused = useIsFocused();
    const navigation = useNavigation<ClientEditScreenNavigationProp>();
    const [clients, setClients] = useState<IClient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [form, setForm] = useState<IClientForm>({
        nombre: '', apellidos: '', email: '', telefono: '', direccion: '',
        ciudad: '', estado: '', codigo_postal: '',
    });

    useEffect(() => {
        if (isFocused) {
            fetchClients();
        }
    }, [isFocused]);

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const token = await getAccessToken();
            if (token) {
                const clientList = await getClients(token);
                setClients(clientList);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateClient = async () => {
        try {
            const token = await getAccessToken();
            if (token) {
                await createClient(form, token);
                Alert.alert('Éxito', 'Cliente creado correctamente.');
                setForm({ nombre: '', apellidos: '', email: '', telefono: '', direccion: '',
                    ciudad: '', estado: '', codigo_postal: '',
                });
                fetchClients();
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleDeleteClient = async (id: number) => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar este cliente?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        try {
                            const token = await getAccessToken();
                            if (token) {
                                await deleteClient(id, token);
                                Alert.alert('Éxito', 'Cliente eliminado correctamente.');
                                fetchClients(); // refresca la lista
                            }
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };

    const renderClientItem = ({ item }: { item: IClient }) => (
        <View style={styles.clientItem}>
            <View>
                <Text style={styles.clientName}>{item.nombre} {item.apellidos}</Text>
                <Text>Email: {item.email}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => navigation.navigate('ClientEdit', { client: item })}
                >
                    <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteClient(item.id)}
                >
                    <Text style={styles.buttonText}>Borrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (isLoading) {
        return <Text style={styles.loadingText}>Cargando clientes...</Text>
    }

      return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Crear Nuevo Cliente</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={form.nombre} onChangeText={t => setForm({ ...form, nombre: t })} />
      <TextInput style={styles.input} placeholder="Apellidos" value={form.apellidos} onChangeText={t => setForm({ ...form, apellidos: t })} />
      <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={t => setForm({ ...form, email: t })} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Teléfono" value={form.telefono} onChangeText={t => setForm({ ...form, telefono: t })} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Dirección" value={form.direccion} onChangeText={t => setForm({ ...form, direccion: t })} />
      <TextInput style={styles.input} placeholder="Ciudad" value={form.ciudad} onChangeText={t => setForm({ ...form, ciudad: t })} />
      <TextInput style={styles.input} placeholder="Estado" value={form.estado} onChangeText={t => setForm({ ...form, estado: t })} />
      <TextInput style={styles.input} placeholder="Código Postal" value={form.codigo_postal} onChangeText={t => setForm({ ...form, codigo_postal: t })} keyboardType="numeric" />
      <Button title="Crear Cliente" onPress={handleCreateClient} />

      <Text style={styles.sectionTitle}>Lista de Clientes</Text>
      <FlatList
        data={clients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderClientItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10
    },
    clientName: {
        fontWeight: 'bold'
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 50
    },
    clientItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    actionButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    editButton: {
        backgroundColor: '#3498db',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ClientsScreen;