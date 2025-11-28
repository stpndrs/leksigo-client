<script setup>
import { computed, ref, watch } from 'vue';
import { useQuizStore } from '@/stores/quiz';
// Import semua komponen
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import FileUploadComponent from '@/components/fields/FileUploadComponent.vue';
import AudioRecorderComponent from '@/components/fields/AudioRecorderComponent.vue';
import AudioPlayerComponent from '@/components/fields/AudioPlayerComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import { useRouter } from 'vue-router';
import { triggerToast } from '@/utils/toast';

const router = useRouter()
const quizStore = useQuizStore();
const currentQuestionStartTime = ref(null);

// Computed property untuk v-model (tidak ada perubahan)
const currentAnswer = computed({
    get() {
        const questionId = quizStore.currentQuestion?._id;
        // Cek juga file di dalam objek jawaban
        return quizStore.answers[questionId]?.file || null;
    },
    set(file) {
        // Saat file diubah, simpan sementara saja
        // Waktu akan dihitung saat 'Simpan & Lanjutkan' diklik
        const questionId = quizStore.currentQuestion?._id;
        if (questionId) {
            // Ambil data jawaban yang sudah ada atau buat objek baru
            const existingAnswer = quizStore.answers[questionId] || {};
            quizStore.saveCurrentAnswer({
                ...existingAnswer, // Pertahankan data waktu yang mungkin sudah ada
                file: file // Perbarui filenya
            });
        }
    }
});

// Gunakan 'watch' untuk mencatat waktu setiap kali soal berganti
watch(() => quizStore.currentQuestionIndex, () => {
    // Catat timestamp saat soal baru ditampilkan
    currentQuestionStartTime.value = new Date();
    console.log(`Soal ${quizStore.currentQuestionIndex + 1} dibuka pada:`, currentQuestionStartTime.value);
}, {
    // `immediate: true` agar berjalan juga untuk soal pertama
    immediate: true
});

// Modifikasi fungsi 'saveAnswerAndNext'
const saveAnswerAndNext = () => {
    const timeAnswered = new Date();
    // Hitung durasi dalam milidetik
    const duration = timeAnswered - currentQuestionStartTime.value;

    const questionId = quizStore.currentQuestion?._id;
    const fileToSave = currentAnswer.value; // Ambil file saat ini dari computed

    if (questionId) {
        // Siapkan paket data jawaban yang lengkap
        const answerData = {
            file: fileToSave,
            timeOpened: currentQuestionStartTime.value,
            timeAnswered: timeAnswered,
            duration: duration // Durasi dalam milidetik
        };

        // Simpan paket lengkap ini ke store
        quizStore.saveCurrentAnswer(answerData);
    }

    // Pindah ke soal berikutnya
    quizStore.nextQuestion();
};


const getQuestionDisplayType = (question) => {
    // Method 5 bisa berupa gambar atau warna
    if (quizStore.method === 5) {
        return question.question.type; // 'image' atau 'color'
    }
    // Method 1 adalah audio
    if (quizStore.method === 1) {
        return 'audio';
    }
    // Sisanya adalah teks
    return 'text';
};


const isSubmitting = ref(false)
const finishSession = async () => {
    isSubmitting.value = true;
    try {
        const res = await quizStore.submitAnswers();

        console.log(res);
        router.push({ name: 'exercise.summary' })

        triggerToast('Sesi berhasil diselesaikan!', 'success');
        // Arahkan ke halaman lain
    } catch (error) {
        console.log(error)
        triggerToast('Gagal mengirim jawaban.', 'error');
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'exercise.overview' }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Soal</h1>
        </div>
        <div class="page-body">
            <div class="grid-container">
                <div class="workspace" v-if="!quizStore.isQuizFinished && quizStore.currentQuestion">
                    <p class="guide">
                        <span v-if="[1, 2, 4].includes(quizStore.method)">Tulislah jawaban di kertas, lalu upload
                            sebagai foto/gambar.</span>
                        <span v-if="[3, 5].includes(quizStore.method)">Rekam suara Anda sebagai jawaban.</span>
                    </p>
                    <div class="workspace-body">
                        <div class="question-display">
                            <AudioPlayerComponent v-if="getQuestionDisplayType(quizStore.currentQuestion) === 'audio'"
                                :text="quizStore.currentQuestion.question.value" />
                            <img v-else-if="getQuestionDisplayType(quizStore.currentQuestion) === 'image'"
                                :src="quizStore.currentQuestion.question.value" alt="Soal Gambar"
                                class="question-image" />
                            <div v-else-if="getQuestionDisplayType(quizStore.currentQuestion) === 'color'"
                                class="question-color-box"
                                :style="{ backgroundColor: quizStore.currentQuestion.question.value }"></div>
                            <h1 v-else class="question">
                                {{ quizStore.currentQuestion.question.value }}
                            </h1>
                        </div>

                        <div class="answer-box">
                            <h3>Jawaban</h3>
                            <FileUploadComponent v-if="[1, 2, 4].includes(quizStore.method)" v-model="currentAnswer"
                                :id="`question-input-${quizStore.currentQuestion._id}`" />
                            <AudioRecorderComponent v-if="[3, 5].includes(quizStore.method)" v-model="currentAnswer" />
                        </div>
                    </div>
                    <ButtonComponent label="Simpan & Lanjutkan" @click="saveAnswerAndNext" />
                </div>

                <aside>
                    <div class="navigations">
                        <h3>Navigasi</h3>
                        <ul class="navigation-container">
                            <li v-for="(question, index) in quizStore.questions" :key="question._id" class="navigation"
                                :class="{ active: quizStore.currentQuestionIndex === index }"
                                @click="quizStore.goToQuestion(index)">
                                {{ index + 1 }}
                            </li>
                        </ul>
                        <div class="navigation-footer">
                            <ButtonComponent display="border" label="Sebelumnya" @click="quizStore.previousQuestion" />
                            <ButtonComponent display="border" label="Selanjutnya" @click="quizStore.nextQuestion" />
                        </div>
                    </div>
                    <div class="endsession">
                        <ButtonComponent display="border" label="Selesaikan Sesi" size="full" class="danger"
                            @click="finishSession" />
                    </div>
                </aside>
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
    grid-template-columns: 70% 29%;
    gap: 30px;


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

        .question {
            font-size: 40px;
            margin-bottom: 20px;
        }

        .answer-box {
            font-size: 20px;
            margin-bottom: 30px;
        }

        button {
            bottom: 0;
        }
    }

    .navigations {
        background-color: var(--White);
        padding: 30px;
        border-radius: 10px;

        h3 {
            color: var(--Secondary-900);
            margin-bottom: 10px;
        }

        .navigation-container {
            display: grid;
            grid-template-columns: repeat(5, 19.5%);
            gap: 5px;

            .navigation {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 15px 10px;
                border: 1px solid var(--Secondary-900);
                border-radius: 5px;
                color: var(--Secondary-900);
                // width: fit-content;
                font-size: 25px;
                list-style: none;

                &.active {
                    background-color: var(--Secondary-900);
                    color: var(--White);
                }

                cursor: pointer;

                &:hover:not(.active) {
                    background-color: var(--Info-200);
                    color: var(--White);
                }
            }

            margin-bottom: 20px;
        }

        .navigation-footer {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }

        margin-bottom: 30px;
    }

    .endsession {
        background-color: var(--White);
        padding: 30px;
        border-radius: 10px;
    }

}
</style>