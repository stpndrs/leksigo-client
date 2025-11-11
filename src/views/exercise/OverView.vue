<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import EyeIcon from '@/components/shape/EyeIcon.vue';
import EyeSlashIcon from '@/components/shape/EyeSlashIcon.vue';
import { formatDate } from '@/helpers/formatDate';
import { useQuizStore } from '@/stores/quiz';
import { workStore } from '@/stores/WorkStore';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
const isWorkMode = workStore.isWorkMode
const id = route.params.id
const quizId = route.params.quizId
const data = ref([])

onMounted(async () => {
    getData()
})

const getData = async () => {
    await api.get(`/exercise/${id}/quiz/${quizId}`)
        .then((res) => {
            data.value = res.data.data
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
            <router-link :to="{ name: 'exercise.quiz.list', params: { id: id } }">
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
                    <ButtonComponent :label="!data.isHidden ? 'Sembunyikan' : 'Tampilkan'"
                        :icon="!data.isHidden ? EyeSlashIcon : EyeIcon" class="secondary" size="small" display="border"
                        @click="visibility" v-if="!isWorkMode" />
                </div>
                <div class="card-body">
                    <div class="description">
                        <div v-html="data?.description"></div>
                    </div>
                    <div class="data">
                        <div class="date">Tanggal Ditambahkan : <span>{{ formatDate(data?.date) }}</span></div>
                        <div class="questionTotal">Jumlah Soal : <span>{{ data?.questions?.length }}</span></div>
                        <div class="point">Poin Lolos : <span>60</span></div>
                    </div>
                    <div class="action">
                        <ButtonComponent label="Mulai Mengerjakan" class="secondary"
                            @click="router.push({ name: 'exercise.quiz.work', params: { id: id, quizId: quizId } })" />
                        <ButtonComponent label="Review pengerjaan sebelumnya" class="primary" display="border"
                            @click="router.push({ name: 'exercise.quiz.review', params: { id: id, quizId: quizId } })"
                            v-if="data?.answers?.length > 0" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>3

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
                    cursor: default; // Tidak perlu diklik di halaman ini

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
            grid-template-columns: 1fr 1fr; // <-- Diubah dari 50% 49%
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
                    margin-bottom: 10px; // <-- Tambah jarak
                }
            }

            .categories {
                // Style ini tidak ada di HTML Anda
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
                justify-items: start;

                button {
                    margin-bottom: 15px;
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

                .description {
                    font-size: 16px; // Kecilkan font
                }

                .data {
                    font-size: 18px; // Kecilkan font
                }

                .action button {
                    width: 100%; // Penuhi layar
                }
            }
        }
    }
}
</style>