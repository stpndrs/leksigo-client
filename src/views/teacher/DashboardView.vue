<script setup>
import { authStore } from '@/stores/AuthStore';
import { onMounted, ref } from 'vue';

const fullName = ref()
onMounted(() => {
    fullName.value = authStore.user.fullName
})
</script>

<template>
    <div class="container">
        <div class="page-header">
            <h1 class="page-title">Selamat Datang, {{ fullName }}</h1>
        </div>
    </div>
</template>