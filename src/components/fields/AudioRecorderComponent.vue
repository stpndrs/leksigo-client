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
            mediaRecorder.value = new MediaRecorder(stream);

            mediaRecorder.value.ondataavailable = (event) => {
                audioChunks.value.push(event.data);
            };

            mediaRecorder.value.onstop = () => {
                const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' });
                const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, { type: 'audio/wav' });
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
        <button @click="toggleRecording" :class="{ 'is-recording': isRecording }">
            {{ isRecording ? 'Stop Recording' : 'Start Recording' }}
        </button>
        <div v-if="audioUrl" class="audio-preview">
            <p>Hasil Rekaman:</p>
            <audio :src="audioUrl" controls></audio>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.audio-recorder {
    button {
        padding: 10px 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;

        &.is-recording {
            background-color: #ff4136;
            color: white;
        }
    }

    .audio-preview {
        margin-top: 15px;
    }
}
</style>