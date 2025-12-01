<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import AudioPlayerComponent from '@/components/fields/AudioPlayerComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import EyeIcon from '@/components/shape/EyeIcon.vue';
import EyeSlashIcon from '@/components/shape/EyeSlashIcon.vue';
import { formatMethodLabel } from '@/helpers/formatMethodLabel';
import { authStore } from '@/stores/AuthStore';
import { workStore } from '@/stores/WorkStore';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// --- CONFIG ---
const baseUrl = import.meta.env.VITE_APP_API_URL
const route = useRoute()
const router = useRouter()
const id = route.params.id
const materialId = route.params.materialId
const material = ref(null)
const isLoading = ref(false)

// --- UTILS ---
const getYoutubeId = (url) => {
    if (!url || typeof url !== 'string') return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const isYoutubeUrl = (url) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
};

// --- API ---
onMounted(async () => {
    await getData()
})

const getData = async () => {
    try {
        isLoading.value = true
        const res = await api.get(`materials/${route.params.materialId}`)
        material.value = res.data.data
    } catch (e) {
        console.error(e);
    } finally {
        isLoading.value = false
    }
}

const visibility = async () => {
    try {
        await api.post(`materials/${materialId}`)
        getData()
    } catch (e) {
        console.error(e);
    }
}
</script>

<template>
    <div class="container">

        <div class="page-header">
            <router-link :to="{ name: 'childs.detail', params: id }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Detail Materi</h1>
        </div>

        <div class="page-body">
            <div v-if="isLoading" class="loading-state">
                <div class="spinner"></div>
                <p>Sedang mengambil data...</p>
            </div>

            <div class="material" v-else-if="!isLoading && material">
                <div class="material-header">
                    <div class="btn-group">
                        <ButtonComponent label="Edit Materi" size="small" display="border"
                            @click="router.push({ name: 'material.edit', params: { id, materialId } })"
                            v-if="authStore.user.role == 1 && !workStore.isWorkMode" />

                        <ButtonComponent :label="!material.isHidden ? 'Sembunyikan' : 'Tampilkan'"
                            :icon="!material.isHidden ? EyeSlashIcon : EyeIcon" class="secondary" size="small"
                            display="border" @click="visibility"
                            v-if="authStore.user.role == 1 && !workStore.isWorkMode" />
                    </div>

                    <div class="flex">
                        <div class="method-wrapper">
                            <p>Metode Belajar : </p>
                            <div class="method-selected">{{ formatMethodLabel(material.method) }}</div>
                        </div>
                        <div class="level-wrapper">
                            <p>Level Materi : </p>
                            <div class="level-container">
                                <div :class="['item', material.level == 1 ? 'active' : '']" v-if="material.level == 1">1
                                </div>
                                <div :class="['item', material.level == 2 ? 'active' : '']" v-if="material.level == 2">2
                                </div>
                                <div :class="['item', material.level == 3 ? 'active' : '']" v-if="material.level == 3">3
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 class="material-title">{{ material.title }}</h3>
                    <div class="material-description" v-html="material.description"></div>
                </div>

                <div class="material-body">

                    <hr class="divider" />

                    <div class="res-main-content">
                        <div class="content-body" v-html="material.content"></div>
                    </div>

                    <div class="media-section">

                        <div class="media-item" v-if="material.readedText">
                            <p class="media-label">Dengarkan Audio:</p>
                            <AudioPlayerComponent :text="material.readedText" displayStyle="player" :autoplay="false" />
                        </div>

                        <div class="media-item" v-if="material.images && material.images.length > 0">
                            <div class="image-grid">
                                <img v-for="(img, idx) in material.images" :key="idx" :src="`${baseUrl}/api/v1/${img}`"
                                    alt="Visual Material" />
                            </div>
                        </div>

                        <div class="media-item" v-if="material.link">
                            <div v-if="isYoutubeUrl(material.link)" class="video-wrapper">
                                <iframe width="100%" height="400"
                                    :src="`https://www.youtube.com/embed/${getYoutubeId(material.link)}`"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen>
                                </iframe>
                                <p class="link-caption">Sumber: <a :href="material.link" target="_blank">{{
                                    material.link }}</a></p>
                            </div>
                            <div v-else class="link-wrapper">
                                <a :href="material.link" target="_blank" class="external-link">
                                    🔗 Buka Link Materi: {{ material.link }}
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// --- VARS (Agar konsisten dengan Chat) ---
.container {
    --White: #FFFFFF;
    --Soft-white: #F9FAFB;
    --Primary-900: #FF3C8A;
    --Secondary-900: #008BD8;
    --Secondary-500: #3ABFF8;
    --Ternary-500: #FACC15; // Asumsi warna kuning untuk level 2
    --Neutral-100: #E5E7EB;
    --Neutral-300: #9CA3AF;
    --Neutral-500: #6B7280;
    --Neutral-700: #374151;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

// --- 1. EXISTING HEADER STYLES (DIPERTAHANKAN) ---
.page-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;

    a {
        color: var(--Neutral-700);
        display: flex;
        align-items: center;
    }

    .page-title {
        font-size: 24px;
        font-weight: 700;
        color: var(--Primary-900);
        font-family: 'Ubuntu Sans', sans-serif;
        margin: 0;
    }
}

