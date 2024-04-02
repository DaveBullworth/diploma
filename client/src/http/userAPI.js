import { $authHost, $host } from "./index";
import {jwtDecode} from "jwt-decode";

export const registration = async (userData) => {
    try {
        const response = await $authHost.post('api/user/registration', userData)
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.user
    } catch (error) {
        // Обработка ошибок, если необходимо
        console.error("Error registrating record:", error);
        throw error; // Прокидываем ошибку дальше, чтобы обработать её в вызывающем коде
    }
}

export const login = async (login, password) => {
    const {data} = await $host.post('api/user/login', {login, password})
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const fetchUsers = async () => {
    try {
        const { data } = await $authHost.get(`api/user/`);
        if(data.token) localStorage.setItem('token', data.token)
        return data.users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const fetchOneUser = async (id) => {
    try {
    const { data } = await $authHost.get('api/user/' + id);
    if(data.token) localStorage.setItem('token', data.token)
    return data.user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

export const editUser = async (id, userData) => {
    try {
        const response = await $authHost.patch(`api/user/${id}`, userData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.user;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await $authHost.delete(`api/user/${id}`);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        console.log('Response data:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};