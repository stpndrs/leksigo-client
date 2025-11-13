import axios from "axios";
import { triggerToast } from "@/utils/toast"; // <--- Import jembatan tadi

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL + '/api/v1',
    withCredentials: true
});

// Request Interceptor (tetap seperti kode kamu)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token.replaceAll('"', '')}`;
    return config;
}, error => Promise.reject(error));


// Response Interceptor (INI YANG KITA TAMBAH)
api.interceptors.response.use(
    response => {
        const method = response.config.method.toLowerCase();

        // show toast while fetching
        if (method === 'post') {
            triggerToast('Data berhasil ditambahkan', 'success', 'Berhasil!');
        }
        else if (method === 'put') {
            triggerToast('Data berhasil diperbarui', 'success', 'Berhasil!');
        }
        else if (method === 'delete') {
            triggerToast('Data berhasil dihapus', 'success', 'Berhasil!');
        }

        return response
    },
    error => {
        let pesan = "Terjadi kesalahan";

        // Cek pesan error dari response backend
        if (error.response && error.response.data) {
            pesan = error.response.data.message || error.response.statusText;
        } else if (error.message) {
            pesan = error.message;
        }

        // Panggil Toast Global disini!
        triggerToast(pesan, 'error', 'Ups, Error!');

        return Promise.reject(error);
    }
);

export default api;