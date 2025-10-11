<template>
    <div class="container">
        <h1>Text-to-Speech Game</h1>
        <p>Klik tombol "Play" untuk mendengar kata, atau "Random" untuk mengganti kata-kata.</p>

        <div id="wordList">
            <div v-for="(word, index) in currentWords" :key="word" class="word-item">
                <span>{{ index + 1 }}. {{ word }}</span>
                <button @click="playWord(word)">Play</button>
            </div>
        </div>

        <button id="randomButton" @click="generateRandomWords">Random</button>

        <p id="loading">{{ loadingMessage }}</p>
    </div>
</template>

<script setup>
import api from '@/utils/api';
import { ref, onMounted } from 'vue';

// --- State ---
// Daftar kata-kata utama (tidak perlu reaktif karena tidak berubah)
const words = [
    "Apel", "Bola", "Kucing", "Bunga", "Meja",
    "Buku", "Pohon", "Langit", "Rumah", "Mobil",
    "Sungai", "Bulan", "Matahari", "Jalan", "Taman"
];

// State reaktif untuk menyimpan 5 kata yang ditampilkan dan pesan loading
const currentWords = ref([]);
const loadingMessage = ref("");

// --- Functions ---

// Fungsi untuk menghasilkan 5 kata acak
const generateRandomWords = () => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    // Update state reaktif, Vue akan otomatis memperbarui UI
    currentWords.value = shuffled.slice(0, 5);
};

// Fungsi untuk memutar audio dari teks
const playWord = async (text) => {
    // Update state loading, UI akan otomatis menampilkan pesan ini
    loadingMessage.value = `Mengonversi "${text}" ke suara...`;
    try {
        const result = ref()
        await api.post('/ai/tts', {
            text: text
        }).then((res) => {
            result.value = res.data.audioContent
        })

        // const result = await response.json();
        // loadingMessage.value = ""; // Hapus pesan loading setelah selesai

        // if (result.error) {
        //     console.error('Error dari server:', result.error);
        //     loadingMessage.value = `Error: ${result.error}`;
        //     return;
        // }

        // Logika untuk memutar audio tetap sama
        const audio = new Audio(`data:audio/mp3;base64,${result.audioContent}`);
        audio.play();

    } catch (error) {
        loadingMessage.value = "Error: Tidak dapat terhubung ke server.";
        console.error('Error di frontend:', error);
    }
};

// --- Lifecycle Hook ---
// Panggil fungsi ini saat komponen pertama kali dimuat di halaman
onMounted(() => {
    generateRandomWords();
});
</script>

<style scoped>
/* Semua CSS dari file asli bisa langsung disalin ke sini */
/* 'scoped' berarti gaya ini hanya berlaku untuk komponen ini saja */
.container {
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
}

#wordList {
    margin: 20px auto;
    max-width: 600px;
}

.word-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 10px 20px;
    margin: 10px 0;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.word-item span {
    font-size: 20px;
    color: #333;
    font-weight: bold;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
}

button:hover {
    background-color: #0056b3;
}

#randomButton {
    background-color: #28a745;
    margin-top: 20px;
}

#randomButton:hover {
    background-color: #218838;
}

#loading {
    color: gray;
    font-size: 16px;
    margin-top: 10px;
}
</style>