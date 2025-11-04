<script setup>
import child from '@/assets/images/child.png'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import FilterModal from '@/components/modal/FilterModal.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import FilterIcon from '@/components/shape/FilterIcon.vue';
import { formatDate } from '@/helpers/formatDate';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const isFilterExerciseShowed = ref(false)
const isFilterMaterialShowed = ref(false)

const route = useRoute()
const router = useRouter()
const id = route.params.id
const data = ref()
const points = ref(0)
const dataContainer = ref(null)
const activeSlide = ref(0)

onMounted(async () => {
    await api(`/childs/${id}`)
        .then((res) => {
            console.log(res);
            data.value = res.data.data
        }).catch((err) => {
            console.log(err);
        })
    // OLAH DATA UNTUK TAMPILKAN POIN DI SETIAP LATIHAN
    data.value.exercises.map(element => {
        let exercisePoint = 0
        element.workHistories.map(d => {
            points.value += parseInt(d.exercisePoint) ?? 0
            exercisePoint += parseInt(d.exercisePoint)
        })
        return element.exercisePoint = exercisePoint
    })
    console.log(data.value);
})

/**
 * Fungsi untuk melakukan scrolling ke slide yang dipilih
 * @param {number} index - Indeks slide (0 untuk Latihan, 1 untuk Materi)
 */
const goToSlide = (index) => {
    if (!dataContainer.value) return;

    // Hitung posisi scroll: index * lebar container
    const scrollPosition = index * dataContainer.value.offsetWidth;

    // Lakukan smooth scroll
    dataContainer.value.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });

    // Perbarui state slide aktif
    activeSlide.value = index;
};

/**
 * Fungsi untuk mendeteksi slide aktif saat scrolling selesai
 */
const handleScroll = () => {
    if (!dataContainer.value) return;

    // Dapatkan posisi scroll horizontal saat ini
    const scrollLeft = dataContainer.value.scrollLeft;
    const containerWidth = dataContainer.value.offsetWidth;

    // Tentukan slide mana yang paling terlihat
    // Jika scrollLeft > (lebar container / 2), berarti slide kedua (index 1) yang aktif
    const slideIndex = Math.round(scrollLeft / containerWidth);

    // Perbarui state slide aktif
    activeSlide.value = slideIndex;
};


const handleFilterModal = (params) => {
    if (params == 'exercise') {
        isFilterExerciseShowed.value = !isFilterExerciseShowed.value
        isFilterMaterialShowed.value = false
    } else {
        isFilterExerciseShowed.value = false
        isFilterMaterialShowed.value = !isFilterMaterialShowed.value
    }
}

const handleDateFilter = (params) => {
    console.log(params);

    // olah data berdasarkan filter
}

