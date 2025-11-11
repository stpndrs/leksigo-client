<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ConfirmComponent from '@/components/confirm/ConfirmComponent.vue';
import AudioPlayerComponent from '@/components/fields/AudioPlayerComponent.vue';
import AudioRecorderComponent from '@/components/fields/AudioRecorderComponent.vue';
import FileUploadComponent from '@/components/fields/FileUploadComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import ToastComponent from '@/components/toast/ToastComponent.vue';
import { formatDate } from '@/helpers/formatDate';
import { formatDurationVerbose } from '@/helpers/formatDurationVerbose';
import { formatMethodLabel } from '@/helpers/formatMethodLabel';
import api from '@/utils/api';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const baseUrl = import.meta.env.VITE_APP_API_URL
const route = useRoute()
const router = useRouter()

// Modal & Toast State
const isModalShowed = ref(false); // Bank Soal
const isConfirmOpen = ref(false); // Konfirmasi Submit
const confirmMsg = ref(''); // (Tidak terpakai, tapi ada)
const isShowToast = ref(false);
const toastMsg = ref('');
const toastType = ref('success');

const id = route.params.id
const quizId = route.params.quizId
const quizData = ref([])
const answers = ref([])

onMounted(async () => {
    await api.get(`/exercise/${id}/quiz/${quizId}`)
        .then((res) => {
            quizData.value = res.data.data

            initAnswersData()

            console.log(quizData)
        })
        .catch((err) => {
            console.log(err);
        })
})

const initAnswersData = () => {
    quizData.value.questions.forEach(item => {
        const findAnswer = quizData.value.answers.find(d => d.questionId == item._id)
        if (!findAnswer) {
            answers.value.push({
                // questionId: findAnswer.questionId,
                question: item.question,
                method: item.method,
                code: item.code,
                similarityPoint: 0,
                answer: null,
                duration: null,
                timeOpened: null,
                timeAnswered: null,
            })
        } else {
            answers.value.push({
                // questionId: findAnswer.questionId,
                question: item.question,
                method: item.method,
                code: item.code,
                similarityPoint: findAnswer.similarityPoint,
                answer: findAnswer.answer,
                duration: findAnswer.duration,
                timeOpened: findAnswer.timeOpened,
                timeAnswered: findAnswer.timeAnswered,
            })
        }

    });

    console.log(answers.value);

}
</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'exercise.quiz.overview', params: { id, quizId } }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Review Jawaban</h1>
        </div>
        <div class="page-body">
            <ToastComponent :message="toastMsg" :type="toastType" v-show="isShowToast" />

            <div class="grid-container">
                <div class="answers-container">
                    <div class="item" v-for="(item, index) in answers" :key="index">
                        <div class="score">Skor : {{ parseInt(item.similarityPoint) }}/100</div>
                        <div class="time">
                            <div class="timing">
                                <div class="opened">Dibuka {{ formatDate(item.timeOpened, 'long') }}</div>
                                <div class="answered">Dijawab {{ formatDate(item.timeAnswered, 'long') }}</div>
                            </div>
                            <div class="duration">Total Durasi <br> <span>{{ formatDurationVerbose(item.duration)
                            }}</span></div>
                        </div>
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
                        <div class="answer">
                            <p>Jawaban</p>
                            <div class="answered" v-if="item?.answer?.file">
                                <img :src="item.answer.file" alt="Answer Image" v-if="[1, 2, 4].includes(item?.method)">
                                <AudioPlayerComponent v-else-if="[3, 5].includes(item?.method)" :autoplay="false"
                                    displayStyle="text" />
                                <div class="transcript">
                                    <h3>Transkrip</h3>
                                    <p>{{ item.answer.text }}</p>
                                </div>
                            </div>
                            <h2 class="unanswerd" v-else>Tidak ada jawaban</h2>
                        </div>
                    </div>
                </div>
                <div class="attitude">
                    <h3>Penilaian Perilaku</h3>
                    <div class="point">Nilai Perilaku : <strong>{{ quizData?.attitudePoint?.point }}</strong>
                    </div>
                    <div class="description" v-html="quizData?.attitudePoint?.note"></div>
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
    grid-template-columns: 3fr 1fr; // <-- Diubah dari 75% auto
    gap: 30px;

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
                        font-style: italic;
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