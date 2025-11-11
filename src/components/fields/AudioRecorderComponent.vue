<script setup>
import { ref } from 'vue';

const emit = defineEmits(['update:modelValue']);

const isRecording = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const audioUrl = ref(null);

const toggleRecording = async () => {
    if (isRecording.value) {
        // Stop recording
        mediaRecorder.value.stop();
        isRecording.value = false;
    } else {
        // Start recording
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.value = new MediaRecorder(stream, { mimeType: 'audio/webm' }); // Gunakan webm/opus

            mediaRecorder.value.ondataavailable = (event) => {
                audioChunks.value.push(event.data);
            };

            mediaRecorder.value.onstop = () => {
                // Ubah type ke webm
                const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
                // Beri nama file yang benar
                const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
                audioUrl.value = URL.createObjectURL(audioBlob);
                emit('update:modelValue', audioFile);
                audioChunks.value = [];
                // Matikan track mikrofon setelah selesai
                stream.getTracks().forEach(track => track.stop());
            };

            audioChunks.value = [];
            audioUrl.value = null;
            emit('update:modelValue', null);
            mediaRecorder.value.start();
            isRecording.value = true;
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Tidak bisa mengakses mikrofon. Pastikan Anda memberikan izin.");
        }
    }
};
</script>

<template>
        <div class="audio-recorder">
                <button @click="toggleRecording" :class="['recorder-btn', { 'is-recording': isRecording }]">
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z" />
            </svg>
                        <span class="text">{{ isRecording ? 'Stop Merekam' : 'Mulai Merekam' }}</span>
                    </button>

                <div v-if="audioUrl" class="audio-preview">
                        <p>Hasil Rekaman:</p>
                        <audio :src="audioUrl" controls></audio>
                    </div>
            </div>
</template>

<style lang="scss" scoped>
// Tentukan warna utama (biru) dan warna stop (merah)
// Saya gunakan variabel --Secondary-900 (biru) dan --Danger-900 (merah)
// yang sepertinya Anda gunakan di proyek.
$record-color: var(--Secondary-900, #007bff);
$stop-color: var(--Danger-900, #dc3545);
$text-color: var(--Neutral-700, #444);

.recorder-btn {
    // Layouting: Ikon + Teks
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px; // Jarak antara ikon dan teks

    // Bentuk dan Border (sesuai gambar)
    border: 2px solid $record-color;
    border-radius: 50px; // Sangat bulat
    padding: 10px 24px;

    // Warna (sesuai gambar)
    background-color: var(--White, #ffffff);
    color: $record-color;

    // Teks
    font-size: 1.1rem;
    font-weight: 600;

    // Lain-lain
    cursor: pointer;
    transition: all 0.2s ease;

    .icon {
        width: 1.3em; // Ukuran ikon (relatif ke font-size)
        height: 1.3em;
        fill: currentColor; // Otomatis mewarisi warna teks (biru)
    }

    .text {
        line-height: 1; // Agar teks rapi
    }

    // Efek hover (opsional, tapi bagus)
    &:hover {
        background-color: lighten($record-color, 40%);
    }

    // --- STATE SAAT MEREKAM ---
    &.is-recording {
        border-color: $stop-color;
        background-color: $stop-color;
        color: var(--White, #ffffff);

        .icon {
            // Animasi berkedip saat merekam
            animation: pulse 1.5s infinite;
        }

        &:hover {
            background-color: darken($stop-color, 10%);
        }
    }
}

// Animasi kedip untuk ikon
@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

// Pratinjau audio
.audio-preview {
    margin-top: 20px;

    p {
        font-size: 0.9em;
        color: $text-color;
        margin-bottom: 5px;
    }

    audio {
        width: 100%;
        max-width: 350px;
    }
}
</style>