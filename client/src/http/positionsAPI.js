import { $authHost } from "./index";

export const createPosition = async (positionData) => {
    try {
        const response = await $authHost.post('api/position', positionData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.position;
    } catch (error) {
        // Обработка ошибок, если необходимо
        console.error("Error creating position:", error);
        throw error; // Прокидываем ошибку дальше, чтобы обработать её в вызывающем коде
    }
};

export const fetchPositions = async (page, limit, filters, sort, id) => {
    try {
        let url = `api/position?`;

        if (page && limit) {
            url += `&page=${page}&limit=${limit}`;
        }
        // Добавляем передачу объекта фильтров в запрос, если он существует
        if (filters && Object.keys(filters).length > 0) {
            url += `&filters=${JSON.stringify(filters)}`;
        }

        if (sort && Object.keys(sort).length > 0) {
            url += `&sort=${JSON.stringify(sort)}`;
        }

        if (id) {
            url += `&id=${id}`;
        }
        const { data } = await $authHost.get(url);
        return data;
    } catch (error) {
        console.error("Error fetching positions:", error);
        throw error;
    }
};

export const editPosition = async (id, positionData) => {
    try {
        const response = await $authHost.patch(`api/position/${id}`, positionData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.position;
    } catch (error) {
        console.error("Error updating position:", error);
        throw error;
    }
};

export const fetchOnePosition = async (id) => {
    try {
    const { data } = await $authHost.get('api/position/' + id);
    return data;
    } catch (error) {
        console.error("Error fetching position:", error);
        throw error;
    }
};

export const deletePosition = async (id) => {
    try {
        const response = await $authHost.delete(`api/position/${id}`);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.message;
    } catch (error) {
        console.error("Error deleting position:", error);
        throw error;
    }
};