const handleStatusFilter = (params) => {
    console.log(params);

    // olah data berdasarkan filter
}
</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'childs.index' }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Data Anak Didik Guru</h1>
        </div>
        <div class="page-body">
            <div class="detail">
                <img :src="child" alt="Child">
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
                    <span class="level">
                        <p>Level Anak </p>
                        <div class="level-container">
                            <div :class="['item', { active: data?.child?.level == 1 }]">1</div>
                            <div :class="['item', { active: data?.child?.level == 2 }]">2</div>
                            <div :class="['item', { active: data?.child?.level == 3 }]">3</div>
                        </div>
                    </span>
                    <ButtonComponent label="Laporan Perilaku" class="secondary" size="full" display="border" />
                </div>
            </div>
            <div class="data-wrapper">
                <div class="data-swiper" ref="dataContainer" @scroll="handleScroll">

                    <div class="swiper-slide-manual">
                        <div class="card exercises">
                            <FilterModal :handleModal="handleFilterModal" :handleDateFilter="handleDateFilter"
                                :handleStatusFilter="handleStatusFilter" type="exercise"
                                v-if="isFilterExerciseShowed" />
                            <div class="card-header">
                                <h3>Latihan</h3>
                                <FilterIcon class="filterIcon" @click="handleFilterModal('exercise')" />
                            </div>
                            <div class="card-body">
                                <div class="item" v-for="(item, index) in data?.exercises" :key="index"
                                    @click="$router.push({ name: 'exercise.overview', params: { id: item._id } })">
                                    <div class="point">{{ item?.exercisePoint ?? 0 }}</div>
                                    <div class="identity">
                                        <p class="title">{{ item.name }}</p>
                                        <p class="date">{{ formatDate(item.createdAt) }}</p>
                                        <div class="category">{{ item.method }}</div>
                                    </div>
                                    <div class="question">
                                        <span class="worked" v-if="points">{{ item?.workHistories?.answers?.length
                                            }}</span> <span v-show="points">/</span>
                                        <span class="total">20</span>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <ButtonComponent label="Buat Soal" class="secondary" size="large"
                                    @click="$router.push({ name: 'exercise.create', params: id })" />
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide-manual">
                        <div class="card materials">
                            <FilterModal :handleModal="handleFilterModal" :handleDateFilter="handleDateFilter"
                                :handleStatusFilter="handleStatusFilter" type="material"
                                v-if="isFilterMaterialShowed" />
                            <div class="card-header">
                                <h3>Materi</h3>
                                <FilterIcon class="filterIcon" @click="handleFilterModal('material')" />
                            </div>
                            <div class="card-body">
                                <div class="item" v-for="(item, index) in data?.materials" :key="index"
                                    @click="router.push({ name: 'material.overview', params: { id: id, materialId: item._id } })">
                                    <p class="title">{{ item.title }}</p>
                                    <div class="category">{{ item.method }}</div>
                                </div>
                            </div>
                            <div class="card-footer">
                                <ButtonComponent label="Buat Materi" class="primary" size="large"
                                    @click="$router.push({ name: 'material.create', params: id })" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="swiper-pagination-manual">
                    <span :class="['dot', { 'active': activeSlide === 0 }]" @click="goToSlide(0)"></span>
                    <span :class="['dot', { 'active': activeSlide === 1 }]" @click="goToSlide(1)"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.page-body {
    display: grid;
    grid-template-columns: 1fr 2fr;
    justify-content: space-between;
    color: var(--Neutral-700);
    gap: 30px;
    overflow-x: hidden;

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
            margin-bottom: 10px;
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

        button {
            margin-top: 30px;
        }
    }

    // Wrapper untuk Swiper dan Pagination Manual
    .data-wrapper {
        display: flex;
        flex-direction: column;
    }

    .data-swiper {
        display: flex;
        overflow-x: scroll; // Aktifkan scrolling horizontal
        scroll-snap-type: x mandatory; // Kunci scroll ke slide
        width: 100%;
        gap: 30px; // Jarak antar slide

        // Sembunyikan scrollbar
        &::-webkit-scrollbar {
            display: none;
        }

        -ms-overflow-style: none;
        /* IE and Edge */
        scrollbar-width: none;
        /* Firefox */

        .swiper-slide-manual {
            flex-shrink: 0; // Penting: mencegah slide mengecil
            width: 80%; // Setiap slide mengambil 100% lebar container yang terlihat
            scroll-snap-align: start; // Kunci snap di awal slide

            // Atur agar card memenuhi slide
            .card {
                width: 100%;
                min-height: 100vh; // Pertahankan tinggi minimal jika perlu
                border-radius: 10px;
                padding: 30px;

                .card-header {
                    font-size: 30px;
                    margin-bottom: 20px;
                }
            }

            .filterIcon {
                cursor: pointer;
                width: 30px;
            }

            .exercises.card {
                position: relative;
                background-color: var(--White);

                .card-header {
                    color: var(--Secondary-900);
                    display: flex;
                    justify-content: space-between;
                }

                .card-body .item {
                    display: grid;
                    grid-template-columns: 20% 60% 20%;
                    gap: 10px;
                    align-items: center;
                    border: 3px solid var(--Secondary-900);
                    border-radius: 10px;
                    padding: 10px;
                    margin-bottom: 30px;
                    cursor: pointer;

                    .point {
                        font-size: 50px;
                        color: var(--Secondary-900);
                        text-align: center;
                        border-right: 3px dashed var(--Info-200);
                        padding: 10px;
                    }

                    .identity {
                        font-size: 20px;
                        color: var(--Secondary-900);

                        .title {
                            font-weight: bold;
                        }

                        .category {
                            padding: 5px 15px;
                            border-radius: 10px;
                            margin-top: 10px;
                            font-size: small;
                            background-color: var(--Secondary-900);
                            width: fit-content;
                            color: white;
                        }
                    }

                    .question {
                        text-align: center;
                        font-size: 30px;
                        color: var(--Info-200);

                        .worked {
                            color: var(--Secondary-900);
                        }

                        .total {
                            color: var(--Primary-900);
                        }
                    }
                }
            }

            .materials.card {
                position: relative;
                background-color: var(--White);

                .card-header {
                    color: var(--Primary-900);
                    display: flex;
                    justify-content: space-between;

                    svg {
                        width: 30px;
                    }
                }

                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    border: 3px solid var(--Primary-900);
                    border-radius: 10px;
                    margin-bottom: 30px;
                    width: 100%;
                    cursor: pointer;

                    .title {
                        font-size: large;
                        font-weight: bold;
                        color: var(--Primary-900);
                    }

                    .category {
                        padding: 10px 15px;
                        background: var(--Primary-900);
                        color: var(--White);
                        border-radius: 10px;
                    }
                }
            }
        }
    }

    // Gaya untuk Pagination / Dots Manual
    .swiper-pagination-manual {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 15px; // Jarak dari swiper container

        .dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: var(--Neutral-300); // Warna pasif
            cursor: pointer;
            transition: background-color 0.3s;

            &.active {
                background-color: var(--Secondary-900); // Warna aktif
            }
        }
    }

}
</style>