<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import { formatDate } from '@/helpers/formatDate';
import { useQuizStore } from '@/stores/quiz';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const data = ref([])
const quizStore = useQuizStore();

onMounted(async () => {
    const id = route.params.id

    data.value = quizStore.latestQuiz
    console.log(data.value);
    
})
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
                        <ButtonComponent label="Mulai Mengerjakan" />
                    </div>
                </div>
                <div class="card-footer">
                    <h3>Riwayat Pengerjaan</h3>
                    <hr>
                    <div class="history-container">
                        <p class="nodata">Belum ada riwayat pengerjaan</p>
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