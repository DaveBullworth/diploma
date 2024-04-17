import axios from "axios";

const $host = axios.create({
    baseURL: window._env_.API_URL
})

const $authHost = axios.create({
    baseURL: window._env_.API_URL
});

const authInterceptor = (config) => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    }

    if (refreshToken) {
        config.headers['x-refresh-token'] = refreshToken;
    }

    return config;
};
  
$authHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost
}