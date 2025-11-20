<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';

import { useRoute, useRouter } from 'vue-router';

const baseUrl = import.meta.env.VITE_APP_API_URL
const route = useRoute()
const router = useRouter()
const id = route.params.id
</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'childs.detail', params: { id: id } }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Pilih cara membuat soal</h1>
        </div>
        <div class="page-body">
            <div class="grid-container">
                <div class="item">
                    <img src="../../assets/images/book.svg" alt="Manual">
                    <ButtonComponent label="Buat dari awal" class="secondary" display="border" size="full"
                        @click="router.push({ name: 'exercise.quiz.create', params: id })" />
                </div>
                <div class="item">
                    <img src="../../assets/images/ai.svg" alt="Manual">
                    <ButtonComponent label="Gunakan template AI" class="secondary" size="full"
                        @click="router.push({ name: 'exercise.quiz.generate', params: id })" />
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.grid-container {
    padding: 5rem 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 50px;
    justify-items: center;
    align-items: center;

    img {
        width: 100%;
        margin-bottom: 30px;
    }

    @media (max-width: 768px) {
        padding: 0;
        grid-template-columns: 1fr;
    }
}
</style>