// src/utils/toastState.js
import { reactive } from 'vue';

// State global untuk menyimpan data toast
export const globalToast = reactive({
    show: false,
    message: '',
    type: 'info', // 'success', 'error', 'info'
    title: '' // opsional
});

// Helper function untuk memanggil toast dari file JS manapun (termasuk axios)
export const triggerToast = (message, type = 'info', title = '') => {
    globalToast.message = message;
    globalToast.type = type;
    globalToast.title = title;
    globalToast.show = true;

    // Opsional: Auto close setelah 3 detik
    setTimeout(() => {
        globalToast.show = false;
    }, 3000);
};

export const showLoadingToast = (message, type = 'info', title = '') => {
    globalToast.message = message;
    globalToast.type = type;
    globalToast.title = title;
    globalToast.show = true;
}

export const hideLoadingToast = () => {
    globalToast.show = false;
}