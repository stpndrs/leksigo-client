<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import EyeIcon from '@/components/shape/EyeIcon.vue';
import { useMaterialStore } from '@/stores/GenerateMaterialStore';
import { ref, reactive, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const materialStore = useMaterialStore();
const route = useRoute();
const id = route.params.id;

// --- 1. STATE & CONFIG ---
const chatContainer = ref(null);
const isGenerating = ref(false);
const isPreviewOpen = ref(false);
const previewContent = ref(null);

const levels = ref([1, 2, 3]);

// Data Master Method (Sesuai Request)
// Level 1-2: Method 1-3
// Level 3: Method 1-5
const methodOfArray = ref([
    {
        level: 1, // Single Character
        data: [
            { label: 'Reading (Membaca)', value: 1 },
            { label: 'Writing (Menulis)', value: 2 },
            { label: 'Audio (Dikte)', value: 3 }
        ]
    },
    {
        level: 2, // Word
        data: [
            { label: 'Reading (Membaca)', value: 1 },
            { label: 'Writing (Menulis)', value: 2 },
            { label: 'Audio (Dikte)', value: 3 }
        ]
    },
    {
        level: 3, // Sentence
        data: [
            { label: 'Reading (Membaca)', value: 1 },
            { label: 'Writing (Menulis)', value: 2 },
            { label: 'Audio (Dikte)', value: 3 },
            { label: 'Ordering Sentences', value: 4 },
            { label: 'Rapid Naming', value: 5 }
        ]
    },
]);

const methodSelected = ref([]);

const form = reactive({
    level: '',
    method: '',
    description: ''
});

const messages = ref([
    {
        id: 1,
        sender: 'ai',
        type: 'intro',
        content: 'Halo! Silakan pilih Level (Character/Word/Sentence) dan Metode pembelajaran yang diinginkan.'
    }
]);

// --- 2. DUMMY DATABASE MATERI (SESUAI ATURAN BARU) ---
const mockMaterialDB = {
    // FORMAT KEY: "LEVEL-METHOD_ID"

    // ==========================================
    // LEVEL 1: SINGLE CHARACTER
    // ==========================================

    // Method 1: Reading (Produce question text that will be read by the child)
    "1-1": {
        title: "Membaca Huruf Vokal",
        text: "Baca huruf berikut dengan suara lantang:\n\n'A'\n\n'I'\n\n'U'\n\n'E'\n\n'O'",
        videoUrl: null,
        imageUrl: "https://via.placeholder.com/600x300?text=Huruf+A"
    },

    // Method 2: Writing (Produce question text the child must copy)
    "1-2": {
        title: "Menulis Huruf Konsonan",
        text: "Siapkan buku tulis, lalu salin huruf ini:\n\n'B'\n\n'D'\n\n'P'\n\n'Q'",
        videoUrl: null,
        imageUrl: "https://via.placeholder.com/600x300?text=Contoh+Tulis+B"
    },

    // Method 3: Audio (Produce question text that will be converted into audio and be written by the child)
    "1-3": {
        title: "Dikte Huruf",
        text: "Dengarkan suara, lalu tulis huruf yang kamu dengar di buku tulis.",
        tts_text: "C", // <--- INI ADALAH SCRIPT TEXT-TO-SPEECH
        videoUrl: null,
        imageUrl: null
    },

    // ==========================================
    // LEVEL 2: WORD
    // ==========================================

    // Method 1: Reading
    "2-1": {
        title: "Membaca Kata Benda",
        text: "Baca kata berikut ini dengan jelas:\n\n'BOLA'",
        videoUrl: null,
        imageUrl: "https://via.placeholder.com/600x300?text=Gambar+BOLA"
    },

    // Method 2: Writing
    "2-2": {
        title: "Menyalin Kata",
        text: "Salin kata berikut ini dengan rapi:\n\n'RUMAH'",
        videoUrl: null,
        imageUrl: "https://via.placeholder.com/600x300?text=Tulisan+RUMAH"
    },

    // Method 3: Audio
    "2-3": {
        title: "Dikte Kata",
        text: "Dengarkan baik-baik, lalu tulis kata yang diucapkan.",
        tts_text: "MAKAN", // <--- SCRIPT TTS
        videoUrl: null,
        imageUrl: null
    },

    // ==========================================
    // LEVEL 3: SENTENCE
    // ==========================================

    // Method 1: Reading
    "3-1": {
        title: "Membaca Kalimat Sederhana",
        text: "Bacalah kalimat ini:\n\n'Ibu pergi ke pasar membeli sayur.'",
        videoUrl: null,
        imageUrl: "https://via.placeholder.com/600x300?text=Ibu+di+Pasar"
    },

    // Method 2: Writing
    "3-2": {
        title: "Menyalin Kalimat",
        text: "Salin kalimat berikut di bukumu:\n\n'Ayah sedang membaca koran di teras.'",
        videoUrl: null,
        imageUrl: "https://via.placeholder.com/600x300?text=Ayah+Membaca"
    },

    // Method 3: Audio
    "3-3": {
        title: "Dikte Kalimat",
        text: "Simak audio berikut dan tulis kalimat lengkapnya.",
        tts_text: "Adik bermain bola di lapangan", // <--- SCRIPT TTS
        videoUrl: null,
        imageUrl: null
    },

    // Method 4: Ordering Sentences (Produces random word that will be re-ordered)
    "3-4": {
        title: "Menyusun Kalimat Acak",
        text: "Urutkan kata-kata acak berikut menjadi kalimat yang benar:\n\n[ makan - saya - nasi - goreng ]\n\nKunci Jawaban: 'Saya makan nasi goreng'",
        videoUrl: null,
        imageUrl: null
    },

    // Method 5: Rapid Naming (Produces simple nouns for object or colors)
    "3-5": {
        title: "Sebut Cepat (Rapid Naming)",
        text: "Sebutkan nama benda/warna berikut secepat mungkin:\n\n[ MERAH ] - [ MEJA ] - [ BIRU ] - [ KURSI ]",
        videoUrl: null,
        imageUrl: "https://via.placeholder.com/600x300?text=Warna+dan+Benda"
    }
};

// --- 3. LOGIC HANDLERS ---

const handleLevel = () => {
    form.method = '';
    const selectedData = methodOfArray.value.find(d => d.level == form.level);
    methodSelected.value = selectedData ? selectedData.data : [];
}

const handleGenerate = async () => {
    if (!form.level || !form.method || !form.description) {
        alert("Mohon lengkapi semua form input.");
        return;
    }

    // Cari Label Method & ID
    const selectedMethodObj = methodSelected.value.find(item => item.value === form.method);
    const methodLabel = selectedMethodObj ? selectedMethodObj.label : 'Unknown';

    // Snapshot Request
    const currentRequestSnapshot = {
        level: form.level,
        method: methodLabel,
        methodId: form.method,
        description: form.description
    };

    // 1. User Message
    messages.value.push({
        id: Date.now(),
        sender: 'user',
        content: { ...currentRequestSnapshot }
    });

    scrollToBottom();
    isGenerating.value = true;

    // 2. AI Simulation
    setTimeout(() => {
        // Ambil dari Mock DB
        const key = `${form.level}-${form.method}`;

        // Default fallback jika data tidak ditemukan di mock
        let defaultText = "Materi belum tersedia.";
        if (form.level == 1) defaultText = "Huruf: A";
        if (form.level == 2) defaultText = "Kata: CONTOH";
        if (form.level == 3) defaultText = "Kalimat: Ini adalah contoh kalimat.";

        const mockData = mockMaterialDB[key] || {
            title: `Materi ${methodLabel}`,
            text: defaultText,
            videoUrl: null,
            imageUrl: "https://via.placeholder.com/600x300?text=Materi+Generated"
        };

        messages.value.push({
            id: Date.now() + 1,
            sender: 'ai',
            type: 'result',
            isSaved: false,
            savedData: null,
            requestContext: currentRequestSnapshot,
            content: {
                title: mockData.title,
                videoUrl: mockData.videoUrl,
                imageUrl: mockData.imageUrl,
                text: mockData.text
            }
        });

        isGenerating.value = false;
        form.level = null
        form.method = null
        form.description = null
        scrollToBottom();
    }, 1500);
};

// --- SAVE & PREVIEW LOGIC ---

const handleSaveMaterial = async (msgIndex) => {
    const msg = messages.value[msgIndex];

    const payload = {
        childrenId: route.params.id,
        level: msg.requestContext.level,
        method: msg.requestContext.method,
        title: msg.content.title,
        description: msg.requestContext.description,
        content_text: msg.content.text,
        media_url: msg.content.videoUrl || msg.content.imageUrl
    };

    const result = await materialStore.saveGeneratedMaterial(payload);

    if (result.success) {
        messages.value[msgIndex].isSaved = true;
        messages.value[msgIndex].savedData = payload;
    } else {
        alert("Gagal menyimpan.");
    }
};

const handlePreview = (msgIndex) => {
    const msg = messages.value[msgIndex];
    if (msg.savedData) {
        previewContent.value = msg.savedData;
        isPreviewOpen.value = true;
    }
};

const closePreview = () => {
    isPreviewOpen.value = false;
    previewContent.value = null;
};

const scrollToBottom = () => {
    nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' });
        }
    });
};
</script>

