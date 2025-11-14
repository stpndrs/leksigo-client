<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ConfirmComponent from '@/components/confirm/ConfirmComponent.vue';
import AudioPlayerComponent from '@/components/fields/AudioPlayerComponent.vue';
import AudioRecorderComponent from '@/components/fields/AudioRecorderComponent.vue';
import FileUploadComponent from '@/components/fields/FileUploadComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import EyeIcon from '@/components/shape/EyeIcon.vue';
import EyeSlashIcon from '@/components/shape/EyeSlashIcon.vue';
import ToastComponent from '@/components/toast/ToastComponent.vue';
import { formatDate } from '@/helpers/formatDate';
import { formatDurationVerbose } from '@/helpers/formatDurationVerbose';
import { formatMethodLabel } from '@/helpers/formatMethodLabel';
import { authStore } from '@/stores/AuthStore';
import api from '@/utils/api';
import { globalToast } from '@/utils/toast';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const baseUrl = import.meta.env.VITE_APP_API_URL
const route = useRoute()
const router = useRouter()

const id = route.params.id
const quizId = route.params.quizId
const quizData = ref([])
const questions = ref([])

onMounted(async () => {
    getData()
})

const getData = async () => {
    await api.get(`/exercise/${id}/quiz/${quizId}`)
        .then((res) => {
            quizData.value = res.data.data
            questions.value = res.data.data.questions

            console.log(questions)
        })
        .catch((err) => {
            console.log(err);
        })
}

const visibility = async () => {
    await api.post(`exercise/${id}/quiz/${quizId}/visibility`)
        .then(res => {
            getData()
        })
        .catch(e => {
            console.log(e);
        })
}
</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'exercise.quiz.list', params: { id, quizId } }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Preview Soal : {{ quizData.name }}</h1>
        </div>
        <div class="page-body">
            <ButtonComponent :label="!quizData.isHidden ? 'Sembunyikan' : 'Tampilkan'"
                :icon="!quizData.isHidden ? EyeSlashIcon : EyeIcon" class="secondary" size="small" display="border"
                @click="visibility" v-if="!isWorkMode && authStore.user.role == 1" />
            <div class="grid-container">
                <div class="answers-container">
                    <div class="item" v-for="(item, index) in questions" :key="index">
                        <div class="score">Soal Nomor : {{ index + 1 }}</div>
                        <div class="method">{{ formatMethodLabel(item.method) }}</div>
                        <div class="guide">
                            <span v-if="[1, 2, 4].includes(item?.method)">Tulislah jawaban di kertas, lalu upload
                                sebagai foto/gambar.</span>
                            <span v-if="[3, 5].includes(item?.method)">Rekam suara Anda sebagai jawaban.</span>
                        </div>
                        <!-- if 1 = tampilkan tag audio -->
                        <AudioPlayerComponent v-if="item?.method == 1" :text="item?.question?.value" :autoplay="false"
                            displayStyle="text" />
                        <!-- if 2 = tampilkan text untuk ditulis ulang -->
                        <!-- if 3 = tampilkan text dan recorder untuk dibaca -->
                        <!-- if 4 = mengurutkan kata -->
                        <h2 class="question" v-else-if="item?.method == 2 || item?.method == 3 || item?.method == 4">
                            {{
                                item?.question.value }}</h2>
                        <!-- if 5 = menebak cepat -->
                        <!-- if isHexColor true -->
                        <div class="object-color" v-if="item?.question?.type == 'hex'"
                            :style="`background-color: ${item?.question?.value}`"></div>
                        <!-- if isImage true -->
                        <div class="object-image" v-if="item?.question?.type == 'path'">
                            <img :src="`${baseUrl}/api/v1/${item?.question?.value}`" alt="Pertanyaan">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* Tambahkan style untuk soal gambar dan warna */
// Style ini tidak terpakai, pindahkan ke .object-image
.question-image {
    max-width: 100%;
    max-height: 40vh;
    border-radius: 10px;
}

// Style ini tidak terpakai, pindahkan ke .object-color
.question-color-box {
    width: 100%;
    height: 30vh;
    border-radius: 10px;
    border: 1px solid #eee;
}