.loading-state {
    background: unset;
}

.material {
    .material-header {
        .material-title {
            color: var(--Primary-900);
            font-size: 50px;
            margin-bottom: 10px;
        }

        .material-description {
            color: var(--Neutral-700);
            font-size: 20px; // Disesuaikan sedikit agar balance
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .btn-group {
            display: flex;
            justify-content: start;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
            width: 100%;
            margin-bottom: 30px;
        }
    }
}

// Flex Grid untuk Level & Method
.flex {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 30px;
    margin-bottom: 30px;

    .method-wrapper {
        p {
            margin-bottom: 5px;
            color: var(--Primary-900);
        }

        .method-selected {
            width: fit-content;
            padding: 10px 20px;
            background-color: var(--Primary-900);
            border-radius: 15px;
            color: white;
        }
    }

    .level-wrapper {
        justify-self: end;

        p {
            margin-bottom: 5px;
            color: var(--Secondary-900);
        }

        .level-container {
            display: grid;
            grid-template-columns: auto;
            gap: 20px;

            .item {
                padding: 10px 25px;
                border-radius: 10px;
                font-size: 20px;
                font-weight: bold;
                font-family: 'Ubuntu Sans';
                border: 2px solid;
                text-align: center;
                cursor: default;

                &:nth-child(1) {
                    border-color: var(--Secondary-900);
                    color: var(--Secondary-900);

                    &.active {
                        background-color: var(--Secondary-900);
                        color: var(--White);
                    }
                }

                &:nth-child(2) {
                    border-color: var(--Ternary-500);
                    color: var(--Ternary-500);

                    &.active {
                        background-color: var(--Ternary-500);
                        color: var(--White);
                    }
                }

                &:nth-child(3) {
                    border-color: var(--Primary-900);
                    color: var(--Primary-900);

                    &.active {
                        background-color: var(--Primary-900);
                        color: var(--White);
                    }
                }
            }
        }
    }
}


// --- 2. NEW CONTENT STYLES (MATCHING CHAT RESULT) ---

.material-body {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 1rem;
}

.divider {
    border: none;
    border-top: 1px solid var(--Neutral-100);
    margin: 0;
}

// Highlighted Content Box
.res-main-content {
    background-color: var(--Soft-white);
    border-left: 5px solid var(--Secondary-900);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: var(--shadow);

    .content-body {
        font-size: 1.5rem; // Font besar sesuai keinginan sebelumnya
        font-weight: 500;
        color: var(--Neutral-700);
        line-height: 1.8;

        :deep(p) {
            margin-bottom: 1rem;
        }

        :deep(b),
        :deep(strong) {
            color: var(--Secondary-900);
        }
    }
}

// Media Section
.media-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    .media-item {
        .media-label {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--Neutral-500);
            margin-bottom: 0.5rem;
        }
    }

    // Images
    .image-grid {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;

        img {
            max-width: 100%;
            width: 300px; // Ukuran default gambar
            border-radius: 12px;
            border: 1px solid var(--Neutral-100);
            box-shadow: var(--shadow);
            object-fit: cover;
        }
    }

    // Video
    .video-wrapper {
        width: 100%;
        max-width: 800px;

        iframe {
            border-radius: 15px;
            box-shadow: var(--shadow);
            aspect-ratio: 16 / 9;
        }

        .link-caption {
            font-size: 14px;
            margin-top: 8px;
            color: var(--Neutral-500);
            font-style: italic;

            a {
                color: var(--Primary-900);
                text-decoration: none;
            }
        }
    }

    // Link
    .link-wrapper {
        .external-link {
            display: inline-block;
            padding: 12px 16px;
            background: var(--Neutral-100);
            color: var(--Secondary-900);
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.2s;

            &:hover {
                background: var(--Secondary-900);
                color: var(--White);
            }
        }
    }
}

/* --- RESPONSIVE --- */
@media (max-width: 768px) {
    .material .material-header {
        .material-title {
            font-size: 32px;
        }

        .btn-group {
            flex-direction: column;

            button {
                width: 100%;
            }
        }
    }

    .flex {
        grid-template-columns: 1fr;
        gap: 25px;

        .level-wrapper {
            justify-self: start;
            order: -1;
        }
    }

    .res-main-content .content-body {
        font-size: 1.2rem;
    }

    .media-section .image-grid img {
        width: 100%;
    }
}
</style>