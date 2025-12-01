<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ConfirmComponent from '@/components/confirm/ConfirmComponent.vue';
import AudioPlayerComponent from '@/components/fields/AudioPlayerComponent.vue';
import AudioRecorderComponent from '@/components/fields/AudioRecorderComponent.vue';
import FileUploadComponent from '@/components/fields/FileUploadComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
// import ToastComponent from '@/components/toast/ToastComponent.vue'; // Sudah di-import di triggerToast
import { formatMethodLabel } from '@/helpers/formatMethodLabel';
import api from '@/utils/api';
// import { globalToast } from '@/utils/toast'; // Global toast tidak digunakan langsung
import { triggerToast } from '@/utils/toast'; // Asumsi triggerToast ada di sini
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Import komponen CanvasDrawerComponent yang baru
import CanvasDrawerComponent from '@/components/fields/CanvasDrawerComponent.vue';

const baseUrl = import.meta.env.VITE_APP_API_URL
const route = useRoute()
const router = useRouter()

// Modal & Toast State (Beberapa mungkin tidak terpakai, tapi dibiarkan)
const isModalShowed = ref(false);
const isConfirmOpen = ref(false);
const confirmMsg = ref('');
const isShowToast = ref(false);
const toastMsg = ref('');
const toastType = ref('success');
const isLoading = ref(false)

const id = route.params.id
const quizId = route.params.quizId
const quizData = ref([])
const questionsData = ref([])
const questionActive = ref({})
const questionActiveIndex = ref(0)
const answers = ref([])
const file = ref(null) // Untuk File object/Audio Blob
const currentQuestionStartTime = ref(null)

// --- STATE TAMBAHAN UNTUK CANVAS/UPLOAD ---
const isCanvasMode = ref(true); // Default: Gambar di Canvas
const canvasBase64 = ref(null); // Menampung output Base64 dari CanvasDrawerComponent
// --- AKHIR STATE TAMBAHAN ---

onMounted(async () => {
    await api.get(`/exercise/${id}/quiz/${quizId}`)
        .then((res) => {
            isLoading.value = true
            quizData.value = res.data.data
            initQuiz()
        })
        .catch((err) => {
            console.log(err);
        }).finally(() => {
            isLoading.value = false
        })
})

const initQuiz = async () => {
    questionsData.value = quizData.value.questions
    questionActive.value = questionsData.value[0]
    // Panggil openQuestion untuk inisiasi state pertama
    openQuestion(questionActive.value._id, 0);
}

const openQuestion = (id, index) => {
    // --- TEMPORARY HOLDER ---
    let nextQuestion = null;
    let nextIndex = null;

    if (id) {
        nextQuestion = questionsData.value.find(d => d._id == id)
        nextIndex = questionsData.value.findIndex(d => d._id == id)
    }
    if (index != null && index >= 0 && index < questionsData.value.length) {
        nextQuestion = questionsData.value[index]
        nextIndex = index
    }

    if (!nextQuestion) return; // Lindungi dari indeks yang tidak valid

    // --- RESET STATE ---
    file.value = null;
    canvasBase64.value = null;
    questionActive.value = nextQuestion;
    questionActiveIndex.value = nextIndex;

    // --- CEK JAWABAN TERSIMPAN & ATUR MODE INPUT ---
    const findAnswer = answers.value.find(d => d.questionId == questionActive.value._id)

    if ([1, 2, 4].includes(questionActive.value.method)) {
        // Metode memerlukan gambar/tulisan

        if (findAnswer) {
            const answerData = findAnswer.answer;

            if (typeof answerData === 'string' && answerData.startsWith('data:image')) {
                // Jawaban tersimpan adalah Base64 (diduga dari Canvas)
                isCanvasMode.value = true;
                canvasBase64.value = answerData;
                file.value = null;
            } else {
                // Jawaban tersimpan adalah File Object (diduga dari Upload)
                isCanvasMode.value = false;
                file.value = answerData;
                canvasBase64.value = null;
            }
        } else {
            // Belum ada jawaban, set default ke Canvas mode
            isCanvasMode.value = true;
        }

    } else {
        // Metode Audio (3, 5)
        isCanvasMode.value = false; // Mode canvas tidak berlaku
        if (findAnswer) {
            file.value = findAnswer.answer;
        }
    }
}

