// src/stores/quiz.js
import api from '@/utils/api';
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router';

const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const useQuizStore = defineStore('quiz', () => {
    // === STATE ===
    const router = useRouter()
    // State baru untuk menyimpan info kuis
    const quizId = ref(null);
    const quizName = ref('');
    const method = ref(null); // <-- State penting yang hilang!

    // State yang sudah ada
    const questions = ref([]);
    const currentQuestionIndex = ref(0);
    const answers = ref({});
    const latestQuiz = ref([])

    // === GETTERS ===
    const currentQuestion = computed(() => {
        return questions.value[currentQuestionIndex.value];
    });

    const isQuizFinished = computed(() => {
        return currentQuestionIndex.value >= questions.value.length;
    });

    // === ACTIONS ===
    // Ganti `loadQuestions` menjadi `loadQuiz` yang menerima seluruh data
    function loadQuiz(quizData) {
        // Simpan semua informasi relevan dari data kuis
        quizId.value = quizData._id;
        quizName.value = quizData.name;
        method.value = quizData.method; // <-- Menyimpan method di sini
        questions.value = quizData.questions;

        // Reset state pengerjaan
        currentQuestionIndex.value = 0;
        answers.value = {};
    }

    function saveCurrentAnswer(answerData) {
        // answerData adalah objek lengkap, bukan hanya file
        if (currentQuestion.value) {
            const questionId = currentQuestion.value._id;
            answers.value[questionId] = answerData;
        }
    }

    function nextQuestion() {
        if (currentQuestionIndex.value < questions.value.length) {
            currentQuestionIndex.value++;
        }
    }

    function previousQuestion() {
        if (currentQuestionIndex.value > 0) {
            currentQuestionIndex.value--;
        }
    }

    function goToQuestion(index) {
        if (index >= 0 && index < questions.value.length) {
            currentQuestionIndex.value = index;
        }
    }

    function resetQuiz() {
        // Reset semua state ke nilai awal
        quizId.value = null;
        quizName.value = '';
        method.value = null;
        questions.value = [];
        currentQuestionIndex.value = 0;
        answers.value = {};
    }

    async function submitAnswers() {
        console.log("Mempersiapkan pengiriman jawaban...");

        const formattedAnswers = [];
        for (const questionId in answers.value) {
            const answerData = answers.value[questionId]; // Ini adalah objek jawaban
            const file = answerData.file;

            if (file) {
                const base64String = await fileToBase64(file);

                formattedAnswers.push({
                    questionId: questionId,
                    answer: base64String,
                    fileType: file.type,
                    // Tambahkan data waktu dari answerData
                    duration: answerData.duration,
                    timeOpened: answerData.timeOpened,
                    timeAnswered: answerData.timeAnswered,
                });
            }
        }

        // ... (sisa fungsi submitAnswers tidak berubah)
        const payload = {
            quizId: quizId.value,
            answers: formattedAnswers,
        };

        try {
            await api.post('/exercise/answer', payload)
                .then((res) => {
                    latestQuiz.value = res.data.data
                    console.log(latestQuiz.value)

                    return res.data
                })
        } catch (error) {
            console.error('Gagal mengirim jawaban:', error);
            throw error; // Lempar error agar bisa ditangani di komponen
        }
    }

    // Jangan lupa ekspor state dan actions yang baru/diubah
    return {
        quizId,
        quizName,
        method, // <-- Ekspor method
        questions,
        currentQuestionIndex,
        answers,
        latestQuiz,
        currentQuestion,
        isQuizFinished,
        loadQuiz, // <-- Ganti nama action
        saveCurrentAnswer,
        nextQuestion,
        previousQuestion,
        goToQuestion,
        resetQuiz,
        submitAnswers
    };
});