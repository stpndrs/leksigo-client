<script setup>
import { ref, watch, computed } from 'vue';

// --- Props & Emits ---
const props = defineProps({
    modelValue: {
        type: File,
        default: null
    },
    infoText: {
        type: String,
        default: 'Upload file gambar jawaban'
    },
    // Prop baru untuk memastikan ID unik, penting untuk label
    id: {
        type: String,
        required: true
    }
});
const emit = defineEmits(['update:modelValue']);

// --- State Internal ---
const fileMessage = ref('Drag & Drop your files or <span class="file-browse">Browse</span>');
const fileInput = ref(null);
const isDragging = ref(false);

// --- Logika Inti ---
const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        emit('update:modelValue', files[0]);
    } else {
        emit('update:modelValue', null);
    }
};

const handleDrop = (event) => {
    isDragging.value = false;
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
        // Penting: Masukkan file yang di-drop ke dalam elemen input
        fileInput.value.files = files;
        emit('update:modelValue', files[0]);
    }
};

// --- Reaktivitas & Kontrol dari Induk ---
// Watcher ini adalah kunci untuk mereset dan menampilkan jawaban yang ada
watch(() => props.modelValue, (newFile) => {
    if (newFile && newFile instanceof File) {
        fileMessage.value = newFile.name;
    } else {
        fileMessage.value = 'Drag & Drop your files or <span class="file-browse">Browse</span>';
        if (fileInput.value) {
            fileInput.value.value = null;
        }
    }
}, { immediate: true });

// --- Event Handlers untuk UI ---
const handleDragEnter = () => { isDragging.value = true; };
const handleDragLeave = () => { isDragging.value = false; };
</script>

<template>
    <div class="file-upload-wrapper">
        <label :for="id" class="file-drop-area" :class="{ 'is-dragging': isDragging }"
            @dragenter.prevent="handleDragEnter" @dragover.prevent @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop">
            <span class="file-msg" v-html="fileMessage"></span>
        </label>
        <input :id="id" type="file" class="visually-hidden" ref="fileInput" @change="handleFileChange">
        <p class="file-info">{{ infoText }}</p>
    </div>
</template>



<style lang="scss" scoped>
// Variabel untuk memudahkan perubahan warna
$border-color: #e0e0e0;
$border-dashed-color: #c7c7c7;
$text-color-light: #888;
$text-color-dark: #555;
$brand-color: #007bff; // Warna biru untuk "Browse"
$background-color: #f9f9f9;
$font-family: sans-serif;

.file-upload-wrapper {
    font-family: $font-family;
    width: 100%;

    // Area utama untuk drag & drop
    .file-drop-area {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 40px 20px;
        background-color: $background-color;
        border: 2px dashed $border-dashed-color;
        border-radius: 8px;
        cursor: pointer;
        transition: border-color 0.2s, background-color 0.2s;

        // 🎨 GAYA BARU: Saat pengguna menyeret file ke atas area ini
        &.is-dragging {
            border-color: $brand-color; // Ganti warna border menjadi warna brand
            background-color: #f0f6ff; // Beri sedikit warna latar
        }

        &:hover {
            border-color: $brand-color;
            background-color: #f0f6ff;
        }
    }

    // Pesan teks di dalam area drop
    .file-msg {
        color: $text-color-light;
        font-size: 16px;
    }

    // Teks "Browse" yang dibuat seperti link
    .file-browse {
        color: $brand-color;
        font-weight: bold;
        text-decoration: underline;
    }

    // Info tambahan di bawah area drop
    .file-info {
        font-size: 12px;
        color: $text-color-light;
        margin-top: 8px;
        text-align: left;
    }

    // Kelas untuk menyembunyikan input file asli secara visual
    // tapi tetap bisa diakses oleh keyboard & screen reader (praktik terbaik)
    .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
}
</style>