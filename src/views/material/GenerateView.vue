<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import { useMaterialStore } from '@/stores/MaterialStore';
import { ref, reactive, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const materialStore = useMaterialStore()
const route = useRoute();
const id = route.params.id;

const levels = ref([1, 2, 3])

// Data Master Method
const methodOfArray = ref([
    {
        level: 1,
        data: [
            { label: 'Mendengar Audio', value: 1 },
            { label: 'Menulis Ulang', value: 2 },
            { label: 'Membaca', value: 3 },
        ]
    },
    {
        level: 2,
        data: [
            { label: 'Mendengar Audio', value: 1 },
            { label: 'Menulis Ulang', value: 2 },
            { label: 'Membaca', value: 3 },
        ]
    },
    {
        level: 3,
        data: [
            { label: 'Mendengar Audio', value: 1 },
            { label: 'Menulis Ulang', value: 2 },
            { label: 'Membaca', value: 3 },
            { label: 'Mengurut Kata', value: 4 },
            { label: 'Menebak Cepat', value: 5 },
        ]
    },
])

// State untuk Opsi Method yang tampil di Select
const methodSelected = ref([])

const chatContainer = ref(null);
const isGenerating = ref(false);

const form = reactive({
    level: '',
    method: '', // Ini menyimpan value (integer), misal: 1, 2, dst
    description: ''
});

const messages = ref([
    {
        id: 1,
        sender: 'ai',
        type: 'intro',
        content: 'Halo! Saya asisten AI Anda. Silakan tentukan Level, Metode, dan Deskripsi materi yang ingin Anda buat.'
    }
]);

// --- LOGIC GANTI LEVEL ---
const handleLevel = () => {
    // 1. Reset pilihan method di form agar user memilih ulang
    form.method = '';

    // 2. Cari data method berdasarkan level yang dipilih
    const selectedData = methodOfArray.value.find(d => d.level == form.level);

    // 3. Update opsi dropdown method
    if (selectedData) {
        methodSelected.value = selectedData.data;
    } else {
        methodSelected.value = [];
    }
}

// --- LOGIC GENERATE ---
const handleGenerate = async () => {
    if (!form.level || !form.method || !form.description) {
        alert("Mohon lengkapi semua form input.");
        return;
    }

    // Cari Label Method
    const selectedMethodObj = methodSelected.value.find(item => item.value === form.method);
    const methodLabel = selectedMethodObj ? selectedMethodObj.label : 'Unknown';

    // Simpan snapshot request saat ini agar saat tombol simpan ditekan, datanya konsisten
    const currentRequestSnapshot = {
        level: form.level,
        method: methodLabel,
        methodId: form.method, // Simpan ID nya juga
        description: form.description
    };

    // 1. User Message
    messages.value.push({
        id: Date.now(),
        sender: 'user',
        content: {
            ...currentRequestSnapshot // Spread data request
        }
    });

    scrollToBottom();
    isGenerating.value = true;

    // 2. AI Simulation
    setTimeout(() => {
        // Tentukan tipe media berdasarkan method untuk simulasi yang lebih akurat
        let dummyVideo = '';
        let dummyImage = '';

        if (form.method === 1) { // Mendengar Audio
            dummyVideo = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
        } else {
            dummyImage = 'https://via.placeholder.com/600x300?text=Ilustrasi+Materi';
        }

        messages.value.push({
            id: Date.now() + 1,
            sender: 'ai',
            type: 'result',
            // Kita selipkan data request user ke message AI agar tombol 'Simpan' tahu konteksnya
            requestContext: currentRequestSnapshot,
            content: {
                title: `Materi ${methodLabel}: ${form.description.substring(0, 20)}...`,
                videoUrl: dummyVideo,
                imageUrl: dummyImage,
                text: `Ini adalah materi lengkap untuk ${methodLabel}.\n\nIsi materi mencakup paragraf utama yang bisa digunakan untuk latihan voice-to-text atau membaca.`
            }
        });

        isGenerating.value = false;
        scrollToBottom();
    }, 2000);
};

const handleSaveMaterial = async (messageContent, userRequestParams) => {
    // Kita gabungkan data dari Request User (Level, Method) 
    // dengan Hasil Generate AI (Text, Gambar, Link)

    // Cari Method ID berdasarkan Label (Reverse lookup karena di chat kita simpan label)
    // Atau lebih baik simpan ID juga di message history user, tapi kita cari manual saja disini:
    let methodId = 0;
    methodOfArray.value.forEach(lvl => {
        const found = lvl.data.find(m => m.label === messageContent.methodLabel || m.label === userRequestParams?.method);
        if (found) methodId = found.value;
    });

    const payload = {
        level: userRequestParams?.level || form.level, // Fallback
        method_id: methodId,
        method_label: userRequestParams?.method,

        // Data hasil generate
        title: messageContent.title,
        description: userRequestParams?.description || "Materi Generated AI",
        content_text: messageContent.text,

        // Deteksi apakah ini Video atau Gambar untuk field media_url
        media_url: messageContent.videoUrl || messageContent.imageUrl,
    };

    // Panggil Store
    const result = await materialStore.saveGeneratedMaterial(payload);

    if (result.success) {
        alert(result.message); // Atau ganti dengan Toast Notification
    } else {
        alert("Gagal menyimpan.");
    }
};

const scrollToBottom = () => {
    nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTo({
                top: chatContainer.value.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
};
</script>

<template>
    <div class="chat-layout-container">

        <header class="page-header">
            <div class="header-content">
                <router-link :to="{ name: 'childs.detail', params: { id: id } }" class="back-btn">
                    <ChevronLeftIcon />
                </router-link>
                <h1 class="page-title">AI Generator</h1>
            </div>
        </header>

        <main class="main-content">

            <div class="chat-window" ref="chatContainer">
                <div class="messages-wrapper">

                    <div v-for="msg in messages" :key="msg.id" :class="['message-row', msg.sender]">

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
                                <div class="media-block">
                                    <img :src="msg.content.imageUrl" alt="Generated Image" />
                                </div>
                                <div class="media-block video-wrapper">
                                    <iframe width="100%" height="200" :src="msg.content.videoUrl" frameborder="0"
                                        allowfullscreen></iframe>
                                </div>
                                <div class="actions">
                                    <ButtonComponent label="Salin" class="primary" size="small" display="border" />
                                    <ButtonComponent label="Simpan" class="primary" size="small" display="fill"
                                        @click="handleSaveMaterial" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="isGenerating" class="message-row ai">
                        <div class="avatar">🤖</div>
                        <div class="bubble loading-bubble">
                            <div class="typing-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <small>Sedang berpikir...</small>
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
                                <option v-for="m in methodSelected" :key="m.value" :value="m.value">
                                    {{ m.label }}
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
// --- GLOBAL VARS (Local Scope) ---
.chat-layout-container {
    --White: #FFFFFF;
    --Soft-white: #F9FAFB;
    --Primary-900: #FF3C8A;
    --Primary-500: #FF70A9;
    --Secondary-900: #008BD8;
    --Secondary-500: #56BFF9;
    --Neutral-100: #E5E7EB;
    --Neutral-300: #9CA3AF;
    --Neutral-700: #374151;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

// ==========================================
// 1. MAIN LAYOUT (GEMINI STYLE)
// ==========================================

#content {
    padding: 0;
}

// Container utama memegang kendali penuh tinggi layar
.chat-layout-container {
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

// Header diam di atas
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

// Wrapper untuk Chat + Input
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

// ==========================================
// 2. CHAT WINDOW (SCROLL AREA)
// ==========================================
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

    &::-webkit-scrollbar-track {
        background: transparent;
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

// ==========================================
// 3. MESSAGE BUBBLES
// ==========================================
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
                // Kalau user bubble putih, kalau ai bubble gelap
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

            .btn-small {
                padding: 6px 12px;
                border: 1px solid var(--Neutral-300);
                background: white;
                border-radius: 6px;
                cursor: pointer;

                &.primary {
                    background: var(--Secondary-900);
                    color: white;
                    border-color: var(--Secondary-900);
                }
            }
        }
    }
}

// Loading Animation
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

// ==========================================
// 4. INPUT AREA (FIXED BOTTOM via Flex)
// ==========================================
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
            font-family: inherit;
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
</style>