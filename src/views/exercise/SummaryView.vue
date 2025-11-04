<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import HorrayIcon from '@/components/shape/HorrayIcon.vue';
import { formatDate } from '@/helpers/formatDate';
import { useQuizStore } from '@/stores/quiz';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const data = ref([])
const history = ref({})
const id = route.params.id
const historyId = route.params.historyId

onMounted(async () => {
    api.get(`/exercise/${id}`)
        .then((res) => {
            data.value = res.data.data
            history.value = res.data.data.workHistories.find(d => d._id == historyId)
            // console.log(history.value.answers.length);

        })
        .catch((err) => {
            console.log(err);
        })
})
</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'exercise.overview', params: { id: id } }">
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
                <div class="card-body">
                    <div class="description">
                        <div v-html="data?.description"></div>
                    </div>
                    <div class="data">
                        <div class="date">Tanggal Dikerjakan : <span>{{ formatDate(history?.date) }}</span></div>
                        <div class="questionTotal">Jumlah Soal : <span>{{ data?.questions?.length }} Soal</span></div>
                        <div class="point">Poin Lolos : <span>60 Poin</span></div>
                    </div>
                    <div class="summary-data">
                        <p>Perolehan Poin : <span>{{ parseInt(history?.exercisePoint) }} Poin</span></p>
                        <p>Soal Dikerjakan : <span>{{ history?.answers?.length }} Soal</span></p>
                        <p>Soal Tidak Dikerjakan : <span>{{ data?.questions?.length - history?.answers?.length }}
                                Soal</span></p>
                        <h1 v-html="history?.exercisePoint >= 60 ? 'Lulus' : 'Tidak Lulus'"></h1>
                    </div>
                    <div class="action">
                        <HorrayIcon class="icon" />
                        <div class="btn-group">
                            <ButtonComponent label="Coba Lagi" display="border" class="secondary"
                                @click="router.push({ name: 'exercise.quiz', params: { id: route.params.id } })" />
                            <ButtonComponent label="Selesai" class="secondary"
                                @click="router.push({ name: 'exercise.overview', params: { id: id } })" />
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
            grid-template-columns: 1fr 1fr;
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
                .icon {
                    width: 100%;
                }

                .btn-group {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 15px;
                }

                // justify-items: end;
            }
        }

        .card-footer {
            hr {
                border: 1px solid var(--Secondary-900);
                margin: 10px 0;
            }

            .history-container {
                .nodata {
                    text-align: center;
                    color: var(--Secondary-900);
                    font-size: 20px;
                }
            }
        }
    }

}
</style>