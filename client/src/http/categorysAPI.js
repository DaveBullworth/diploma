import { $authHost } from "./index";

export const createCategory = async (categoryData) => {
    try {
        const response = await $authHost.post('api/category/', categoryData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.category;
    } catch (error) {
        // Обработка ошибок, если необходимо
        console.error("Error creating category:", error);
        throw error; // Прокидываем ошибку дальше, чтобы обработать её в вызывающем коде
    }
};

export const fetchCategorys = async () => {
    try {
        const { data } = await $authHost.get(`api/category/`);
        return data;
    } catch (error) {
        console.error("Error fetching categorys:", error);
        throw error;
    }
};

export const editCategory = async (id, categoryData) => {
    try {
        const response = await $authHost.patch(`api/category/${id}`, categoryData);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.category;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
};

export const fetchOneCategory = async (id) => {
    try {
    const { data } = await $authHost.get('api/category/' + id);
    return data;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await $authHost.delete(`api/category/${id}`);
        if(response.data.token) localStorage.setItem('token', response.data.token)
        return response.data.message;
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
};