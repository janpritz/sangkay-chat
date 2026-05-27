import axios from 'axios';

const getBaseURL = () => {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL;
    return url;
};

const api = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

// Attach XSRF + Bearer token
api.interceptors.request.use((config) => {
    // Attach XSRF token from cookie
    const cookies = document.cookie.split('; ');
    const xsrfCookie = cookies.find(row => row.startsWith('XSRF-TOKEN='));

    if (xsrfCookie) {
        const token = decodeURIComponent(xsrfCookie.split('=')[1]);
        config.headers['X-XSRF-TOKEN'] = token;
    }

    // Attach Bearer token if exists
    const token = localStorage.getItem("admin_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;