<template>
    <div class="chat-layout-container">

        <div v-if="isPreviewOpen" class="modal-overlay" @click.self="closePreview">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Preview Materi</h3>
                    <button class="close-btn" @click="closePreview">&times;</button>
                </div>
                <div class="modal-body" v-if="previewContent">
                    <div class="meta-tags">
                        <span class="badge">Level {{ previewContent.level }}</span>
                        <span class="badge">{{ previewContent.method_label }}</span>
                    </div>

                    <h2 class="preview-title">{{ previewContent.title }}</h2>

                    <div class="media-container">
                        <iframe v-if="previewContent.media_url && previewContent.media_url.includes('youtube')"
                            width="100%" height="300" :src="previewContent.media_url" frameborder="0" allowfullscreen>
                        </iframe>
                        <img v-else-if="previewContent.media_url" :src="previewContent.media_url" alt="Materi Image" />
                    </div>

                    <div class="text-content">
                        <p>{{ previewContent.content_text }}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <ButtonComponent label="Tutup" size="small" display="border" @click="closePreview" />
                </div>
            </div>
        </div>

        <header class="page-header">
            <div class="header-content">
                <router-link :to="{ name: 'childs.detail', params: { id: id } }" class="back-btn">
                    <ChevronLeftIcon />
                </router-link>
                <h1 class="page-title">AI Material Generator</h1>
            </div>
        </header>

        <main class="main-content">
            <div class="chat-window" ref="chatContainer">
                <div class="messages-wrapper">

                    <div v-for="(msg, index) in messages" :key="msg.id" :class="['message-row', msg.sender]">

                        <div class="avatar">
                            <span v-if="msg.sender === 'ai'">🤖</span>
                            <span v-else>👤</span>
                        </div>

                        <div class="bubble">
                            <div v-if="msg.type === 'intro'">
                                <p>{{ msg.content }}</p>
                            </div>

                            <div v-else-if="msg.sender === 'user'">
                                <div class="request-summary">
                                    <span class="badge">Level {{ msg.content.level }}</span>
                                    <span class="badge">{{ msg.content.method }}</span>
                                </div>
                                <p class="request-text">{{ msg.content.description }}</p>
                            </div>

                            <div v-else-if="msg.type === 'result'" class="result-content">
                                <h3>{{ msg.content.title }}</h3>
                                <p class="desc">{{ msg.content.text }}</p>

                                <div class="media-block" v-if="msg.content.imageUrl">
                                    <img :src="msg.content.imageUrl" alt="Generated Image" />
                                </div>
                                <div class="media-block video-wrapper" v-if="msg.content.videoUrl">
                                    <iframe width="100%" height="200" :src="msg.content.videoUrl" frameborder="0"
                                        allowfullscreen></iframe>
                                </div>

                                <div class="actions">
                                    <ButtonComponent v-if="!msg.isSaved" label="Simpan ke Library" class="primary"
                                        size="small" display="fill" :isDisabled="materialStore.isLoading"
                                        @click="handleSaveMaterial(index)" />

                                    <ButtonComponent v-else label="Tersimpan ✓" size="small" display="border"
                                        :isDisabled="true"
                                        style="border-color: var(--Success-500); color: var(--Success-500);" />

                                    <ButtonComponent v-if="msg.isSaved" label="Preview" size="small" type="secondary"
                                        display="fill" @click="handlePreview(index)">
                                        <template #icon>
                                            <EyeIcon />
                                        </template>
                                    </ButtonComponent>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="isGenerating" class="message-row ai">
                        <div class="avatar">🤖</div>
                        <div class="bubble loading-bubble">
                            <div class="typing-dots"><span></span><span></span><span></span></div>
                            <small>Sedang menyusun materi...</small>
                        </div>
                    </div>

                </div>
            </div>

            <div class="input-area-wrapper">
                <div class="input-card">
                    <div class="input-grid">
                        <div class="form-group">
                            <label>Level</label>
                            <select v-model="form.level" @change="handleLevel">
                                <option value="" disabled>Pilih</option>
                                <option v-for="l in levels" :key="l" :value="l">{{ l }}</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Metode</label>
                            <select v-model="form.method">
                                <option value="" disabled>Pilih</option>
                                <option v-for="m in methodSelected" :key="m.value" :value="m.value">{{ m.label }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group full-width">
                        <textarea v-model="form.description" placeholder="Deskripsi materi..."></textarea>
                    </div>
                    <div class="action-bar">
                        <ButtonComponent @click="handleGenerate" :isDisabled="isGenerating"
                            :label="isGenerating ? '...' : 'Generate'" size="small" />
                    </div>
                </div>
            </div>

        </main>
    </div>
</template>

<style lang="scss" scoped>
// --- GLOBAL VARS (Local) ---
.chat-layout-container {
    --White: #FFFFFF;
    --Soft-white: #F9FAFB;
    --Primary-900: #FF3C8A;
    --Primary-500: #FF70A9;
    --Secondary-900: #008BD8;
    --Success-500: #22C55E;
    --Neutral-100: #E5E7EB;
    --Neutral-300: #9CA3AF;
    --Neutral-700: #374151;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.chat-layout-container {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.page-header {
    flex-shrink: 0;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--Neutral-100);

    .header-content {
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 900px;
        margin: 0 auto;
    }

    .page-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--Primary-900);
        font-family: 'Ubuntu Sans', sans-serif;
    }

    .back-btn {
        display: flex;
        align-items: center;
        color: var(--Neutral-700);
    }
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

