<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import { formatDate } from '@/helpers/formatDate';
import { useQuizStore } from '@/stores/quiz';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
const data = ref([])
const histories = ref([])

function analyzeExerciseHistory(exerciseData) {
    if (!exerciseData || !exerciseData.questions) return [];
    const { questions } = exerciseData;

    const groupAnswersByIndex = (questionList) => {
        const grouped = [];
        let maxAttempts = 0;
        for (const q of questionList) {
            if (q.answers && q.answers.length > maxAttempts) {
                maxAttempts = q.answers.length;
            }
        }
        for (let i = 0; i < maxAttempts; i++) {
            const attemptGroup = [];
            for (const q of questionList) {
                attemptGroup.push(q.answers[i] || null);
            }
            grouped.push(attemptGroup);
        }
        return grouped;
    };

    const attempts = groupAnswersByIndex(questions);
    const historySummary = [];

    attempts.forEach((attemptAnswers, index) => {
        let totalPoints = 0;
        let attemptDate = null;
        const answeredQuestions = [];
        const unansweredQuestions = [];

        attemptAnswers.forEach((answer, questionIndex) => {
            const originalQuestion = questions[questionIndex];
            if (answer) {
                totalPoints += parseFloat(answer.similarityPoint) || 0;
                if (!attemptDate) attemptDate = new Date(answer.timeAnswered);
                answeredQuestions.push({
                    text: originalQuestion.question.value,
                    yourAnswer: answer.answer.text,
                    point: parseFloat(answer.similarityPoint) || 0,
                });
            } else {
                unansweredQuestions.push({
                    text: originalQuestion.question.value,
                });
            }
        });

        historySummary.push({
            attemptNumber: index + 1,
            date: attemptDate,
            totalPoints: parseFloat(totalPoints.toFixed(2) / (answeredQuestions.length + unansweredQuestions.length)),
            answeredCount: answeredQuestions.length,
            unansweredCount: unansweredQuestions.length,
            details: {
                answered: answeredQuestions,
                unanswered: unansweredQuestions,
            }
        });
    });

    return historySummary;
}

onMounted(async () => {
    const id = route.params.id
    api.get(`/exercise/${id}`)
        .then((res) => {
            data.value = res.data.data

            histories.value = analyzeExerciseHistory(data.value)
            console.log(histories.value)
        })
        .catch((err) => {
            console.log(err);
        })

})


const quizStore = useQuizStore()

const start = () => {
    quizStore.loadQuiz(data.value);

    // Arahkan ke halaman pengerjaan kuis
    router.push({ name: 'exercise.quiz' }); // Ganti dengan nama route Anda
}
</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'childs.index' }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Mengerjakan Latihan</h1>
        </div>
        <div class="page-body">
            <div class="card">
                <div class="card-header">
                    <h3>{{ data?.name }}</h3>
                    <div class="level-container">
                        <div :class="['item', { active: data?.level == 1 }]">1</div>
                        <div :class="['item', { active: data?.level == 2 }]">2</div>
                        <div :class="['item', { active: data?.level == 3 }]">3</div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="description">
                        <p>{{ data?.description }}</p>
                    </div>
                    <div class="data">
                        <div class="date">Tanggal Ditambahkan : <span>{{ formatDate(data?.createdAt) }}</span></div>
                        <div class="questionTotal">Jumlah Soal : <span>{{ data?.questions?.length }}</span></div>
                        <div class="point">Poin Lolos : <span>60</span></div>
                    </div>
                    <div class="categories">
                        <p>Tipe Latihan</p>
                        <div class="categories-grid">
                            <div class="category active">{{ data?.methodLabel }}</div>
                            <!-- <div class="category">Menulis</div> -->
                        </div>
                    </div>
                    <div class="action">
                        <ButtonComponent label="Mulai Mengerjakan" @click="start" />
                    </div>
                </div>
                <div class="card-footer">
                    <h3>Riwayat Pengerjaan</h3>
                    <hr>
                    <div class="history-container">
                        <p class="nodata" v-if="!histories">Belum ada riwayat pengerjaan</p>
                        <div class="item" v-for="(item, index) in histories" :key="index">
                            <div class="left">
                                <h3 class="point">{{ item.totalPoints }} Point</h3>
                                <p class="date">Tanggal : {{ formatDate(item.date) }}</p>
                            </div>
                            <div class="right">
                                <div class="worked">Soal Dikerjakan : {{ item.answeredCount }}</div>
                                <div class="notworked">Soal Tidak Dikerjakan : {{ item.unansweredCount }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-header {
    h1 {
        color: var(--Secondary-900) !important;
    }

    svg path {
        fill: var(--Secondary-900) !important;
    }


}

.page-body {
    h3 {
        color: var(--Secondary-900);
        font-size: 30px;
        text-transform: capitalize;
    }

    .card {
        padding: 5rem;
        border-radius: 10px;
        background-color: var(--White);
        box-shadow: 0 5.192px 31.153px 0 rgba(0, 0, 0, 0.25);

        .card-header {
            display: grid;
            grid-template-columns: 80% auto;
            align-items: center;
            margin-bottom: 40px;

            .level-container {
                display: grid;
                grid-template-columns: auto auto auto;
                gap: 20px;

                .item {
                    padding: 25px 20px;
                    border-radius: 10px;
                    font-size: 30px;
                    font-weight: bold;
                    font-family: 'Ubuntu Sans';
                    border: 2px solid;
                    text-align: center;

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

        .card-body {
            display: grid;
            grid-template-columns: 50% 49%;
            gap: 50px;
            // background: red;
            position: relative;
            margin-bottom: 40px;

            .description {
                font-size: 20px;
                color: var(--Neutral-700);
            }

            .data {
                justify-items: end;
                width: 100%;
                text-align: justify;
                color: var(--Secondary-900);
                font-size: 25px;

                .date,
                .questionTotal,
                .point {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }
            }

            .categories {
                font-size: 20px;
                color: var(--Neutral-700);

                .category {
                    color: var(--Secondary-900);
                    padding: 5px 15px;
                    border: 1px solid var(--Secondary-900);
                    border-radius: 30px;
                    width: fit-content;
                }

                .categories-grid {
                    margin-top: 10px;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    gap: 10px;
                }

                .category.active {
                    background-color: var(--Secondary-900);
                    color: var(--White)
                }
            }

            .action {
                justify-items: end;
            }
        }

        .card-footer {
            hr {
                border: 1px solid var(--Secondary-900);
                margin: 10px 0;
                margin-bottom: 30px;
            }

            .history-container {
                .nodata {
                    text-align: center;
                    color: var(--Secondary-900);
                    font-size: 20px;
                }

                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 30px;
                    border: 2px solid var(--Secondary-900);
                    border-radius: 10px;
                    margin-bottom: 10px;

                    .point {
                        font-weight: bold;
                    }

                    .date {
                        font-size: 20px;
                        color: var(--Secondary-900);
                    }

                    .worked {
                        color: var(--Secondary-900);
                        font-size: 20px;
                    }

                    .notworked {
                        color: var(--Primary-900);
                        font-size: 20px;
                    }
                }
            }
        }
    }

}
</style>