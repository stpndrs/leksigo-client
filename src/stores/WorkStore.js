// File: /src/stores/workStore.js
import { reactive } from "vue";

export const workStore = reactive({
    isWorkMode: false,

    // Method untuk mengatur status secara spesifik
    setWorkMode(status) {
        this.isWorkMode = status;
    },

    // Method untuk masuk ke mode kerja (sesuai permintaan Anda)
    enterWorkMode() {
        this.isWorkMode = true;
    },

    // Method untuk keluar
    exitWorkMode() {
        this.isWorkMode = false;
    },

    // Method untuk bolak-balik (toggle)
    toggleWorkMode() {
        this.isWorkMode = !this.isWorkMode;
    }
});