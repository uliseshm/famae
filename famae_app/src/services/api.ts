import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ILoginCredentials, IAuthResponse } from '../types/AuthTypes';

const API_URL = 'http://192.168.1.6:8000/api/';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
});

export const login = async (credentials: ILoginCredentials): Promise<IAuthResponse> => {
    try {
        const response: AxiosResponse<IAuthResponse> = await api.post('login/', credentials);
        return response.data;
    } catch (error: any) {
        // si la llamada falla
        console.log("Error completo de la petición:", error);
        if (axios.isAxiosError(error) && error.response) {
            throw new Error('Credenciales inválidas. Por favor, revisa tu usuario y contraseña.');
        }
        throw new Error('Ocurrió un error al intentar iniciar sesión.');
    }
};