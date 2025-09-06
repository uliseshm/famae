import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ILoginCredentials, IAuthResponse } from '../types/AuthTypes';
import { IClient, IClientForm } from '../types/ClientTypes';
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from './AuthService';


const API_URL = 'http://192.168.1.6:8000/api/';

const api: AxiosInstance = axios.create({
    baseURL: API_URL,
});

// Interceptor de peticiones: se ejecuta antes de cada llamada
api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor de respuestas: se ejecuta cuando se recibe una respuesta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // si el error es 401 y no es una llamada para renovar el token
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = await getRefreshToken();

            if (refreshToken) {
                try {
                    // intenta obtener un nuevo token de acceso
                    const response = await axios.post(`${API_URL}token/refresh/`, {
                        refresh: refreshToken,
                    });

                    // guarda los nuevos tokens
                    await saveTokens(response.data.access, response.data.refresh);

                    // actualiza el header de la peticion original y re-intentala
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // si falla la renovacion, borra los tokens y fuerza el re-login
                    await clearTokens();
                    // Aquí podrías navegar a la pantalla de login
                    console.log('Renovación de token fallida. Por favor, vuelva a iniciar sesión.');
                }
            }
        }
        return Promise.reject(error);
    }
);


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

export const getClients = async (): Promise<any> => {
    try {
        const response = await api.get('clientes/');
        return response.data;
    } catch (error) {
        throw new Error('No se pudieron cargar los clientes.');
    }
}

// export const getClients = async (token: string): Promise<IClient[]> => {
//     try {
//         const response = await api.get('clientes/', {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw new Error('No se pudieron cargar los clientes.');
//     }
// };

export const createClient = async (clientData: IClientForm, token: string): Promise<IClient> => {
    try {
        const response = await api.post('clientes/', clientData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            throw new Error(JSON.stringify(error.response.data));
        }
        throw new Error('Ocurrió un error al crear el cliente.');
    }
};

export const updateClient = async (id: number, clientData: IClientForm, token: string): Promise<IClient> => {
    try {
        const response = await api.put(`clientes/${id}/`, clientData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            throw new Error(JSON.stringify(error.response.data));
        }
        throw new Error('Ocurrió un error al actualizar el cliente.');
    }
};

export const deleteClient = async (id: number, token: string): Promise<void> => {
    try {
        await api.delete(`clientes/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
            throw new Error(JSON.stringify(error.response.data));
        }
        throw new Error('Ocurrió un error al eliminar el cliente.');
    }
};