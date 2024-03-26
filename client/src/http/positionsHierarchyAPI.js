import { $authHost } from "./index";

export const createPositionHierarchy = async (positionHierarchyData) => {
    try {
        const response = await $authHost.post('api/positionHierarchy/', positionHierarchyData);
        return response.data;
    } catch (error) {
        // Обработка ошибок, если необходимо
        console.error("Error creating positionHierarchy:", error);
        throw error; // Прокидываем ошибку дальше, чтобы обработать её в вызывающем коде
    }
};

export const fetchPositionsHierarchy = async (parentId) => {
    try {
        let url = 'api/positionHierarchy/';
        if (parentId) {
            url += `?parentId=${parentId}`;
        }
        const { data } = await $authHost.get(url);
        return data;
    } catch (error) {
        console.error("Error fetching positionHierarchys:", error);
        throw error;
    }
};


export const editPositionHierarchy = async (id, positionHierarchyData) => {
    try {
        const response = await $authHost.patch(`api/positionHierarchy/${id}`, positionHierarchyData);
        return response.data;
    } catch (error) {
        console.error("Error updating positionHierarchy:", error);
        throw error;
    }
};

export const fetchOnePositionHierarchy = async (id) => {
    try {
    const { data } = await $authHost.get('api/positionHierarchy/' + id);
    return data;
    } catch (error) {
        console.error("Error fetching positionHierarchy:", error);
        throw error;
    }
};

export const deletePositionHierarchy = async (id) => {
    try {
        const response = await $authHost.delete(`api/positionHierarchy/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting positionHierarchy:", error);
        throw error;
    }
};