.grid-container {
    display: grid;
    grid-template-columns: 1fr; // <-- Diubah dari 75% auto
    gap: 30px;
    margin-top: 30px;

    .answers-container {
        color: var(--Secondary-900);

        .answers-container-body {
            min-height: 60vh;
        }

        .item {
            padding: 30px;
            background-color: var(--White);
            margin-bottom: 30px;
            border-radius: 15px;
            border: 2px solid var(--Secondary-900);

            .time {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                flex-wrap: wrap; // <-- Tambahkan wrap
                gap: 10px; // <-- Tambahkan gap

                .duration span {
                    font-weight: bold;
                    font-size: 20px;
                }
            }

            .score {
                color: var(--Primary-900);
                font-size: 25px;
                margin-bottom: 15px;
            }

            .method {
                padding: 10px 15px;
                background: var(--Secondary-900);
                width: fit-content;
                color: white;
                margin-bottom: 15px;
                border-radius: 15px;
            }

            .answer {
                margin-top: 20px; // <-- Beri jarak dari pertanyaan

                p {
                    font-weight: bold;
                    font-size: 1.2rem;
                    margin-bottom: 10px;
                }

                img {
                    width: 30%;
                    margin-top: 15px;
                    border-radius: 10px; // <-- Tambahkan border radius
                }

                .transcript {
                    margin-top: 15px;

                    h3 {
                        font-weight: bold;
                        font-size: 1rem;
                    }

                    p {
                        font-weight: normal;
                        font-size: 1rem;
                        color: var(--Neutral-700);

                    }
                }
            }

            .guide {
                color: var(--Info-200);
                font-size: 20px;
                margin-bottom: 20px;
            }

            .object-color {
                width: 300px;
                height: 150px;
                display: block;
                background-color: white;
                border-radius: 10px;
                border: 1px solid var(--Neutral-300); // <-- Tambahkan border
            }

            .object-image {
                width: 25%;

                img {
                    width: 100%;
                    border-radius: 10px;
                    display: block; // <-- Tambahan
                }
            }

            .question {
                font-size: 65px;
                margin-bottom: 20px;
                font-family: 'OpenDyslexic';
            }

            button {
                // Style ini tidak ada di HTML
                bottom: 0;
            }

            .transcript {}

            // Style ini kosong

            .unanswerd {
                color: var(--Danger-900);
                font-style: italic; // <-- Tambahan
            }
        }

    }

    .attitude {
        width: 100%;
        padding: 30px;
        background-color: var(--White);
        margin-bottom: 30px;
        border-radius: 15px;
        border: 2px solid var(--Secondary-900);
        height: fit-content;
        // Nempel saat scroll di desktop
        position: sticky;
        top: 20px;


        h3 {
            font-size: 25px;
            color: var(--Secondary-900);
            margin-bottom: 15px;
        }

        .point {
            font-size: 30px;
            color: var(--Secondary-900);
            margin-bottom: 15px;
        }

        .description {
            color: var(--Neutral-700);

            // Atur agar style HTML dari v-html terlihat
            :deep(p) {
                margin-bottom: 1rem;
            }

            :deep(ul) {
                padding-left: 20px;
            }
        }
    }
}


/* --- RESPONSIVE --- */

/* Target Tablet Besar */
@media (max-width: 1024px) {
    .grid-container {
        grid-template-columns: 1fr; // <-- Pecah jadi 1 kolom

        .attitude {
            order: -1; // <-- Pindahkan Penilaian ke atas
            position: relative; // <-- Hapus sticky di mobile
            top: 0;
        }
    }
}

/* Target Ponsel */
@media (max-width: 768px) {
    .grid-container .answers-container .item {
        padding: 20px; // Kurangi padding

        .time {
            flex-direction: column; // Tumpuk vertikal
            align-items: flex-start; // Ratakan kiri
            gap: 15px;

            .duration span {
                font-size: 18px;
            }
        }

        .score {
            font-size: 20px;
        }

        .guide {
            font-size: 16px;
        }

        .question {
            font-size: 32px; // Kecilkan font soal
        }

        .object-color {
            width: 100%; // Penuhi layar
            height: 100px;
        }

        .object-image,
        .answer img {
            width: 100%; // Penuhi layar
        }
    }

    .grid-container .attitude {
        padding: 20px;

        h3 {
            font-size: 20px;
        }

        .point {
            font-size: 24px;
        }
    }
}
</style>