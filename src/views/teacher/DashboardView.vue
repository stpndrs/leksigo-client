<script setup>
import { authStore } from '@/stores/AuthStore';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';

const fullName = ref()
const data = ref([])

onMounted(async () => {
    fullName.value = authStore.user.fullName


    await api.get('/dashboard')
        .then(res => {
            data.value = res.data.data
        }).catch(err => {
            console.log(err)
        })
})
</script>

<template>
    <div class="container">
        <div class="page-header">
            <h1 class="page-title">Selamat Datang, {{ fullName }}</h1>
        </div>

        <div class="page-body">
            <div class="grid-container">
                <div class="card score">
                    <div class="card-header">
                        <h4>Perolehan Skor</h4>
                    </div>
                    <div class="card-body">
                        <div>
                            <h1>{{ data?.score?.highest }}</h1>
                            <p>Skor Tertinggi</p>
                        </div>
                        <div>
                            <h1>{{ data?.score?.lowest }}</h1>
                            <p>Skor Terendah</p>
                        </div>
                    </div>
                </div>
                <div class="card child">
                    <div class="card-header">
                        <h4>Perolehan Skor Anak Didik</h4>
                    </div>
                    <div class="card-body">
                        <div class="item" v-for="(item, index) in data?.scoreList" :key="index"
                            @click="$router.push({ name: 'childs.detail', params: { id: item.childId } })">
                            <span class="identity">
                                <span :class="`level level-` + item.level" v-if="item.level">{{ item.level }}</span>
                                <span class="name">{{ item.name }}</span>
                            </span>
                            <span class="score">{{ item.point }}</span>
                        </div>
                    </div>
                </div>
                <div class="card total">
                    <div class="card-header">
                        <h4>Jumlah Anak Didik</h4>
                    </div>
                    <div class="card-body">
                        <div class="item">
                            <span class="level level-1">Level 1</span>
                            <h3>{{ data?.childTotal?.levelOne }}</h3>
                            <p>Anak</p>
                        </div>
                        <div class="item">
                            <span class="level level-2">Level 2</span>
                            <h3>{{ data?.childTotal?.levelTwo }}</h3>
                            <p>Anak</p>
                        </div>
                        <div class="item">
                            <span class="level level-3">Level 3</span>
                            <h3>{{ data?.childTotal?.levelThree }}</h3>
                            <p>Anak</p>
                        </div>
                        <div class="item">
                            <span class="level nolevel">Belum Screening</span>
                            <h3>{{ data?.childTotal?.noLevel }}</h3>
                            <p>Anak</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 8px;

    .card {
        padding: 30px;
        background-color: var(--White);
        border-radius: 15px;
    }

    .card-header {
        font-size: 20px;
        color: var(--Secondary-900);
        margin-bottom: 15px;
    }

    .card.score {
        .card-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            text-align: center;
            color: var(--Secondary-900);

            h1 {
                font-size: 80px;
            }
        }
    }

    .level {
        padding: 10px 15px;
        border-radius: 5px;

        &.level-1 {
            background-color: var(--Secondary-500);
            color: var(--White);
        }

        &.level-2 {
            background-color: var(--Ternary-300);
            color: var(--White);
        }

        &.level-3 {
            color: var(--White);
            background-color: var(--Primary-500);
        }

        &.nolevel {
            color: var(--White);
            background-color: var(--System-dark);
        }
    }

    .card.child {
        grid-row: span 2 / span 2;

        .card-body {
            .item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border: 3px solid var(--Secondary-900);
                border-radius: 10px;
                cursor: pointer;
                transition: ease-in-out .2s;

                &:hover {
                    background-color: var(--Secondary-900);
                    border-radius: 10px;

                    .name,
                    .score {
                        color: var(--White);
                    }
                }

                .identity {
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    gap: 15px;
                }

                .name,
                .score {
                    color: var(--Secondary-900);
                    font-size: 25px;
                    font-weight: bold;
                }
            }
        }
    }

    .card.total {
        grid-row-start: 2;

        .card-body {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;

            /* Target Tablet (Medium) */
            @media (max-width: 1024px) {
                grid-template-columns: repeat(2, 1fr);
            }

            .item {
                color: var(--Secondary-900);
                text-align: center;
                display: flex;
                flex-direction: column;
                gap: 10px;

                h3 {
                    font-size: 45px;
                    font-weight: bold;
                }
            }
        }
    }

    /* Target Tablet (Medium) */
    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }

    /* Target Ponsel (Kecil) */
    @media (max-width: 768px) {
        .card {
            padding: 20px;
        }
    }
}
</style>