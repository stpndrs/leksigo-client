<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ConfirmComponent from '@/components/confirm/ConfirmComponent.vue';
import AudioPlayerComponent from '@/components/fields/AudioPlayerComponent.vue';
import AudioRecorderComponent from '@/components/fields/AudioRecorderComponent.vue';
import FileUploadComponent from '@/components/fields/FileUploadComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import ToastComponent from '@/components/toast/ToastComponent.vue';
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
const questionsData = ref([])
const questionActive = ref({})
const questionActiveIndex = ref(0)
const answers = ref([])
const file = ref()
const currentQuestionStartTime = ref(null)

onMounted(async () => {
    await api.get(`/exercise/${id}/quiz/${quizId}`)
        .then((res) => {
            quizData.value = res.data.data
            initQuiz()
        })
        .catch((err) => {
            console.log(err);
        })
})

const initQuiz = async () => {
    questionsData.value = quizData.value.questions
    questionActive.value = questionsData.value[0]
}

const openQuestion = (id, index) => {
    if (id) {
        file.value = null
        questionActive.value = questionsData.value.find(d => d._id == id)
        questionActiveIndex.value = questionsData.value.findIndex(d => d._id == id)
    }
    if (index != null && index != questionsData.value.length) {
        file.value = null
        questionActive.value = questionsData.value[index]
        questionActiveIndex.value = index
    }

    // cek kondisi kalau sudah ada didalam array dari answers, maka attempt ke jawaban
    const findAnswer = answers.value.find(d => d.questionId == questionActive.value._id)
    if (findAnswer) {
        file.value = findAnswer.answer
    }
}

const saveAnswer = () => {
    try {
        handleToast('Berhasil menyimpan jawaban');

        const currentQuestionId = questionActive.value._id;

        const timeAnswered = new Date();
        const duration = timeAnswered - currentQuestionStartTime.value;

        let fileType = 'image/jpeg';
        if ([3, 5].includes(quizData?.value?.method)) {
            fileType = 'audio/wav';
        }

        const answerData = {
            questionId: currentQuestionId,
            fileType: fileType,
            answer: file.value,
            duration: duration,
            timeOpened: currentQuestionStartTime.value,
            timeAnswered: timeAnswered,
        };

        const findAnswer = answers.value.find(d => d.questionId == currentQuestionId);
        console.log(findAnswer);

        if (findAnswer) {
            findAnswer.answer = file.value;
            findAnswer.duration = duration;
            findAnswer.timeAnswered = timeAnswered;
            console.log("Jawaban diperbarui:", file.value);
        } else {
            answers.value.push(answerData);
            console.log("Jawaban baru ditambahkan");
        }
    } catch (e) {
        handleToast('Gagal menyimpan jawaban', 'error')
    }
}

const fileToBase64 = (params) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(params);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const finishQuiz = async () => {
    const formattingPromises = answers.value.map(async (item) => {
        const base64File = await fileToBase64(item.answer);
        return {
            ...item,
            answer: base64File
        };
    });
    const formattedAnswers = await Promise.all(formattingPromises);

    await api.post('/exercise/answer', {
        exerciseId: id,
        quizId: quizData.value._id,
        answers: formattedAnswers
    }).then(res => {
        router.push({ name: 'exercise.quiz.summary', params: { id: id, quizId: quizData.value.quizId } })
        console.log(res);
    }).catch(e => {
        console.log(e);
    })
}

// START Confirmation Modal Handlers
const showConfirmation = () => {
    isConfirmOpen.value = true;
};

const handleConfirmAction = () => {
    finishQuiz(); // Panggil fungsi submit utama
    isConfirmOpen.value = false; // Tutup modal
};

const handleCancelAction = () => {
    isConfirmOpen.value = false; // Tutup modal
};
// END Confirmation Modal Handlers

// START handleToast (Helper untuk Menampilkan Toast)
const handleToast = (msg, type) => {
    isShowToast.value = true;
    toastMsg.value = msg;
    toastType.value = type ?? 'success';
};
// END handleToast

// START Watcher untuk Toast
// (Menggunakan sistem 1 toast, bukan antrian array)
watch(() => isShowToast.value, () => {
    if (isShowToast.value == true) {
        setTimeout(() => {
            isShowToast.value = false;
        }, 3000);
    }
});
// END Watcher untuk Toast

