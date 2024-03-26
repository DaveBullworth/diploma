import { $authHost, $host } from "./index";
import {jwtDecode} from "jwt-decode";

export const registration = async (userData) => {
    try {
        const response = await $host.post('api/user/registration', userData)
        return response.data
    } catch (error) {
        // Обработка ошибок, если необходимо
        console.error("Error registrating record:", error);
        throw error; // Прокидываем ошибку дальше, чтобы обработать её в вызывающем коде
    }
}

export const login = async (login, password) => {
    const {data} = await $host.post('api/user/login', {login, password})
    localStorage.setItem('token', data.token)
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
        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const fetchOneUser = async (id) => {
    try {
    const { data } = await $authHost.get('api/user/' + id);
    return data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
};

export const editUser = async (id, userData) => {
    try {
        const response = await $authHost.patch(`api/user/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await $authHost.delete(`api/user/${id}`);
        console.log('Response data:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};