// --- CHAT WINDOW ---
.chat-window {
    flex: 1;
    overflow-y: auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: var(--Neutral-300);
        border-radius: 20px;
        border: 3px solid transparent;
        background-clip: content-box;
    }
}

.messages-wrapper {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 1rem;
}

.message-row {
    display: flex;
    gap: 1rem;

    &.user {
        flex-direction: row-reverse;

        .bubble {
            background-color: var(--Primary-500);
            color: white;
            border-radius: 1.2rem 1.2rem 0.2rem 1.2rem;
        }

        .request-text {
            color: white;
        }
    }

    &.ai {
        .bubble {
            background-color: var(--White);
            border: 1px solid var(--Neutral-100);
            border-radius: 0.2rem 1.2rem 1.2rem 1.2rem;
            box-shadow: var(--shadow);
        }
    }

    .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--Neutral-100);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .bubble {
        padding: 1.25rem;
        max-width: 100%;
        line-height: 1.6;
        font-size: 0.95rem;

        .request-summary {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.5rem;

            .badge {
                background: rgba(255, 255, 255, 0.2);
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: bold;
                color: inherit;
            }
        }

        h3 {
            margin-bottom: 0.5rem;
            color: var(--Primary-900);
        }

        .desc {
            margin-bottom: 1rem;
            white-space: pre-wrap;
        }

        .media-block {
            margin-top: 1rem;
            border-radius: 8px;
            overflow: hidden;

            img,
            iframe {
                width: 100%;
                display: block;
            }
        }

        .actions {
            margin-top: 1rem;
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }
    }
}