watch(() => questionActiveIndex, () => {
    currentQuestionStartTime.value = new Date()
}, {
    immediate: true
})

</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'exercise.quiz.overview', params: {id, quizId} }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Soal</h1>
        </div>
        <div class="page-body">
            <ConfirmComponent v-if="isConfirmOpen" title="Selesaikan Latihan?"
                message="Apakah Anda Yakin Untuk Menyelesaikan Sesi Latihan?" confirmText="Simpan" cancelText="Batal"
                @confirm="handleConfirmAction" @cancel="handleCancelAction" />

            <ToastComponent :message="toastMsg" :type="toastType" v-show="isShowToast" />

            <div class="grid-container">
                <div class="workspace">
                    <div class="method">{{ formatMethodLabel(questionActive?.method) }}</div>
                    <p class="guide">
                        <span v-if="[1, 2, 4].includes(questionActive?.method)">Tulislah jawaban di kertas, lalu upload
                            sebagai foto/gambar.</span>
                        <span v-if="[3, 5].includes(questionActive?.method)">Rekam suara Anda sebagai jawaban.</span>
                    </p>
                    <div class="workspace-body">
                        <div class="question-display">
                            {{ questionActive?.question?.value }}
                            <!-- if 1 = tampilkan tag audio -->
                            <AudioPlayerComponent v-if="questionActive?.method == 1"
                                :text="questionActive?.question?.value" />
                            <!-- if 2 = tampilkan text untuk ditulis ulang -->
                            <!-- if 3 = tampilkan text dan recorder untuk dibaca -->
                            <!-- if 4 = mengurutkan kata -->
                            <h2 v-else-if="questionActive?.method == 2 || questionActive?.method == 3 || questionActive?.method == 4">{{
                                questionActive?.question.value }}</h2>
                            <!-- if 5 = menebak cepat -->
                            <!-- if isHexColor true -->
                            <div class="object-color" v-if="questionActive?.question?.type == 'hex'"
                                :style="`background-color: ${questionActive?.question?.value}`"></div>
                            <!-- if isImage true -->
                            <div class="object-image" v-if="questionActive?.question?.type == 'path'">
                                <img :src="`${baseUrl}/api/v1/${questionActive?.question?.value}`" alt="Pertanyaan">
                            </div>
                        </div>

                        <div class="answer-box">
                            <h3>Jawaban</h3>
                            <!-- if 1 = tampilkan field upload gambar -->
                            <FileUploadComponent v-if="[1, 2, 4].includes(questionActive?.method)" v-model="file" :id="'file'"
                                :infoText="'Upload gambar tulisan'" accept="image/*" />
                            <!-- else -->
                            <AudioRecorderComponent v-if="questionActive?.method == 3 || questionActive?.method == 5"
                                v-model="file" />
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
                                    @click="openQuestion(item._id, null)">
                                    {{ index + 1 }}</li>
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
/* Tambahkan style untuk soal gambar dan warna */
.question-image {
    max-width: 100%;
    max-height: 40vh;
    border-radius: 10px;
}

.question-color-box {
    width: 100%;
    height: 30vh;
    border-radius: 10px;
    border: 1px solid #eee;
}

.grid-container {
    display: grid;
    grid-template-columns: 75% auto;
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

        // background-color: black;

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
        }

        .object-image {
            width: 25%;

            img {
                width: 100%;
                border-radius: 10px;
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

        button {
            bottom: 0;
        }
    }

    .navigation {
        background-color: var(--White);
        padding: 30px;
        border-radius: 10px;
        margin-bottom: 30px;

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
                    text-align: center;
                    align-content: center;
                    font-weight: bold;
                    cursor: pointer;

                    &.active {
                        background-color: var(--Info-200);
                        color: var(--White);
                    }
                }

            }

            .add-number {
                color: var(--Secondary-900);
                border: 2px dashed var(--Secondary-900);
                border-radius: 5px;
                width: 45px;
                height: 45px;
                font-size: 30px;
                cursor: pointer;
                background-color: unset;
            }
        }

        .navigation-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }
    }

    .endsession {
        background-color: var(--White);
        padding: 30px;
        border-radius: 10px;
    }

}
</style>