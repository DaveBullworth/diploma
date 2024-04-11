import { $authHost } from "./index";

export const createOrder = async (orderData) => {
    try {
        const response = await $authHost.post('api/order/', orderData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.order;
    } catch (error) {
        // Обработка ошибок, если необходимо
        console.error("Error creating order:", error);
        throw error; // Прокидываем ошибку дальше, чтобы обработать её в вызывающем коде
    }
};

export const fetchOrders = async (page, limit, date, id) => {
    try {
        let url = `api/order/?page=${page}&limit=${limit}`;
        // Добавляем передачу объекта даты в запрос, если он существует
        if (date && date.dateA && date.dateB) {
            url += `&date=${JSON.stringify(date)}`;
        }
        if (id && Object.keys(id).length > 0) {
            url += `&id=${JSON.stringify(id)}`;
        }
        const { data } = await $authHost.get(url);
        return data;
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

export const editOrder = async (id, orderData) => {
    try {
        const response = await $authHost.patch(`api/order/${id}`, orderData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.order;
    } catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
};

export const fetchOneOrder = async (id) => {
    try {
    const { data } = await $authHost.get('api/order/' + id);
    return data;
    } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await $authHost.delete(`api/order/${id}`);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.message;
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
};