const saveAnswer = () => {
    try {
        let currentAnswerValue = null;
        let currentFileType = 'image/jpeg';
        let isAnswerValid = false;
        console.log(file.value);


        if ([1, 2, 4].includes(questionActive?.value?.method)) {
            // Logika untuk Gambar/Tulisan
            if (isCanvasMode.value) {
                // Mode Canvas
                currentAnswerValue = canvasBase64.value;
                currentFileType = 'image/png';
                isAnswerValid = !!currentAnswerValue;
            } else {
                // Mode Upload File
                currentAnswerValue = file.value;
                currentFileType = 'image/jpeg';
                isAnswerValid = !!currentAnswerValue;
            }

        } else if ([3, 5].includes(questionActive?.value?.method)) {
            // Logika untuk Audio
            currentAnswerValue = file.value;
            currentFileType = 'audio/wav';
            isAnswerValid = !!currentAnswerValue;
        }

        if (!isAnswerValid) {
            const modeName = ([1, 2, 4].includes(questionActive?.value?.method) && isCanvasMode.value) ?
                'Canvas' : ([1, 2, 4].includes(questionActive?.value?.method) && !isCanvasMode.value) ?
                    'Upload File' : 'Rekaman Suara';
            triggerToast(`${modeName} masih kosong. Isi jawaban Anda.`, 'warning');
            return;
        }

        triggerToast('Jawaban berhasil disimpan', 'success');

        const currentQuestionId = questionActive.value._id;
        const timeAnswered = new Date();
        const duration = (timeAnswered - currentQuestionStartTime.value) / 1000;

        const answerData = {
            questionId: currentQuestionId,
            fileType: currentFileType,
            answer: currentAnswerValue, // Ini bisa berupa File Object, Audio Blob, atau Base64 string
            duration: duration,
            timeOpened: currentQuestionStartTime.value,
            timeAnswered: timeAnswered,
        };

        const findAnswer = answers.value.find(d => d.questionId == currentQuestionId);

        if (findAnswer) {
            Object.assign(findAnswer, answerData); // Perbarui semua data
        } else {
            answers.value.push(answerData);
        }
    } catch (e) {
        console.error(e);
        triggerToast('Gagal menyimpan jawaban', 'error')
    }
}

