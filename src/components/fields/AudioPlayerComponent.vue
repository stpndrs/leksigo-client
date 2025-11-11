<script setup>
import { base64ToBlob } from '@/helpers/base64ToBlob'; // Asumsi helper ini ada
import ai from '@/utils/ai';
import api from '@/utils/api'; // Asumsi API util Anda
import { ref, watch, onBeforeUnmount } from 'vue';

// === PROPS ===
const props = defineProps({
    text: {
        type: String,
        required: true
    },
    autoplay: {
        type: Boolean,
        default: true
    },
    displayStyle: {
        type: String,
        default: 'player',
        validator: (value) => ['player', 'text'].includes(value)
    }
});

// === STATE ===
const isLoading = ref(false);
const audioUrl = ref(null);
const errorMsg = ref(null);
const audioRef = ref(null); // Ref untuk elemen <audio>

// State baru untuk custom player
const isPlaying = ref(false);
const progressPercent = ref(0);

// === FUNGSI API ===
async function fetchAudioFromAI(textToSpeech) {
    try {
        const response = await ai.post('/text-to-speech', { text: textToSpeech });
        const base64Audio = response.data.audioContent;
        if (!base64Audio) {
            throw new Error("API tidak mengembalikan audioContent.");
        }
        const audioBlob = base64ToBlob(base64Audio, 'audio/mpeg');
        return audioBlob;
    } catch (error) {
        console.error("Gagal saat memanggil API TTS:", error);
        throw error;
    }
}

// === WATCHER (untuk memuat audio) ===
watch(() => props.text, async (newText) => {
    if (!newText) return;
    isLoading.value = true;
    errorMsg.value = null;
    // Hapus URL blob lama jika ada
    if (audioUrl.value) {
        URL.revokeObjectURL(audioUrl.value);
    }
    try {
        const audioBlob = await fetchAudioFromAI(newText);
        audioUrl.value = URL.createObjectURL(audioBlob);
        // Reset state player
        isPlaying.value = false;
        progressPercent.value = 0;
    } catch (err) {
        console.error("Gagal mengambil audio dari AI:", err);
        errorMsg.value = "Gagal memuat audio.";
    } finally {
        isLoading.value = false;
    }
}, { immediate: true });

// === METHODS (untuk mengontrol player) ===
function togglePlayPause() {
    if (!audioRef.value) return;
    if (audioRef.value.paused) {
        audioRef.value.play();
    } else {
        audioRef.value.pause();
    }
}

// Fungsi untuk seek (pindah) audio saat progress bar diklik
function handleSeek(event) {
    if (!audioRef.value || !audioRef.value.duration) return;

    const bar = event.currentTarget;
    // Dapatkan posisi klik X relatif terhadap elemen
    const clickX = event.offsetX;
    const barWidth = bar.clientWidth;

    // Hitung waktu baru
    const newTime = (clickX / barWidth) * audioRef.value.duration;
    audioRef.value.currentTime = newTime;
}

// === HANDLER EVENT AUDIO (untuk sinkronisasi UI) ===
function onPlay() { isPlaying.value = true; }
function onPause() { isPlaying.value = false; }
function onEnded() {
    isPlaying.value = false;
    progressPercent.value = 0; // Reset bar saat selesai
}
function onTimeUpdate() {
    if (!audioRef.value) return;
    const { currentTime, duration } = audioRef.value;
    if (duration > 0) {
        progressPercent.value = (currentTime / duration) * 100;
    } else {
        progressPercent.value = 0;
    }
}

// Pastikan untuk membersihkan ObjectURL saat komponen dihancurkan
onBeforeUnmount(() => {
    if (audioUrl.value) {
        URL.revokeObjectURL(audioUrl.value);
    }
});
</script>

<template>
    <div class="tts-component">
        <div v-if="isLoading" class="status-text">Memuat audio...</div>

        <div v-if="errorMsg" class="error-text">{{ errorMsg }}</div>

        <div v-if="audioUrl" class="audio-container">

            <audio ref="audioRef" :src="audioUrl" :autoplay="props.autoplay" @play="onPlay" @pause="onPause"
                @ended="onEnded" @timeupdate="onTimeUpdate" style="display: none;"></audio>

            <div v-if="props.displayStyle === 'player'" class="custom-player">
                <button @click="togglePlayPause" class="play-btn">
                    <span v-if="!isPlaying" class="icon-play">►</span>
                    <span v-else class="icon-pause">❚❚</span>
                </button>

                <div class="progress-track" @click="handleSeek">
                    <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
                </div>
            </div>

            <div v-if="props.displayStyle === 'text'" class="tts-text-button" @click="togglePlayPause"
                title="Putar audio">
                <span class="text">{{ props.text }}</span>
                <span class="icon">🔊</span>
            </div>

        </div>
    </div>
</template>

<style scoped>
/* === STYLE 1: CUSTOM PLAYER (Mirip Gambar) === */
.custom-player {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    /* Border dan padding untuk meniru container */
    border: 1.5px solid var(--Secondary-900);
    border-radius: 50px;
    /* Sangat bulat */
    padding: 6px 10px;
    width: 100%;
    max-width: 350px;
    background: #fff;
}

.play-btn {
    /* Tombol bulat biru */
    background: var(--Secondary-900);
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    /* Agar tidak gepeng */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
}

.icon-play {
    padding-left: 3px;
    /* Tombol play agar terlihat di tengah */
}

.icon-pause {
    font-size: 12px;
    /* Ikon pause agar seimbang */
}

/* Progress bar container */
.progress-track {
    flex-grow: 1;
    /* Mengisi sisa ruang */
    margin-left: 10px;
    height: 6px;
    /* Track di gambar tidak terlihat, jadi kita buat transparan/tipis */
    background-color: #f0f0f0;
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    /* Memastikan 'fill' tidak keluar */
}

/* Garis biru yang bergerak */
.progress-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background-color: var(--Secondary-900);
    /* Biru cerah */
    border-radius: 3px;
    /* width diatur oleh JS via :style */
}

/* === STYLE 2: TEXT BUTTON (dari sebelumnya) === */
.tts-text-button {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
}

.tts-text-button .text {
    font-size: 65px;
    font-weight: 700;
    color: var(--Secondary-900);
    font-family: 'OpenDyslexic';
}

.tts-text-button .icon {
    font-size: 1.8rem;
    color: var(--Secondary-900);
    user-select: none;
}

/* Teks status */
.status-text {
    color: #888;
}

.error-text {
    color: #d9534f;
}

/* --- RESPONSIVE --- */

/* Target Tablet */
@media (max-width: 768px) {
    .tts-text-button .text {
        font-size: 40px;
        /* <-- Kecilkan dari 65px */
    }

    .tts-text-button .icon {
        font-size: 1.5rem;
        /* <-- Kecilkan ikon */
    }
}

/* Target Ponsel */
@media (max-width: 576px) {
    .custom-player {
        padding: 4px 8px;
        /* <-- Buat lebih ramping */
    }

    .play-btn {
        width: 28px;
        height: 28px;
        font-size: 12px;
    }

    .icon-pause {
        font-size: 10px;
    }

    .progress-track {
        height: 5px;
    }

    .tts-text-button .text {
        font-size: 32px;
        /* <-- Kecilkan lagi */
        line-height: 1.2;
    }

    .tts-text-button .icon {
        font-size: 1.2rem;
    }
}
</style>