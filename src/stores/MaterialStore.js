import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios'; // Asumsi pakai axios
import { authStore } from './AuthStore'; // Ambil token jika perlu

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
            // const response = await axios.post('/api/materials/store', formattedData);

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
        /**
         * input structure:
         * {
         * level: Number,
         * method_id: Number, // 1: Audio, 2: Menulis, 3: Membaca, dst
         * method_label: String,
         * title: String,
         * description: String,
         * content_text: String,
         * media_url: String (Video/Image),
         * is_ai_voice_enabled: Boolean
         * }
         */

        // Base Payload (Data dasar yang selalu ada)
        let payload = {
            level: input.level,
            method_type: input.method_id, // ID Metode untuk backend
            title: input.title,
            description: input.description,
            is_voice_generated: false, // Default
            metadata: {} // Untuk data spesifik
        };

        // Logika Penyesuaian Metode
        switch (input.method_id) {
            case 1: // Mendengar Audio
                payload.type = 'audio_visual';
                payload.video_link = input.media_url; // Link Youtube/Video
                payload.transcript = input.content_text; // Teks untuk dibaca/dicocokkan
                break;

            case 2: // Menulis Ulang
                payload.type = 'text_exercise';
                payload.source_text = input.content_text; // Teks asli untuk ditulis ulang
                // Menulis ulang biasanya tidak butuh video, tapi butuh panduan
                payload.instruction = input.description;
                break;

            case 3: // Membaca
                payload.type = 'reading_comprehension';
                payload.reading_text = input.content_text;
                payload.illustration_image = input.media_url; // Gambar ilustrasi

                // FITUR AI VOICE:
                // Jika metode membaca, kita bisa aktifkan flag agar backend
                // men-generate audio dari teks (Text-to-Speech)
                payload.is_voice_generated = true;
                break;

            case 4: // Mengurut Kata (Level 3)
                payload.type = 'jumbled_words';
                payload.sentence = input.content_text; // Kalimat yang akan diacak
                payload.clue_image = input.media_url;
                break;

            case 5: // Menebak Cepat (Level 3)
                payload.type = 'flash_card';
                payload.question = input.description;
                payload.answer = input.content_text;
                payload.image = input.media_url;
                break;

            default:
                payload.type = 'general';
                payload.content = input.content_text;
                payload.attachment = input.media_url;
        }

        return payload;
    };

    return {
        isLoading,
        savedMaterials,
        saveGeneratedMaterial
    };
});