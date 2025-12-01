<script setup>
import HorrayComponent from '@/components/alerts/HorrayComponent.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import HorrayIcon from '@/components/shape/HorrayIcon.vue';
import { formatDate } from '@/helpers/formatDate';
import { useQuizStore } from '@/stores/quiz';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Vue3Lottie } from 'vue3-lottie';
import horrayAnimation from '../../assets/images/horray_animation.json'


const isShowHorray = ref(true)
const route = useRoute()
const router = useRouter()
const data = ref([])
const id = route.params.id
const quizId = route.params.quizId
const correctAnswer = ref(0)
const isLoading = ref(false)

onMounted(async () => {
    api.get(`/exercise/${id}/quiz/${quizId}`)
        .then((res) => {
            isLoading.value = true
            data.value = res.data.data

            data.value.answers.map(d => {
                if (d.similarityPoint > 0) correctAnswer.value++
            })
        })
        .catch((err) => {
            console.log(err);
        }).finally(() => {
            isLoading.value = false
        })
})
</script>

<template>

    <HorrayComponent @close="isShowHorray = false" v-if="isShowHorray" />
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'exercise.quiz.list', params: { id: id } }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Hasil Latihan</h1>
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
                <div v-if="isLoading" class="loading-state" style="background: unset;">
                    <div class="spinner" style="border-top-color: var(--Secondary-900);"></div>
                    <p>Sedang mengambil data...</p>
                </div>
                <div class="card-body" v-else>
                    <div class="description">
                        <div v-html="data?.description"></div>
                    </div>
                    <div class="data">
                        <div class="date">Tanggal Dikerjakan : <span>{{ formatDate(data?.date) }}</span></div>
                        <div class="questionTotal">Jumlah Soal : <span>{{ data?.questions?.length }} Soal</span></div>
                        <div class="point">Poin Lolos : <span>60 Poin</span></div>
                    </div>
                    <div class="summary-data">
                        <p>Perolehan Poin : <span>{{ data?.quizPoint }} Poin</span></p>
                        <p>Soal Dikerjakan : <span>{{ data?.answers?.length }} Soal</span></p>
                        <p>Soal Tidak Dikerjakan : <span>{{ data?.questions?.length - data?.answers?.length }}
                                Soal</span></p>
                        <br>
                        <p>Soal Benar : <span>{{ correctAnswer }}
                                Soal</span></p>
                        <p>Soal Salah : <span>{{ data?.answers?.length - correctAnswer }}
                                Soal</span></p>
                        <h1 v-html="data?.quizPoint >= 60 ? 'Lulus' : 'Tidak Lulus'"></h1>
                    </div>
                    <div class="action">
                        <!-- <HorrayIcon class="icon" /> -->
                        <Vue3Lottie style="width: 60%;" :animationData="horrayAnimation" :loop="true"
                            :autoPlay="true" />
                        <div class="btn-group">
                            <ButtonComponent label="Coba Lagi" display="border" class="secondary"
                                @click="router.push({ name: 'exercise.quiz.overview', params: { id: id, quizId: quizId } })" />
                            <ButtonComponent label="Selesai" class="secondary"
                                @click="router.push({ name: 'exercise.quiz.list', params: { id: id } })" />
                        </div>
                        <ButtonComponent label="Penilaian Perilaku" class="secondary" display="border"
                            @click="router.push({ name: 'exercise.attitude', params: { id: route.params.id, quizId: quizId } })"
                            size="full" />
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
            grid-template-columns: 1fr auto; // <-- Diubah dari 80%
            align-items: center;
            margin-bottom: 40px;
            gap: 30px; // <-- Tambahkan gap

            .level-container {
                display: grid;
                grid-template-columns: auto auto auto;
                gap: 20px;
                justify-content: end; // <-- Pastikan rata kanan

                .item {
                    padding: 25px 20px;
                    border-radius: 10px;
                    font-size: 30px;
                    font-weight: bold;
                    font-family: 'Ubuntu Sans';
                    border: 2px solid;
                    text-align: center;
                    cursor: default; // <-- Tidak perlu diklik

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
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            position: relative;
            margin-bottom: 40px;

            .description {
                font-size: 20px;
                color: var(--Neutral-700);

                // Atur agar style HTML dari v-html terlihat
                :deep(p) {
                    margin-bottom: 1rem;
                }

                :deep(ul) {
                    padding-left: 20px;
                }
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
                    margin-bottom: 5px; // <-- Tambah jarak kecil

                    span {
                        font-weight: bold;
                    }
                }
            }

            .summary-data {
                p {
                    color: var(--Secondary-900);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 25px;
                    margin-bottom: 5px; // <-- Tambah jarak kecil

                    span {
                        font-size: 25px;
                        font-weight: bold;
                    }
                }

                h1 {
                    font-size: 50px;
                    color: var(--Primary-900);
                    margin-top: 30px;
                }
            }

            .action {
                display: flex; // <-- Tambahan
                flex-direction: column; // <-- Tambahan
                justify-content: space-between; // <-- Tambahan

                .icon {
                    width: 100%;
                }

                .btn-group {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 30px;
                }
            }
        }

        .card-footer {

            // Style ini tidak ada di HTML Anda
            hr {
                border: 1px solid var(--Secondary-900);
                margin: 10px 0;
            }

            .quiz-container {
                .nodata {
                    text-align: center;
                    color: var(--Secondary-900);
                    font-size: 20px;
                }
            }
        }
    }
}


/* --- RESPONSIVE --- */

/* Target Tablet (Large) */
@media (max-width: 1024px) {
    .page-body .card {
        padding: 3rem; // Kurangi padding

        .card-header {
            grid-template-columns: 1fr; // <-- Pecah header jadi 1 kolom
            gap: 25px;
            justify-items: start; // Ratakan kiri

            .level-container {
                justify-content: start; // Ratakan kiri
            }
        }

        .card-body {
            grid-template-columns: 1fr; // <-- Pecah body jadi 1 kolom
            gap: 30px;

            .action {
                .icon {
                    max-width: 300px; // <-- Batasi lebar ikon
                    align-self: center; // <-- Pusatkan ikon
                    order: -1; // <-- Pindahkan ikon ke atas
                    margin-bottom: 30px;
                }

                .btn-group {
                    margin-bottom: 15px; // Kurangi margin
                }
            }
        }
    }
}

/* Target Ponsel */
@media (max-width: 576px) {
    .page-body {
        h3 {
            font-size: 24px; // Kecilkan font
        }

        .card {
            padding: 1.5rem; // Padding super kecil

            .card-header .level-container {
                gap: 10px; // Kurangi gap

                .item {
                    padding: 15px 10px; // Kecilkan box
                    font-size: 22px; // Kecilkan font
                }
            }

            .card-body {
                gap: 40px; // Beri jarak lebih antar section

                .description,
                .data,
                .summary-data p {
                    font-size: 16px; // Kecilkan font
                }

                .data span,
                .summary-data p span {
                    font-size: 16px; // Samakan font
                }

                .summary-data h1 {
                    font-size: 32px; // Kecilkan font Lulus
                }

                .action {
                    .btn-group {
                        flex-direction: column; // Tumpuk tombol
                        width: 100%;

                        button {
                            width: 100%; // Penuhi layar
                        }
                    }
                }
            }
        }
    }
}
</style>