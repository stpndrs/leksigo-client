import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios'; // Asumsi pakai axios
import { authStore } from './AuthStore'; // Ambil token jika perlu
import api from '@/utils/api';

export const useMaterialStore = defineStore('material', () => {
    const isLoading = ref(false);
    const savedMaterials = ref([]);

    // --- ACTION: Simpan Materi ---
    const saveGeneratedMaterial = async (payload) => {
        isLoading.value = true;

        try {
            // 1. Persiapkan Data Sesuai Metode
            // Kita format ulang data agar backend mengerti konteks materinya
            const formattedData = formatDataByMethod(payload);

            console.log("Mengirim data ke backend:", formattedData);

            // 2. Simulasi API Call (Ganti dengan endpoint asli Anda)
            await api.post('/materials', formattedData)
                .then((res) => {
                    console.log(res);
                })

            // Simulasi sukses
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 3. Update State Lokal (Opsional)
            savedMaterials.value.push(formattedData);

            return { success: true, message: 'Materi berhasil disimpan ke Library!' };

        } catch (error) {
            console.error("Gagal menyimpan materi:", error);
            return { success: false, message: 'Gagal menyimpan materi.' };
        } finally {
            isLoading.value = false;
        }
    };

    // --- HELPER: Format Data Berdasarkan Metode ---
    const formatDataByMethod = (input) => {
        let payload = {
            childrenId: input.childrenId,
            level: input.level,
            method: input.method_id, // ID Metode untuk backend
            title: input.title,
            description: input.description,
            link: input.videoUrl,
            content: input.content,
            readedText: input.readedText,
            images: input.images,
            isGenerated: true
        };

        return payload;
    };

    return {
        isLoading,
        savedMaterials,
        saveGeneratedMaterial
    };
});