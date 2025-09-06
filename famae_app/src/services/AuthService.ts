import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'famae_access_token';
const REFRESH_TOKEN_KEY = 'famae_refresh_token';

export const saveTokens = async (accessToken: string, refreshToken: string) => {
    try {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        console.log('Tokens guardados exitosamente.');
    } catch (error) {
        console.error('Error al guardar los tokens:', error);
    }
};

export const getAccessToken = async (): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error('Error al obtener el token de acceso:', error);
        return null;
    }
};

export const getRefreshToken = async (): Promise<string | null> => {
    try {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error('Error al obtener el token de refresco:', error);
        return null;
    }
};

export const clearTokens = async () => {
    try {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        console.log('Tokens eliminados exitosamente.');
    } catch (error) {
        console.error('Error al eliminar los tokens:', error);
    }
};