// --- INPUT AREA ---
.input-area-wrapper {
    flex-shrink: 0;
    background-color: var(--White);
    border-top: 1px solid var(--Neutral-100);
    padding: 1.5rem;
    width: 100%;
    z-index: 10;

    .input-card {
        max-width: 800px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .input-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--Neutral-700);
        }

        select,
        textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--Neutral-300);
            border-radius: 8px;
            outline: none;

            &:focus {
                border-color: var(--Secondary-900);
                box-shadow: 0 0 0 2px var(--Secondary-500);
            }
        }

        textarea {
            height: 50px;
            resize: none;
        }
    }

    .action-bar {
        display: flex;
        justify-content: flex-end;
    }
}

// --- MODAL STYLES ---
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
}

.modal-content {
    background: var(--White);
    width: 90%;
    max-width: 600px;
    max-height: 85vh;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.3s ease-out;

    .modal-header {
        padding: 1.25rem;
        border-bottom: 1px solid var(--Neutral-100);
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
            margin: 0;
            font-family: 'Ubuntu Sans';
            color: var(--Primary-900);
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }
    }

    .modal-body {
        padding: 1.5rem;
        overflow-y: auto;

        .meta-tags {
            display: flex;
            gap: 8px;
            margin-bottom: 1rem;

            .badge {
                background: var(--Neutral-100);
                color: var(--Neutral-700);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: bold;
            }
        }

        .preview-title {
            font-size: 1.4rem;
            margin-bottom: 1rem;
            color: #1F2937;
        }

        .media-container {
            margin-bottom: 1.5rem;
            border-radius: 8px;
            overflow: hidden;

            img,
            iframe {
                width: 100%;
                display: block;
            }
        }

        .text-content {
            font-size: 1rem;
            line-height: 1.6;
            color: var(--Neutral-700);
            white-space: pre-wrap;
        }
    }

    .modal-footer {
        padding: 1.25rem;
        border-top: 1px solid var(--Neutral-100);
        display: flex;
        justify-content: flex-end;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.loading-bubble .typing-dots {
    display: flex;
    gap: 4px;

    span {
        width: 6px;
        height: 6px;
        background: var(--Neutral-700);
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out both;

        &:nth-child(1) {
            animation-delay: -0.32s;
        }

        &:nth-child(2) {
            animation-delay: -0.16s;
        }
    }
}

@keyframes bounce {

    0%,
    80%,
    100% {
        transform: scale(0);
    }

    40% {
        transform: scale(1);
    }
}
</style>