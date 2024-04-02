import { $authHost } from "./index";

export const createExtract = async (extractData) => {
    try {
        const response = await $authHost.post('api/extract/', extractData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.extract;
    } catch (error) {
        // Обработка ошибок, если необходимо
        console.error("Error creating extract:", error);
        throw error; // Прокидываем ошибку дальше, чтобы обработать её в вызывающем коде
    }
};

export const fetchExtracts = async (page, limit, usersId, date, id) => {
    try {
        let url = `api/extract/?page=${page}&limit=${limit}`;
        // Добавляем передачу объекта даты в запрос, если он существует
        if (date && date.dateA && date.dateB) {
            url += `&date=${JSON.stringify(date)}`;
        }
        // Проверяем, есть ли пользователи в списке и добавляем их в URL
        if (usersId && Object.keys(usersId).length > 0) {
            url += `&usersId=${JSON.stringify(usersId)}`;
        }
        if (id && Object.keys(id).length > 0) {
            url += `&id=${JSON.stringify(id)}`;
        }
        const { data } = await $authHost.get(url);
        return data;
    } catch (error) {
        console.error("Error fetching extracts:", error);
        throw error;
    }
};

export const editExtract = async (id, extractData) => {
    try {
        const response = await $authHost.patch(`api/extract/${id}`, extractData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.extract;
    } catch (error) {
        console.error("Error updating extract:", error);
        throw error;
    }
};

export const fetchOneExtract = async (id) => {
    try {
    const { data } = await $authHost.get('api/extract/' + id);
    return data;
    } catch (error) {
        console.error("Error fetching extract:", error);
        throw error;
    }
};

export const deleteExtract = async (id) => {
    try {
        const response = await $authHost.delete(`api/extract/${id}`);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.message;
    } catch (error) {
        console.error("Error deleting extract:", error);
        throw error;
    }
};