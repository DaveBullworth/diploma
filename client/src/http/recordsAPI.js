import { $authHost } from "./index";

export const createRecord = async (recordData) => {
    try {
        const response = await $authHost.post('api/record', recordData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.record;
    } catch (error) {
        // Обработка ошибок, если необходимо
        console.error("Error creating record:", error);
        throw error; // Прокидываем ошибку дальше, чтобы обработать её в вызывающем коде
    }
};

export const fetchRecords = async (page, limit, positionId, date, filters) => {
    try {
        let url = `api/record?`;
        if (page && limit) {
            url += `&page=${page}&limit=${limit}`;
        }
        if (positionId){
            url += `&positionId=${positionId}`;
        }
        // Добавляем передачу объекта даты в запрос, если он существует
        if (date && date.dateA && date.dateB) {
            url += `&date=${JSON.stringify(date)}`;
        }
        if (filters && Object.keys(filters).length > 0) {
            url += `&filters=${JSON.stringify(filters)}`;
        }
        const { data } = await $authHost.get(url);
        return data;
    } catch (error) {
        console.error("Error fetching records:", error);
        throw error;
    }
};

export const editRecord = async (id, recordData) => {
    try {
        const response = await $authHost.patch(`api/record/${id}`, recordData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.record;
    } catch (error) {
        console.error("Error updating record:", error);
        throw error;
    }
};

export const fetchOneRecord = async (id) => {
    try {
    const { data } = await $authHost.get('api/record/' + id);
    return data;
    } catch (error) {
        console.error("Error fetching record:", error);
        throw error;
    }
};

export const deleteRecord = async (id) => {
    try {
        const response = await $authHost.delete(`api/record/${id}`);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.message;
    } catch (error) {
        console.error("Error deleting record:", error);
        throw error;
    }
};