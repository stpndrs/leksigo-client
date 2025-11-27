<script setup>
import { ref, watch, onUnmounted } from 'vue';

// --- Props & Emits ---
const props = defineProps({
    modelValue: {
        type: [File, Array, null], // File object atau Array of File objects
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
    },
    accept: {
        type: String,
        default: 'image/*' // Defaultkan ke gambar untuk preview
    }
});
const emit = defineEmits(['update:modelValue']);

// --- State Internal ---
const fileMessage = ref('Drag & Drop your files or <span class="file-browse">Browse</span>');
const fileInput = ref(null);
const isDragging = ref(false);

// --- STATE BARU UNTUK PREVIEW ---
const imagePreviews = ref([]);
// ---------------------------------

// --- Cleanup Object URLs ---
// Penting: Object URLs harus dicabut (revoke) untuk mencegah kebocoran memori.
const cleanupPreviews = () => {
    imagePreviews.value.forEach(p => {
        // Cek jika pratinjau adalah URL yang dibuat, bukan Base64 dari modelValue yang lama (jika ada)
        if (p.url.startsWith('blob:')) {
            URL.revokeObjectURL(p.url);
        }
    });
    imagePreviews.value = [];
};

onUnmounted(() => {
    cleanupPreviews();
});

// --- FUNGSI BARU: GENERATE PREVIEWS ---
const generatePreviews = (files) => {
    cleanupPreviews(); // Bersihkan pratinjau lama

    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
        // Hanya buat pratinjau untuk file gambar
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            imagePreviews.value.push({
                name: file.name,
                url: url
            });
        }
    });
};

// --- Logika Inti ---

const processFiles = (files) => {
    if (!files || files.length === 0) {
        emit('update:modelValue', props.isMultiple ? [] : null);
        cleanupPreviews();
        return;
    }

    // 1. Generate previews
    generatePreviews(files);

    // 2. Emit nilai ke parent
    if (props.isMultiple) {
        emit('update:modelValue', Array.from(files));
    } else {
        emit('update:modelValue', files[0]);
    }
};

const handleFileChange = (event) => {
    processFiles(event.target.files);
};

const handleDrop = (event) => {
    isDragging.value = false;
    const files = event.dataTransfer.files;

    if (fileInput.value) {
        // Assign file yang di-drop ke input
        fileInput.value.files = files;
    }

    processFiles(files);
};

// --- Reaktivitas & Kontrol dari Induk ---
watch(() => props.modelValue, (newValue) => {
    const defaultMessage = 'Drag & Drop your files or <span class="file-browse">Browse</span>';

    // 1. Tentukan files/array of files yang sebenarnya
    let actualFiles = null;
    if (newValue instanceof File) {
        actualFiles = [newValue];
    } else if (Array.isArray(newValue)) {
        actualFiles = newValue;
    }

    // 2. Atur pesan berdasarkan nilai
    if (actualFiles && actualFiles.length > 0) {
        cleanupPreviews(); // Hapus object URL lama
        // Jika file datang dari parent (misalnya, jawaban lama yang sudah tersimpan)
        // Kita hanya bisa menampilkan nama, bukan pratinjau (karena bukan Object URL/Base64)
        if (actualFiles.length === 1) {
            fileMessage.value = actualFiles[0].name || "1 file selected";
        } else {
            fileMessage.value = `${actualFiles.length} files selected`;
        }

        // Cek jika file adalah File Object dan buatkan preview baru
        const fileObjects = actualFiles.filter(f => f instanceof File);
        if (fileObjects.length > 0) {
            generatePreviews(fileObjects);
        }

    } else {
        // Reset
        fileMessage.value = defaultMessage;
        cleanupPreviews();
        if (fileInput.value) {
            fileInput.value.value = null; // Clear input
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
            :multiple="props.isMultiple" :accept="props.accept">
        <p class="file-info">{{ infoText }}</p>

        <div v-if="imagePreviews.length > 0" class="file-previews">
            <h4 class="preview-title">Pratinjau:</h4>

            <div :class="['preview-gallery', { 'is-multiple': imagePreviews.length > 1 }]">
                <div v-for="preview in imagePreviews" :key="preview.url" class="preview-item">
                    <img :src="preview.url" :alt="preview.name" />
                    <span class="preview-filename">{{ preview.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// Variabel untuk memudahkan perubahan warna
$border-color: #e0e0e0;
$border-dashed-color: #c7c7c7;
$text-color-light: #888;
$text-color-dark: #555;
$brand-color: var(--Primary-900, #007bff);
$background-color: #f9f9f9;
$font-family: 'Ubuntu Sans', sans-serif;

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
        text-align: center;

        &.is-dragging {
            border-color: $brand-color;
            background-color: #f0f6ff;
        }

        &:hover {
            border-color: $brand-color;
            background-color: #f0f6ff;
        }
    }

    .file-msg {
        color: $text-color-light;
        font-size: 16px;
        line-height: 1.4;

        :deep(.file-browse) {
            color: $brand-color;
            font-weight: bold;
            text-decoration: underline;
        }
    }

    .file-info {
        font-size: 12px;
        color: $text-color-light;
        margin-top: 8px;
        text-align: left;
    }

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

    // --- STYLE BARU UNTUK PREVIEW ---
    .file-previews {
        margin-top: 20px;
        padding: 15px;
        border: 1px solid $border-color;
        border-radius: 8px;
        background-color: white;
    }

    .preview-title {
        font-size: 14px;
        color: $text-color-dark;
        margin-bottom: 10px;
        font-weight: 600;
        border-bottom: 1px dashed $border-dashed-color;
        padding-bottom: 5px;
    }

    .preview-gallery {
        display: flex;
        gap: 15px;
        overflow-x: auto;
        padding-bottom: 5px;
        /* ruang untuk scrollbar */

        // Single file mode
        &:not(.is-multiple) {
            justify-content: center;
        }
    }

    .preview-item {
        flex-shrink: 0;
        /* agar item tidak menyusut */
        width: 100px;
        /* Ukuran pratinjau thumbnail */
        text-align: center;
    }

    .is-multiple .preview-item {
        width: 80px;
    }

    .preview-item img {
        width: 100%;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid $border-color;
        margin-bottom: 5px;
    }

    .is-multiple .preview-item img {
        height: 60px;
    }

    .preview-filename {
        display: block;
        font-size: 10px;
        color: $text-color-light;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    // --- AKHIR STYLE BARU ---
}

/* --- RESPONSIVE --- */

@media (max-width: 576px) {
    .file-upload-wrapper {
        .file-drop-area {
            padding: 25px 15px;
        }

        .file-msg {
            font-size: 14px;
        }

        .file-info {
            font-size: 11px;
        }

        .preview-item {
            width: 70px;
            /* Kecilkan di mobile */
        }

        .preview-item img {
            height: 50px;
        }
    }
}
</style>