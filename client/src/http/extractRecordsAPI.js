import { $authHost } from "./index";

export const createExtractRecord = async (extractRecordData) => {
    try {
        const response = await $authHost.post('api/extractRecord/', extractRecordData);
        return response.data;
    } catch (error) {
        // Обработка ошибок, если необходимо
        console.error("Error creating extractRecord:", error);
        throw error; // Прокидываем ошибку дальше, чтобы обработать её в вызывающем коде
    }
};

export const fetchExtractRecords = async (page, limit, extractId, filters, sort) => {
    try {
        let url = `api/extractRecord?`;
        if (page && limit) {
            url += `&page=${page}&limit=${limit}`;
        }
        if (extractId) {
            url += `&extractId=${extractId}`
        }
        // Добавляем передачу объекта фильтров в запрос, если он существует
        if (filters && Object.keys(filters).length > 0) {
            url += `&filters=${JSON.stringify(filters)}`;
        }

        if (sort && Object.keys(sort).length > 0) {
            url += `&sort=${JSON.stringify(sort)}`;
        }
        const { data } = await $authHost.get(url);
        return data;
    } catch (error) {
        console.error("Error fetching extractRecords:", error);
        throw error;
    }
};

export const editExtractRecord = async (id, extractRecordData) => {
    try {
        const response = await $authHost.patch(`api/extractRecord/${id}`, extractRecordData);
        return response.data;
    } catch (error) {
        console.error("Error updating extractRecord:", error);
        throw error;
    }
};

export const fetchOneExtractRecord = async (id) => {
    try {
    const { data } = await $authHost.get('api/extractRecord/' + id);
    return data;
    } catch (error) {
        console.error("Error fetching extractRecord:", error);
        throw error;
    }
};

export const deleteExtractRecord = async (id) => {
    try {
        const response = await $authHost.delete(`api/extractRecord/${id}`);
        console.log('Response data:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting extractRecord:", error);
        throw error;
    }
};