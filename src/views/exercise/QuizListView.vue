<script setup lang="ts">
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import DoneIcon from '@/components/shape/DoneIcon.vue';
import LockIcon from '@/components/shape/LockIcon.vue';
import LockOpenIcon from '@/components/shape/LockOpenIcon.vue';
import { formatDate } from '@/helpers/formatDate';
import { authStore } from '@/stores/AuthStore';
import { workStore } from '@/stores/WorkStore';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const isWorkMode = workStore.isWorkMode

const data = ref([])
const id = route.params.id

const totalQuizPoint = ref(0)


onMounted(async () => {
    let params
    if (isWorkMode) {
        params = {
            hidden: false
        }
    }

    await api.get(`/exercise/${route.params.id}`, {
        params: params
    })
        .then((res) => {
            console.log(res);
            data.value = res.data.data
            console.log(data.value);

            calculateTotalPoint()

        }).catch(err => {
            console.error(err)
        })
})

const calculateTotalPoint = () => {
    data.value.quiz.forEach(item => {
        totalQuizPoint.value += parseInt(item.quizPoint) || 0
    });
}

</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'childs.detail', params: { id: data?.childrenId } }">
                <ChevronLeftIcon />
            </router-link>
            <div>
                <p class="page-title"><strong>{{ data?.name }}</strong></p>
                <div class="page-description" v-html="data?.description"></div>
            </div>
        </div>
        <div class="page-body">
            <ButtonComponent label="Edit latihan" size="small" class="secondary" display="border"
                @click="router.push({ name: 'exercise.edit', params: { id: id } })" />
            <div class="action">
                <p class="score">Total Skor : <strong>{{ totalQuizPoint }}</strong></p>
                <ButtonComponent label="Buat Latihan" class="secondary"
                    @click="router.push({ name: 'exercise.quiz.create', params: { id: id } })"
                    v-if="!isWorkMode && authStore?.user?.role == 1" />
            </div>
            <div class="quiz-container">
                <div :class="['item', { disabled: index > 0 ? data?.quiz[index - 1]?.answers?.length == 0 || data?.quiz[index - 1]?.quizPoint < 60 : false }]"
                    v-for="(item, index) in data?.quiz" :key="index"
                    @click="(index > 0 ? data?.quiz[index - 1]?.answers?.length == 0 || data?.quiz[index - 1]?.quizPoint < 60 : false) ? null : $router.push({ name: 'exercise.quiz.overview', params: { id: id, quizId: item._id } })">
                    <div class="point">{{ item?.quizPoint ?? 0 }}</div>
                    <div class="identity">
                        <p class="title">{{ item.name }}</p>
                        <p class="date">{{ formatDate(item.date) }}</p>
                        <div class="category">Level {{ item.level }}</div>
                    </div>
                    <div class="status">
                        <DoneIcon v-if="item.answers.length > 0" />
                        <LockOpenIcon
                            v-else-if="index > 0 ? data?.quiz[index - 1]?.answers?.length > 0 && data?.quiz[index - 1]?.quizPoint > 60 : true" />
                        <LockIcon v-else />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 30px 0;
    flex-wrap: wrap; // <-- Tambahan: agar rapi jika menyempit
    gap: 15px; // <-- Tambahan: beri jarak jika wrap

    p {
        font-size: 35px;
        color: var(--Secondary-900);
    }
}

.quiz-container {
    .item {
        display: grid;
        // Gunakan unit fr dan atur lebar kolom
        grid-template-columns: 100px 1fr 100px; // <-- Diubah dari %
        gap: 40px;
        align-items: center;
        border: 3px solid var(--Secondary-900);
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 30px;
        cursor: pointer;
        background: var(--White);
        transition: background-color 0.2s; // <-- Tambahkan transisi

        &:hover {
            background-color: var(--Neutral-100); // <-- Efek hover
        }

        .point {
            font-size: 50px;
            color: var(--Secondary-900);
            text-align: center;
            border-right: 3px dashed var(--Info-200);
            padding: 10px;
        }

        .identity {
            font-size: 25px;
            color: var(--Secondary-900);

            .title {
                font-weight: bold;
            }

            .category {
                padding: 5px 15px;
                border-radius: 10px;
                margin-top: 10px;
                font-size: 15px;
                background-color: var(--Secondary-900);
                width: fit-content;
                color: white;
            }
        }

        .status {
            // <-- Tambahan style untuk perataan status
            justify-self: center; // Pusatkan ikon
        }

        .question {
            // Style ini tidak ada di HTML Anda
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

        &.disabled {
            cursor: not-allowed;
            opacity: 50%;
            background-color: var(--Neutral-100); // Abu-abu saat disabled

            &:hover {
                background-color: var(--Neutral-100); // Tidak ada efek hover
            }
        }
    }
}

/* --- RESPONSIVE --- */

/* Target Tablet */
@media (max-width: 768px) {
    .action {
        flex-direction: column; // <-- Pecah jadi vertikal
        align-items: flex-start; // <-- Ratakan kiri

        p {
            font-size: 28px; // Kecilkan font
        }

        button {
            width: 100%; // Penuhi layar
        }
    }

    .quiz-container .item {
        // Ubah layout grid untuk mobile
        grid-template-columns: 70px 1fr; // <-- 2 kolom (point, identity)
        grid-template-rows: auto 1fr; // <-- 2 baris
        gap: 15px;
        padding: 15px;

        .point {
            grid-row: 1 / 3; // <-- Ambil 2 baris
            font-size: 40px;
            padding: 0;
            border-right: 2px dashed var(--Info-200);
        }

        .identity {
            grid-column: 2 / 3; // <-- Kolom 2
            grid-row: 1 / 2; // <-- Baris 1
            font-size: 18px;
        }

        .status {
            grid-column: 2 / 3; // <-- Kolom 2
            grid-row: 2 / 3; // <-- Baris 2
            justify-self: flex-start; // Ratakan kiri
            padding-top: 10px;
        }
    }
}
</style>