<script setup>
import { base64ToBlob } from '@/helpers/base64ToBlob';
import api from '@/utils/api';
import { ref, watch } from 'vue';

const props = defineProps({
    text: {
        type: String,
        required: true
    }
});

const isLoading = ref(false);
const audioUrl = ref(null);
const errorMsg = ref(null);

// GANTI DENGAN FUNGSI API TEXT-TO-SPEECH ANDA
async function fetchAudioFromAI(textToSpeak) {
    try {
        // 1. Panggil API Anda dan tunggu responsnya
        const response = await api.post('/ai/tts', {
            text: textToSpeak,
        });

        // 2. Ambil string Base64 dari respons
        const base64Audio = response.data.audioContent;

        // Periksa apakah data ada
        if (!base64Audio) {
            throw new Error("API tidak mengembalikan audioContent.");
        }

        // 3. Ubah string Base64 menjadi Blob menggunakan helper kita
        //    Respons Anda terlihat seperti MP3, jadi kita gunakan 'audio/mpeg'
        const audioBlob = base64ToBlob(base64Audio, 'audio/mpeg');

        // 4. Kembalikan Blob yang sudah jadi
        return audioBlob;

    } catch (error) {
        console.error("Gagal saat memanggil API TTS:", error);
        // Lempar error lagi agar bisa ditangkap oleh blok catch di watcher
        throw error;
    }
}


watch(() => props.text, async (newText) => {
    if (!newText) return;
    isLoading.value = true;
    errorMsg.value = null;
    audioUrl.value = null;
    try {
        const audioBlob = await fetchAudioFromAI(newText);
        audioUrl.value = URL.createObjectURL(audioBlob);
    } catch (err) {
        console.error("Gagal mengambil audio dari AI:", err);
        errorMsg.value = "Gagal memuat audio.";
    } finally {
        isLoading.value = false;
    }
}, { immediate: true });
</script>

<template>
    <div class="audio-player">
        <div v-if="isLoading">Memuat audio...</div>
        <div v-if="errorMsg">{{ errorMsg }}</div>
        <audio v-if="audioUrl" :src="audioUrl" controls autoplay></audio>
    </div>
</template>