const fileToBase64 = (params) => {
    // Jika params sudah berupa string base64, langsung kembalikan
    if (typeof params === 'string' && params.startsWith('data:')) {
        return Promise.resolve(params);
    }

    // Jika params adalah File/Blob, konversi
    if (params instanceof File || params instanceof Blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(params);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Jika bukan Base64 atau File/Blob, kembalikan null atau error
    return Promise.resolve(null);
};

const finishQuiz = async () => {
    // Pastikan semua File/Blob dikonversi ke Base64 sebelum dikirim
    const formattingPromises = answers.value.map(async (item) => {
        // Hanya konversi jika `answer` BUKAN Base64 string
        const base64Answer = await fileToBase64(item.answer);
        return {
            ...item,
            // Perhatikan: answer di sini menjadi Base64 string
            answer: base64Answer,
        };
    });

    const formattedAnswers = await Promise.all(formattingPromises);

    await api.post('/exercise/answer', {
        exerciseId: id,
        quizId: quizData.value._id,
        answers: formattedAnswers
    }).then(res => {
        router.push({ name: 'exercise.quiz.summary', params: { id: id, quizId: quizData.value.quizId } })
    }).catch(e => {
        console.log(e);
        triggerToast('Gagal menyelesaikan latihan', 'error');
    })
}

// START Confirmation Modal Handlers
const showConfirmation = () => {
    isConfirmOpen.value = true;
};

const handleConfirmAction = () => {
    finishQuiz();
    isConfirmOpen.value = false;
};

const handleCancelAction = () => {
    isConfirmOpen.value = false;
};
// END Confirmation Modal Handlers

watch(() => questionActiveIndex.value, () => {
    currentQuestionStartTime.value = new Date()
}, {
    immediate: true
})

</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'exercise.quiz.overview', params: { id, quizId } }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Soal</h1>
        </div>
        <div class="page-body">
            <ConfirmComponent v-if="isConfirmOpen" title="Selesaikan Latihan?"
                message="Apakah Anda Yakin Untuk Menyelesaikan Sesi Latihan?" confirmText="Simpan" cancelText="Batal"
                @confirm="handleConfirmAction" @cancel="handleCancelAction" />
            <div class="grid-container">
                <div v-if="isLoading" class="loading-state" style="background-color: unset;">
                    <div class="spinner" style="border-top-color: var(--Secondary-900);"></div>
                    <p>Sedang mengambil data...</p>
                </div>
                <div class="workspace" v-else>
                    <div class="method">{{ formatMethodLabel(questionActive?.method) }}</div>
                    <p class="guide">
                        <span v-if="[1, 2, 4].includes(questionActive?.method)">Jawab dengan menulis di kertas lalu
                            di-upload, atau menggambar di canvas.</span>
                        <span v-if="[3, 5].includes(questionActive?.method)">Rekam suara Anda sebagai jawaban.</span>
                    </p>
                    <div class="workspace-body">
                        <div class="question-display">
                            <AudioPlayerComponent v-if="questionActive?.method == 1"
                                :text="questionActive?.question?.value" displayStyle="text" />
                            <h2
                                v-else-if="questionActive?.method == 2 || questionActive?.method == 3 || questionActive?.method == 4">
                                {{
                                    questionActive?.question.value }}</h2>
                            <div class="object-color" v-if="questionActive?.question?.type == 'hex'"
                                :style="`background-color: ${questionActive?.question?.value}`"></div>
                            <div class="object-image" v-if="questionActive?.question?.type == 'path'">
                                <img :src="`${baseUrl}/api/v1/${questionActive?.question?.value}`" alt="Pertanyaan">
                            </div>
                        </div>

                        <div class="answer-box">
                            <h3>Jawaban</h3>

                            <div v-if="[1, 2, 4].includes(questionActive?.method)" class="input-mode-selector">
                                <ButtonComponent label="Gambar di Canvas" size="small"
                                    :class="isCanvasMode ? 'primary' : 'secondary'"
                                    @click="isCanvasMode = true; file = null" />
                                <ButtonComponent label="Upload Gambar" size="small"
                                    :class="!isCanvasMode ? 'primary' : 'secondary'"
                                    @click="isCanvasMode = false; canvasBase64 = null" />
                            </div>
                            <br v-if="[1, 2, 4].includes(questionActive?.method)">

                            <div v-if="[1, 2, 4].includes(questionActive?.method) && isCanvasMode">
                                <CanvasDrawerComponent v-model:file="canvasBase64" ref="canvasRef" />
                            </div>

                            <div v-else-if="[1, 2, 4].includes(questionActive?.method) && !isCanvasMode">
                                <FileUploadComponent v-model="file" :id="'file'" :infoText="'Upload gambar tulisan'"
                                    accept="image/*" />
                            </div>

                            <div v-else-if="questionActive?.method == 3 || questionActive?.method == 5">
                                <AudioRecorderComponent v-model="file" />
                                <br>
                                <AudioPlayerComponent v-if="file != null" :text="file" :isFile="true" :autoplay="false"
                                    displayStyle="player" />
                            </div>
                        </div>
                    </div>
                    <ButtonComponent label="Simpan Jawaban" @click="saveAnswer" />
                </div>

                <div class="navigation-container">
                    <div class="navigation">
                        <div class="navigation-header">
                            <h3 class="name">Navigasi</h3>
                        </div>
                        <div class="navigation-body">
                            <ul class="numbers">
                                <li :class="['number', { active: questionActive._id == item._id }]"
                                    v-for="(item, index) in questionsData" :key="index"
                                    @click="openQuestion(item._id, null)">{{ index + 1 }}</li>
                            </ul>
                        </div>
                        <div class="navigation-footer">
                            <ButtonComponent label="Sebelumnya" class="secondary" size="small" display="border"
                                @click="openQuestion(null, questionActiveIndex - 1)"
                                :isDisabled="questionsData.length == 1 || questionActiveIndex == 0" />
                            <ButtonComponent label="Selanjutnya" class="secondary" size="small" display="border"
                                @click="openQuestion(null, questionActiveIndex + 1)"
                                :isDisabled="questionActiveIndex == questionsData.length - 1" />
                        </div>
                    </div>
                    <div class="question-bank">
                        <ButtonComponent label="Selesaikan soal" class="secondary" size="full" display="border"
                            @click="showConfirmation" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.grid-container {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 30px;

    .method {
        padding: 10px 15px;
        background: var(--Secondary-900);
        width: fit-content;
        color: white;
        margin-bottom: 30px;
        border-radius: 15px;
    }

    .workspace {
        color: var(--Secondary-900);

        .workspace-body {
            min-height: 60vh;
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
            border: 1px solid var(--Neutral-300);
        }

        .object-image {
            width: 25%;

            img {
                width: 100%;
                border-radius: 10px;
                display: block;
            }
        }

        .question-display {
            font-size: 40px;
            margin-bottom: 20px;

            h2 {
                font-family: 'OpenDyslexic';
            }
        }

        .answer-box {
            font-size: 20px;
            margin-top: 30px;
            margin-bottom: 30px;

            h3 {
                margin-bottom: 20px;
            }
        }

        // Style untuk Tombol Pilihan Mode Input
        .input-mode-selector {
            display: flex;
            gap: 10px;
        }
    }

    .navigation-container {
        display: flex;
        flex-direction: column;
        gap: 30px;
        position: sticky;
        top: 20px;
        height: fit-content;
    }

    .navigation {
        background-color: var(--White);
        padding: 30px;
        border-radius: 10px;

        .navigation-header {
            margin-bottom: 10px;

            h3 {
                color: var(--Secondary-900);
                font-size: larger;
            }
        }

        .navigation-body {
            margin-bottom: 10px;

            .numbers {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 5px;
                margin-bottom: 10px;

                .number {
                    list-style: none;
                    color: var(--Secondary-900);
                    border: 2px solid var(--Secondary-900);
                    border-radius: 5px;
                    width: 45px;
                    height: 45px;
                    font-weight: bold;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s, color 0.2s;

                    &:hover {
                        background-color: var(--Info-100);
                    }

                    &.active {
                        background-color: var(--Info-200);
                        color: var(--White);
                        border-color: var(--Info-200);
                    }
                }
            }
        }

        .navigation-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }
    }

    .question-bank {
        background-color: var(--White);
        padding: 30px;
        border-radius: 10px;
    }
}

/* --- RESPONSIVE --- */

/* Target Tablet Besar */
@media (max-width: 1024px) {
    .grid-container {
        grid-template-columns: 1fr;

        .navigation-container {
            order: -1;
            position: relative;
            top: 0;
        }
    }
}

/* Target Ponsel */
@media (max-width: 768px) {
    .grid-container {
        gap: 20px;

        .workspace {
            .guide {
                font-size: 16px;
            }

            .question-display {
                font-size: 28px;
            }

            .object-color {
                width: 100%;
                height: 100px;
            }

            .object-image {
                width: 100%;
            }

            .answer-box {
                font-size: 18px;
                margin-top: 20px;
                margin-bottom: 20px;

                h3 {
                    margin-bottom: 15px;
                }
            }
        }

        .navigation {
            padding: 20px;

            .navigation-body .numbers {
                grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
            }
        }

        .question-bank {
            padding: 20px;
        }
    }
}
</style>