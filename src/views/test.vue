<template>
    <div class="speech-game-container">
        <h1>Speech Game</h1>
        <p>Baca teks di bawah ini dengan keras:</p>

        <div id="textToRead">{{ currentText }}</div>

        <button @click="startRecording" :disabled="isRecording">Mulai Rekam</button>
        <button @click="stopRecording" :disabled="!isRecording">Stop Rekam</button>

        <p id="result" :class="resultClass">{{ resultMessage }}</p>
        <p id="transcription">{{ transcribedText }}</p>
        <p id="loading">{{ loadingMessage }}</p>
    </div>
</template>

<script setup>
import api from '@/utils/api';
import { ref, computed, onMounted } from 'vue';

// --- State Reaktif ---
const texts = ["Apel merah", "Bola biru", "Kucing lucu", "Bunga mawar"];
const currentText = ref("");
const transcribedText = ref("");
const resultMessage = ref("");
const loadingMessage = ref("");
const isRecording = ref(false);
const isCorrect = ref(null); // null: belum ada hasil, true: benar, false: salah

// --- Variabel non-reaktif ---
let mediaRecorder = null;
let audioChunks = [];

// --- Computed Property ---
// Menentukan kelas CSS berdasarkan hasil untuk mengubah warna teks
const resultClass = computed(() => {
    if (isCorrect.value === true) return 'correct';
    if (isCorrect.value === false) return 'incorrect';
    return '';
});

// --- Methods (sekarang menjadi fungsi biasa) ---

// 1. Memilih teks acak dan mereset state
const setRandomText = () => {
    currentText.value = texts[Math.floor(Math.random() * texts.length)];
    transcribedText.value = "";
    resultMessage.value = "";
    loadingMessage.value = "";
    isCorrect.value = null;
};

// 2. Memulai proses perekaman
const startRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            loadingMessage.value = "Mengolah audio...";
            sendToSpeechToText(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        isRecording.value = true;
        loadingMessage.value = "Merekam...";

    } catch (error) {
        resultMessage.value = "Error: Tidak dapat mengakses mikrofon.";
        loadingMessage.value = "";
        console.error('Error akses mikrofon:', error);
    }
};

// 3. Menghentikan perekaman
const stopRecording = () => {
    if (mediaRecorder) {
        mediaRecorder.stop();
    }
    isRecording.value = false;
};

// 4. Mengirim audio ke server backend
const sendToSpeechToText = (audioBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
        const base64Audio = reader.result.split(",")[1];
        loadingMessage.value = "Mengirim ke server...";

        try {
            const result = ref()
            const response = await api.post('/ai/stt', {
                audio: base64Audio
            }).then((res) => {
                result = res
                loadingMessage.value = "";
            }).catch((err) => {
                // resultMessage.value = `Error: ${err.response.data.errors}`;
                isCorrect.value = false;
            })

            const receivedTranscription = result.transcription || '';
            compareText(receivedTranscription);

        } catch (error) {
            loadingMessage.value = "";
            resultMessage.value = "Error: Tidak dapat terhubung ke server.";
            isCorrect.value = false;
            console.error('Error di frontend:', error);
        }
    };
};

// 5. Membandingkan hasil dan memperbarui UI
const compareText = (transcribed) => {
    transcribedText.value = transcribed ? `Kamu bilang: "${transcribed}"` : "Tidak ada suara terdeteksi.";

    if (transcribed.toLowerCase().trim() === currentText.value.toLowerCase().trim()) {
        resultMessage.value = "Benar! Kamu membaca dengan tepat!";
        isCorrect.value = true;
    } else {
        resultMessage.value = "Salah. Coba lagi!";
        isCorrect.value = false;
    }

    setTimeout(setRandomText, 2000);
};

// --- Lifecycle Hook ---
// Panggil setRandomText saat komponen pertama kali dimuat
onMounted(() => {
    setRandomText();
});
</script>

<style scoped>
/* Gaya CSS tetap sama persis, tidak perlu diubah */
.speech-game-container {
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
    background-color: #f0f0f0;
}

#textToRead {
    font-size: 28px;
    margin: 20px;
    font-weight: bold;
    color: #333;
}

#result {
    font-size: 20px;
    margin-top: 20px;
    font-weight: bold;
}

/* Kelas dinamis untuk warna hasil */
.correct {
    color: green;
}

.incorrect {
    color: red;
}

#transcription {
    color: blue;
    font-size: 20px;
    margin-top: 10px;
}

#loading {
    color: gray;
    font-size: 16px;
    margin-top: 10px;
}

button {
    padding: 12px 24px;
    font-size: 16px;
    margin: 10px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

button:hover:not(:disabled) {
    background-color: #0056b3;
}
</style>