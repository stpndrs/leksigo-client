import axios from "axios";
// Impor fungsi yang SUDAH DIPERBAIKI dari state Anda
import {
    triggerToast,
    showLoadingToast, // <-- Fungsi baru (kustom)
    hideLoadingToast,  // <-- Fungsi baru (kustom)
    globalToast
} from "@/utils/toast"; // <-- Path ke file Anda

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL + '/api/v1',
    withCredentials: true
});

// Counter untuk melacak request yang aktif
let activeRequests = 0;

// Request Interceptor
api.interceptors.request.use(
    config => {
        if (activeRequests === 0) {
            if (config.method != 'get')
                showLoadingToast("Sedang memproses...");
        }
        activeRequests++;

        const token = localStorage.getItem('token');
        if (token) config.headers['Authorization'] = `Bearer ${token.replaceAll('"', '')}`;

        return config;
    },
    error => {
        activeRequests--;
        if (activeRequests === 0) {
            // Panggil fungsi kustom Anda
            hideLoadingToast();
        }
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    response => {
        activeRequests--;
        const method = response.config.method.toLowerCase();
        if (activeRequests === 0) {
            setTimeout(() => {
                hideLoadingToast();
            }, 3000);
        }


        setTimeout(() => {
            if (method === 'post') {
                triggerToast('Data berhasil ditambahkan', 'success', 'Berhasil!');
            } else if (method === 'put') {
                triggerToast('Data berhasil diperbarui', 'success', 'Berhasil!');
            } else if (method === 'delete') {
                triggerToast('Data berhasil dihapus', 'success', 'Berhasil!');
            }

        }, 1000); // Beri jeda 100ms

        return response;
    },
    error => {
        activeRequests--;
        if (activeRequests === 0) {
            hideLoadingToast();
        }

        let pesan = "Terjadi kesalahan";
        if (error.response && error.response.data) {
            pesan = error.response.data.message || error.response.statusText;
        } else if (error.message) {
            pesan = error.message;
        }
        triggerToast(pesan, 'error', 'Ups, Error!');

        return Promise.reject(error);
    }
);

export default api;