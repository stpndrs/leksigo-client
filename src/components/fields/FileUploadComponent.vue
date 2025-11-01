<script setup>
import { ref, watch } from 'vue';

// --- Props & Emits ---
const props = defineProps({
    modelValue: {
        type: [File, Array, null], // <-- DIUBAH: Izinkan Array
        default: null
    },
    infoText: {
        type: String,
        default: 'Upload file gambar jawaban'
    },
    id: {
        type: String,
        required: true
    },
    isMultiple: {
        type: Boolean,
        default: false
    }
});
const emit = defineEmits(['update:modelValue']);

// --- State Internal ---
const fileMessage = ref('Drag & Drop your files or <span class="file-browse">Browse</span>');
const fileInput = ref(null);
const isDragging = ref(false);

// --- Logika Inti ---

// Helper function baru untuk menghindari duplikasi kode
const processFiles = (files) => {
    if (!files || files.length === 0) {
        // Tidak ada file, reset
        emit('update:modelValue', props.isMultiple ? [] : null);
        return;
    }

    // <-- LOGIKA BARU DI SINI
    if (props.isMultiple) {
        // Jika multiple, emit sebuah Array dari FileList
        emit('update:modelValue', Array.from(files));
    } else {
        // Jika single, emit hanya file pertama
        emit('update:modelValue', files[0]);
    }
};

const handleFileChange = (event) => {
    processFiles(event.target.files); // <-- DIUBAH
};

const handleDrop = (event) => {
    isDragging.value = false;
    const files = event.dataTransfer.files;

    // Penting: Masukkan file yang di-drop ke dalam elemen input
    if (fileInput.value) {
        fileInput.value.files = files;
    }

    processFiles(files); // <-- DIUBAH
};

// --- Reaktivitas & Kontrol dari Induk ---
// Watcher ini adalah kunci untuk mereset dan menampilkan jawaban yang ada
watch(() => props.modelValue, (newValue) => {
    const defaultMessage = 'Drag & Drop your files or <span class="file-browse">Browse</span>';

    // <-- LOGIKA WATCHER BARU
    if (newValue && newValue instanceof File) {
        // 1. Single file (mode single)
        fileMessage.value = newValue.name;
    } else if (Array.isArray(newValue) && newValue.length > 0) {
        // 2. Multiple files (mode multiple)
        if (newValue.length === 1) {
            fileMessage.value = newValue[0].name;
        } else {
            fileMessage.value = `${newValue.length} files selected`;
        }
    } else {
        // 3. Reset (null atau array kosong)
        fileMessage.value = defaultMessage;
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
        <input :id="id" type="file" class="visually-hidden" ref="fileInput" @change="handleFileChange"
            :multiple="props.isMultiple">
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