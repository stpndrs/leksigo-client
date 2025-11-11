<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import EyeIcon from '@/components/shape/EyeIcon.vue';
import EyeSlashIcon from '@/components/shape/EyeSlashIcon.vue';
import { formatMethodLabel } from '@/helpers/formatMethodLabel';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const baseUrl = import.meta.env.VITE_APP_API_URL
const route = useRoute()
const router = useRouter()
const id = route.params.id
const materialId = route.params.materialId
const material = ref([])

onMounted(async () => {
    await getData()
})

const getData = async () => {
    await api.get(`materials/${route.params.materialId}`)
        .then(res => {
            console.log(res);
            material.value = res.data.data
        }).catch(e => {
            console.log(e);
        })
}

const visibility = async () => {
    await api.post(`materials/${materialId}`)
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
            <router-link :to="{ name: 'childs.detail', params: id }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Detail Materi</h1>
        </div>
        <div class="page-body">
            <div class="material">
                <div class="material-header">
                    <h3 class="material-title">{{ material.title }}</h3>
                    <div class="btn-group">
                        <ButtonComponent label="Edit Materi" size="small" display="border"
                            @click="router.push({ name: 'material.edit', params: { id, materialId } })" />
                        <ButtonComponent :label="!material.isHidden ? 'Sembunyikan' : 'Tampilkan'"
                            :icon="!material.isHidden ? EyeSlashIcon : EyeIcon" class="secondary" size="small"
                            display="border" @click="visibility" />
                    </div>
                    <div class="flex">
                        <div class="method-wrapper">
                            <p>Metode Belajar : </p>
                            <div class="method-selected">{{ formatMethodLabel(material.method) }}</div>
                        </div>
                        <div class="level-wrapper">
                            <p>Level Materi : </p>
                            <div class="level-container">
                                <div :class="['item', material.level == 1 ? 'active' : '']" v-if="material.level == 1">1
                                </div>
                                <div :class="['item', material.level == 2 ? 'active' : '']" v-if="material.level == 2">2
                                </div>
                                <div :class="['item', material.level == 3 ? 'active' : '']" v-if="material.level == 3">3
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="material-body">
                    <p class="link">Materi Video : <a :href="material.link" target="_break">{{ material.link }}</a></p>
                    <div class="description" v-html="material.description"></div>
                    <div class="images">
                        <img :src="`${baseUrl}/api/v1/${item}`" alt="Gambar Materi "
                            v-for="(item, index) in material.images" :key="index">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.material {
    .material-header {
        .material-title {
            color: var(--Primary-900);
            font-size: 50px;
            margin-bottom: 15px;
        }

        .btn-group {
            display: flex;
            justify-content: start;
            flex-wrap: wrap; // <-- Tambahkan wrap
            gap: 10px; // <-- Tambahkan gap
            align-items: center;
            width: 100%;
            margin-bottom: 30px;
        }
    }

    .material-body {
        .images {
            img {
                width: 100%;
                max-width: 600px; // <-- Batasi lebar maks gambar
                display: block; // <-- Tambahan
                border-radius: 10px; // <-- Tambahan
                margin-bottom: 10px; // <-- Tambahan
            }
        }

        .link,
        .description {
            margin-bottom: 10px;
            font-size: 25px;
            color: var(--Neutral-700);
            word-break: break-word; // <-- Agar link tidak overflow

            a {
                color: var(--Primary-900);
            }
        }

        .description {

            // Atur agar style HTML dari v-html terlihat
            :deep(p) {
                margin-bottom: 1rem;
            }

            :deep(ul) {
                padding-left: 20px;
            }
        }
    }
}

.flex {
    display: grid;
    grid-template-columns: 1fr auto; // <-- Diubah dari 70% auto
    gap: 30px; // <-- Tambahkan gap
    margin-bottom: 30px; // <-- Beri jarak ke body

    .method-wrapper {
        p {
            margin-bottom: 5px;
            color: var(--Primary-900);
        }

        .method-selected {
            width: fit-content;
            padding: 10px 20px;
            background-color: var(--Primary-900);
            border-radius: 15px;
            color: white;
        }
    }

    .level-wrapper {
        justify-self: end;

        p {
            margin-bottom: 5px;
            color: var(--Secondary-900);
        }
    }

    .level-wrapper {

        // Definisi duplikat, tapi kita ikuti struktur Anda
        .level-container {
            display: grid;
            // Kolom dibuat auto agar pas dengan 1 item
            grid-template-columns: auto;
            gap: 20px;

            .item {
                padding: 10px 25px;
                border-radius: 10px;
                font-size: 20px;
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

}


/* --- RESPONSIVE --- */

/* Target Tablet (dan di bawahnya) */
@media (max-width: 768px) {
    .material .material-header {
        .material-title {
            font-size: 32px; // Kecilkan font
        }

        .btn-group {
            // Buat tombol memenuhi layar
            flex-direction: column;

            button {
                width: 100%;
            }
        }
    }

    .flex {
        grid-template-columns: 1fr; // <-- Pecah jadi 1 kolom
        gap: 25px;

        .level-wrapper {
            justify-self: start; // <-- Ratakan kiri
            order: -1; // <-- Pindahkan Level ke atas
        }
    }

    .material .material-body {

        .link,
        .description {
            font-size: 18px; // Kecilkan font
        }

        .images img {
            max-width: 100%; // Penuhi layar
        }
    }
}

/* Target Ponsel Kecil */
@media (max-width: 576px) {
    .material .material-header .material-title {
        font-size: 28px;
    }

    .flex .level-wrapper .level-container .item {
        padding: 8px 20px; // Kecilkan padding box
        font-size: 16px; // Kecilkan font
    }

    .flex .method-wrapper .method-selected {
        padding: 8px 15px;
        font-size: 14px;
    }
}
</style>