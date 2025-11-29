<script setup>
import { ref, onMounted, defineProps, defineEmits, watch, defineExpose } from 'vue';
import ButtonComponent from '../buttons/ButtonComponent.vue';
import { triggerToast } from '@/utils/toast';

// Definisikan props untuk v-model:file. Ini akan menampung Base64 string.
const props = defineProps({
    file: {
        type: String,
        default: null,
    },
});

// Definisikan emits untuk v-model:file
const emit = defineEmits(['update:file']);

// --- Variabel Reaktif & Resolusi ---
const canvasRef = ref(null);
const ctx = ref(null);
const isDrawing = ref(false);

// Resolusi internal canvas (800x400) - Rasio 2:1
const canvasWidth = 800;
const canvasHeight = 400;

// Variabel lokal untuk menampilkan pratinjau
const localFile = ref(props.file);

// --- Konfigurasi Drawing ---
const strokeStyle = '#000000';
const lineWidth = 5;

// --- Lifecycle Hook ---
onMounted(() => {
    if (canvasRef.value) {
        ctx.value = canvasRef.value.getContext('2d');

        // Atur properti goresan
        ctx.value.strokeStyle = strokeStyle;
        ctx.value.lineWidth = lineWidth;
        ctx.value.lineCap = 'round';
        ctx.value.fillStyle = '#FFFFFF';
        ctx.value.fillRect(0, 0, canvasWidth, canvasHeight);

        // Muat gambar Base64 yang sudah ada
        if (props.file) {
            loadBase64Image(props.file);
        }
    }
});

// --- Watcher untuk memuat data Base64 baru ---
// Dipicu saat berpindah soal untuk memuat jawaban lama.
watch(() => props.file, (newVal) => {
    localFile.value = newVal;
    if (newVal) {
        loadBase64Image(newVal);
    } else {
        // Jika Base64 dihapus (soal kosong), bersihkan canvas
        clearCanvas(false);
    }
});

// --- Fungsi Penggambar (Drawing Logic) ---

/**
 * Mendapatkan posisi kursor relatif terhadap canvas dan mengatasi distorsi.
 * Solusi untuk goresan miring/mereng.
 */
const getMousePos = (event) => {
    const rect = canvasRef.value.getBoundingClientRect();

    // 1. Hitung faktor skala (Resolusi Internal / Dimensi Tampilan CSS)
    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;

    // 2. Terapkan faktor skala ke posisi kursor
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    return { x, y };
};

/**
 * Memulai proses menggambar. Menggunakan PointerEvent untuk mendukung sentuhan dan mouse.
 * @param {PointerEvent} event 
 */
const startDrawing = (event) => {
    isDrawing.value = true;
    event.preventDefault(); // Mencegah scrolling saat sentuhan
    const pos = getMousePos(event);

    ctx.value.beginPath();
    ctx.value.moveTo(pos.x, pos.y);
};

/**
 * Melanjutkan menggambar.
 * @param {PointerEvent} event 
 */
const draw = (event) => {
    if (!isDrawing.value) return;
    event.preventDefault();

    const pos = getMousePos(event);

    ctx.value.lineTo(pos.x, pos.y);
    ctx.value.stroke();

    // Hapus Base64 yang sudah ada saat pengguna mulai menggambar ulang
    localFile.value = null;
    emit('update:file', null);
};

/**
 * Menghentikan proses menggambar.
 */
const stopDrawing = () => {
    isDrawing.value = false;
    if (ctx.value) {
        ctx.value.closePath();
    }
};

// --- Fungsi Kontrol (Dipanggil dari Induk) ---

/**
 * Menghapus semua gambar di canvas.
 * @param {boolean} shouldEmit - Apakah harus meng-emit null ke parent. 
 */
const clearCanvas = (shouldEmit = true) => {
    if (ctx.value && canvasRef.value) {
        ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
        ctx.value.fillStyle = '#FFFFFF';
        ctx.value.fillRect(0, 0, canvasWidth, canvasHeight);
        localFile.value = '';
        if (shouldEmit) {
            emit('update:file', null);
            triggerToast('Canvas telah direset.', 'info');
        }
    }
};

/**
 * Menyimpan konten canvas sebagai string Base64 dan meng-emit ke parent.
 * FUNGSI INI HANYA DIPANGGIL SAAT TOMBOL 'SIMPAN JAWABAN' DI INDUK DIKLIK.
 * @returns {boolean} True jika berhasil menyimpan, false jika canvas kosong.
 */
const saveAsBase64 = () => {
    if (canvasRef.value) {
        // Cek apakah canvas kosong (memeriksa semua piksel)
        const imageData = ctx.value.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height).data;
        const isCanvasEmpty = !imageData.some(channel => channel !== 0);

        if (isCanvasEmpty && !props.file) {
            // Jangan simpan jika kosong dan tidak ada jawaban lama
            triggerToast('Gambar kosong. Gambar terlebih dahulu sebelum menyimpan!', 'info')
            return false;
        }

        const base64 = canvasRef.value.toDataURL('image/png');
        localFile.value = base64;
        emit('update:file', base64);
        return true;
    }
    return false;
};

/**
 * Memuat Base64 ke canvas untuk menampilkan jawaban lama.
 */
const loadBase64Image = (base64) => {
    if (!base64 || !canvasRef.value || !ctx.value) return;

    const img = new Image();
    img.onload = () => {
        ctx.value.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.value.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        localFile.value = base64;
    };
    img.src = base64;
};

// --- EXPOSE FUNGSI KE PARENT ---
// Memungkinkan parent component (QuizView.vue) memanggil fungsi save/clear.
defineExpose({
    save: saveAsBase64,
    clear: clearCanvas
});
</script>

<template>
    <div class="drawing-container">
        <canvas ref="canvasRef" @pointerdown="startDrawing" @pointermove="draw" @pointerup="stopDrawing"
            @pointerleave="stopDrawing" :width="canvasWidth" :height="canvasHeight"></canvas>
        <div class="controls">
            <ButtonComponent @click="clearCanvas()" label="Ulangi menggambar" display="border" size="small"
                class="secondary" />
            <ButtonComponent @click="saveAsBase64()" label="Simpan gambar" size="small" class="secondary" />
        </div>

        <div v-if="localFile" class="output">
            <h3>Pratinjau Jawaban Canvas:</h3>

            <img :src="localFile" alt="Hasil Gambar" />
        </div>
    </div>
</template>

<style scoped>
.drawing-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

canvas {
    /* background: white; */
    border-radius: 10px;
    border: 1px solid var(--Neutral-300);
    cursor: crosshair;
    width: 100%;
    /* Penting: agar mengikuti lebar parent */
    /* PERBAIKAN DISTORSI: Memaksa rasio tampilan CSS (lebar:tinggi) sama dengan rasio internal (800:400 atau 2:1) */
    aspect-ratio: 2 / 1;
    touch-action: none;
    /* Mencegah scrolling saat menggambar di perangkat sentuh */
}

.output {
    width: 100%;
    max-width: 400px;
    margin-top: 15px;
    padding: 15px;
    border: 1px solid var(--Neutral-300);
    background-color: var(--Neutral-50);
    border-radius: 8px;
}

.output img {
    max-width: 100%;
    height: auto;
    border: 1px solid #ccc;
    margin-top: 10px;
    display: block;
    border-radius: 4px;
}
</style>