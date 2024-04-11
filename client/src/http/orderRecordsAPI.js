import { $authHost } from "./index";

export const createOrderRecord = async (orderRecordData) => {
    try {
        const response = await $authHost.post('api/orderRecord/', orderRecordData);
        return response.data;
    } catch (error) {
        // Обработка ошибок, если необходимо
        console.error("Error creating orderRecord:", error);
        throw error; // Прокидываем ошибку дальше, чтобы обработать её в вызывающем коде
    }
};

export const fetchOrderRecords = async (page, limit, orderId, filters, sort) => {
    try {
        let url = `api/orderRecord?`;
        if (page && limit) {
            url += `&page=${page}&limit=${limit}`;
        }
        if (orderId) {
            url += `&orderId=${orderId}`
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
        console.error("Error fetching orderRecords:", error);
        throw error;
    }
};

export const editOrderRecord = async (id, orderRecordData) => {
    try {
        const response = await $authHost.patch(`api/orderRecord/${id}`, orderRecordData);
        return response.data;
    } catch (error) {
        console.error("Error updating orderRecord:", error);
        throw error;
    }
};

export const fetchOneOrderRecord = async (id) => {
    try {
    const { data } = await $authHost.get('api/orderRecord/' + id);
    return data;
    } catch (error) {
        console.error("Error fetching orderRecord:", error);
        throw error;
    }
};

export const deleteOrderRecord = async (id) => {
    try {
        const response = await $authHost.delete(`api/orderRecord/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting orderRecord:", error);
        throw error;
    }
};