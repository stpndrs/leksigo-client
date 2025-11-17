<script setup>
import child from '@/assets/images/child.png'
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ConfirmComponent from '@/components/confirm/ConfirmComponent.vue';
import FilterModal from '@/components/modal/FilterModal.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import FilterIcon from '@/components/shape/FilterIcon.vue';
import { formatDate } from '@/helpers/formatDate';
import { workStore } from '@/stores/WorkStore';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const id = route.params.id
const data = ref()
const points = ref(0)
const dataContainer = ref(null)
const activeSlide = ref(0)
const isWorkMode = workStore.isWorkMode

onMounted(async () => {
    await api(`/childs/${id}`)
        .then((res) => {
            data.value = res.data.data

            data.value.exercises.forEach(d => {
                d.exercisePoint = 0

                d.quiz.forEach(q => {
                    d.exercisePoint += parseInt(q.quizPoint) || 0
                })

                points.value += parseInt(d.exercisePoint)

            })

        }).catch((err) => {
            console.log(err);
        })
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
                    <span class="level" v-if="data?.child?.level">
                        <p>Level Anak </p>
                        <div class="level-container">
                            <div :class="['item', { active: data?.child?.level == 1 }]">1</div>
                            <div :class="['item', { active: data?.child?.level == 2 }]">2</div>
                            <div :class="['item', { active: data?.child?.level == 3 }]">3</div>
                        </div>
                    </span>
                </div>
            </div>
            <div class="data-wrapper">
                <div class="data-swiper" ref="dataContainer" @scroll="handleScroll">

                    <div class="swiper-slide-manual">
                        <div class="card exercises">
                            <div class="card-header">
                                <h3>Latihan</h3>
                            </div>
                            <div class="card-body">
                                <div class="item" v-for="(item, index) in data?.exercises" :key="index"
                                    @click="$router.push({ name: 'exercise.quiz.list', params: { id: item._id } })">
                                    <div class="point">{{ item?.exercisePoint ?? 0 }}</div>
                                    <div class="identity">
                                        <p class="title">{{ item.name }}</p>
                                        <p class="date">{{ formatDate(item.createdAt) }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer" v-if="!isWorkMode">
                                <ButtonComponent label="Buat Latihan" class="secondary" size="large"
                                    @click="$router.push({ name: 'exercise.create', params: id })" />
                            </div>
                        </div>
                    </div>

                    <div class="swiper-slide-manual">
                        <div class="card materials">
                            <div class="card-header">
                                <h3>Materi</h3>
                            </div>
                            <div class="card-body">
                                <div class="item" v-for="(item, index) in data?.materials" :key="index"
                                    @click="router.push({ name: 'material.overview', params: { id: id, materialId: item._id } })">
                                    <p class="title">{{ item.title }}</p>
                                    <div class="category">{{ item.method }}</div>
                                </div>
                            </div>
                            <div class="card-footer" v-if="!isWorkMode">
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
    grid-template-columns: 1fr 2fr; // <-- Kolom default (Desktop)
    justify-content: space-between;
    color: var(--Neutral-700);
    gap: 30px;
    overflow-x: hidden;

    .detail {
        display: flex;
        justify-content: center;
        align-items: center; // <-- Pusatkan gambar & biodata (Desktop)
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
                cursor: pointer; // Tambahkan cursor pointer

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
        overflow: hidden; // Sembunyikan overflow di wrapper
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
            width: 80%; // <-- Setiap slide mengambil 80% lebar (Desktop)
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
                    grid-template-columns: 20% 80%; // <-- Perbaikan: 2 kolom (point, identity)
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
                        padding-left: 20px; // Beri padding agar tidak menempel

                        .title {
                            font-weight: bold;
                        }

                        .category {
                            // Style ini tidak ada di HTML Anda, tapi ada di CSS
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
                        // Style ini tidak ada di HTML Anda, tapi ada di CSS
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
                        text-align: center;
                        flex-shrink: 0; // <-- Tambahan: cegah teks mengecil
                        margin-left: 10px; // <-- Tambahan: beri jarak
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

    /* --- RESPONSIVE --- */

    /* Target Tablet (Medium) */
    @media (max-width: 1024px) {
        grid-template-columns: 1fr; // <-- Pecah layout utama jadi 1 kolom
        gap: 40px;

        .detail {
            align-items: flex-start; // <-- Jangan pusatkan di mode 1 kolom
            flex-direction: row; // <-- Kembalikan ke horizontal
            gap: 30px;
            align-items: center;
        }

        .data-swiper .swiper-slide-manual {
            width: 100%; // <-- Slide memenuhi layar
        }
    }

    /* Target Ponsel (Kecil) */
    @media (max-width: 768px) {
        .detail {
            flex-direction: column; // <-- Pecah biodata jadi vertikal
            align-items: center; // <-- Pusatkan gambar
        }

        img {
            width: 15rem; // Kecilkan gambar
        }

        .biodata {
            span {
                font-size: 16px; // Kecilkan font biodata
            }

            .score {
                font-size: 28px; // Kecilkan font skor
            }

            .level-container .item {
                padding: 15px 10px; // Kecilkan box level
                font-size: 24px;
            }
        }

        .data-swiper .swiper-slide-manual {
            .card {
                padding: 20px;
                min-height: 80vh; // Kurangi tinggi

                .card-header {
                    font-size: 24px;
                }
            }

            // Perbaiki layout item Latihan di mobile
            .exercises.card .card-body .item {
                grid-template-columns: 1fr; // <-- Tumpuk vertikal
                gap: 15px;
                padding: 15px;

                .point {
                    font-size: 40px;
                    border-right: none; // Hapus garis
                    padding: 0;
                    text-align: left; // Ratakan kiri
                }

                .identity {
                    font-size: 16px;
                    padding-left: 0; // Hapus padding
                }
            }

            // Perbaiki layout item Materi di mobile
            .materials.card .item {
                flex-direction: column; // Tumpuk vertikal
                gap: 10px;
                align-items: flex-start; // Rata kiri

                .category {
                    font-size: 12px;
                }
            }
        }
    }
}
</style>