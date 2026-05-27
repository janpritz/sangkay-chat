import axios from 'axios';

const getBaseURL = () => {
    let url = process.env.NEXT_PUBLIC_BACKEND_URL;
    return url;
};

const api = axios.create({
    baseURL: getBaseURL(), 
    withCredentials: true, 
    withXSRFToken: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
});

// THIS IS THE FIX: 
// Manually attach the XSRF token from the cookie to every request header
api.interceptors.request.use((config) => {
    const cookies = document.cookie.split('; ');
    const xsrfCookie = cookies.find(row => row.startsWith('XSRF-TOKEN='));
    
    if (xsrfCookie) {
        const token = decodeURIComponent(xsrfCookie.split('=')[1]);
        config.headers['X-XSRF-TOKEN'] = token;
    }

    const token = localStorage.getItem("admin_token"); // or wherever you store it
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

export default api;