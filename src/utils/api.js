import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL + '/api/v1',
    withCredentials: true
});


// Menambahkan interceptor untuk setiap request yang akan dikirim
api.interceptors.request.use(
    config => {
        // 1. Ambil token dari tempat Anda menyimpannya (misal: localStorage)
        const token = localStorage.getItem('token');

        // 2. Jika token ada, tambahkan ke header Authorization
        if (token) {
            config.headers['Authorization'] = `Bearer ${token.replaceAll('"', '')}`;
        }

        // 3. Kembalikan objek config agar request bisa dilanjutkan
        return config;
    },
    error => {
        // Lakukan sesuatu jika ada error pada request
        return Promise.reject(error);
    }
);

export default api