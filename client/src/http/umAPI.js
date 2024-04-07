import { $authHost } from "./index";

export const createUM = async (umData) => {
    try {
        const response = await $authHost.post('api/um/', umData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.um;
    } catch (error) {
        // Обработка ошибок, если необходимо
        console.error("Error creating um:", error);
        throw error; // Прокидываем ошибку дальше, чтобы обработать её в вызывающем коде
    }
};

export const fetchUMs = async () => {
    try {
        const { data } = await $authHost.get(`api/um/`);
        return data;
    } catch (error) {
        console.error("Error fetching ums:", error);
        throw error;
    }
};

export const editUM = async (id, umData) => {
    try {
        const response = await $authHost.patch(`api/um/${id}`, umData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.um;
    } catch (error) {
        console.error("Error updating um:", error);
        throw error;
    }
};

export const fetchOneUM = async (id) => {
    try {
    const { data } = await $authHost.get('api/um/' + id);
    return data;
    } catch (error) {
        console.error("Error fetching um:", error);
        throw error;
    }
};

export const deleteUM = async (id) => {
    try {
        const response = await $authHost.delete(`api/um/${id}`);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.message;
    } catch (error) {
        console.error("Error deleting um:", error);
        throw error;
    }
};