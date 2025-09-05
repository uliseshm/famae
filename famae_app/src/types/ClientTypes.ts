export interface IClient {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    telefono?: string;
    direccion: string;
    ciudad: string;
    estado: string;
    codigo_postal?: string;
}

export interface IClientForm {
    nombre: string;
    apellidos: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    estado: string;
    codigo_postal: string;
}