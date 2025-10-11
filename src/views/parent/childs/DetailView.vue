<script setup>
import child from '@/assets/images/child.png'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import { formatDate } from '@/helpers/formatDate';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const code = route.params.code
const data = ref()
const points = ref(0)

onMounted(async () => {
    await api(`/childs/${code}`)
        .then((res) => {
            console.log(res);
            data.value = res.data.data
        }).catch((err) => {
            console.log(err);
        })


    data.value.exercises.forEach(element => {
        points.value += element.point ?? 0
    });
})
</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'childs.index' }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Data Anak Didik</h1>
        </div>
        <div class="page-body">
            <div class="detail">
                <!-- <img :src="child" alt="Child"> -->
                <div class="biodata">
                    <span class="score">
                        <p>Total Skor :</p>
                        <p class="value">{{ points }}</p>
                    </span>
                    <span class="name">
                        <p>Nama Anak :</p>
                        <p class="value">{{ data?.child.fullName }}</p>
                    </span>
                    <span class="name">
                        <p>Nama Orang Tua :</p>
                        <p class="value">{{ data?.parent.fullName }}</p>
                    </span>
                    <span class="name">
                        <p>Kode Unik :</p>
                        <p class="value">{{ data?.child.code }}</p>
                    </span>
                </div>
            </div>
            <div class="data">
                <div class="card exercises">
                    <div class="card-header">
                        <h3>Latihan</h3>
                    </div>
                    <div class="card-body">
                        <div class="item" v-for="(item, index) in data?.exercises" :key="index">
                            <div class="point">{{ item.point ?? 0 }}</div>
                            <div class="identity">
                                <p class="title">{{ item.name }}</p>
                                <p class="date">{{ formatDate(item.createdAt) }}</p>
                                <div class="category">{{ item.method }}</div>
                            </div>
                            <!-- hitung jumlah benar salah dari total jawaban yang benar, dibandingkan dengan jumlah soal -->
                            <!-- <div class="correction" v-if="item.point">15/<span>20</span></div> -->

                            <ButtonComponent label="Kerjakan Ulang Soal" size="small"
                                @click="$router.push({ name: 'exercise.overview', params: { id: item._id } })"
                                v-if="item.point" />
                            <ButtonComponent label="Kerjakan Soal" size="small"
                                @click="$router.push({ name: 'exercise.overview', params: { id: item._id } })" v-else />
                        </div>
                    </div>
                </div>
                <div class="card materials">
                    <div class="card-header">
                        <h3>Materi</h3>
                    </div>
                    <div class="card-body">
                        <div class="item" v-for="(item, index) in data?.materials" :key="index">
                            <p class="title">{{ item.title }}</p>
                            <div class="category">{{ item.method }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// .grid-container {
// display: grid;
// grid-template-columns: 30% 70%;
// color: var(--Neutral-700);
// gap: 30px;

.detail {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 30px;
}

img {
    width: 20rem;
    margin-bottom: 30px;
}

.biodata {
    width: 100%;

    span {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
    }

    .score {
        font-size: 40px;
        color: var(--Secondary-900);
    }

    .value {
        font-weight: bold;
        color: var(--Secondary-900);
        font-family: 'Ubuntu Sans';
    }
}

.data {
    display: grid;
    grid-template-columns: 50% 50%;
    justify-content: center;
    align-items: center;
    gap: 30px;

    .exercises.card {
        padding: 30px;
        background-color: var(--White);
        min-height: 100vh;
        width: 100%;
        border-radius: 10px;
        box-shadow: 0 5.192px 31.153px 0 rgba(0, 0, 0, 0.25);

        .card-header {
            color: var(--Secondary-900);
            font-size: 30px;
            margin-bottom: 20px;
        }

        .item {
            display: grid;
            grid-template-columns: 15% 60% 20%;
            border: 3px solid var(--Secondary-900);
            border-radius: 5px;
            gap: 10px;
            color: var(--Secondary-900);
            padding: 10px;
            margin-bottom: 20px;

            .point {
                font-size: 50px;
                padding-right: 10px;
                border-right: 3px dashed var(--Info-200);
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .identity {
                .title {
                    font-weight: bold;
                }

                .date {
                    margin-bottom: 5px;
                }

                .category {
                    font-size: small;
                    padding: 5px 15px;
                    border-radius: 5px;
                    width: fit-content;
                    color: var(--White);
                    background-color: var(--Secondary-900);
                }
            }

            .correction {
                font-size: 30px;
                display: flex;
                justify-content: center;
                align-items: center;

                span {
                    color: var(--Primary-900);
                }
            }

        }
    }

    .materials.card {
        padding: 30px;
        background-color: var(--White);
        min-height: 100vh;
        width: 100%;
        border-radius: 10px;
        box-shadow: 0 5.192px 31.153px 0 rgba(0, 0, 0, 0.25);

        .card-header {
            color: var(--Primary-900);
            font-size: 30px;
            margin-bottom: 20px;
        }

        .item {
            display: grid;
            grid-template-columns: auto 25%;
            align-items: center;
            border: 3px solid var(--Primary-900);
            border-radius: 5px;
            gap: 10px;
            color: var(--Primary-900);
            padding: 10px;
            margin-bottom: 20px;

            .title {
                font-weight: bold;
            }

            .category {
                font-size: small;
                padding: 5px 15px;
                border-radius: 5px;
                width: fit-content;
                color: var(--White);
                background-color: var(--Primary-900);
            }

        }
    }
}

// }</style>