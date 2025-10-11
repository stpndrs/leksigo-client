<script setup>
import { authStore } from '@/stores/AuthStore';
import DashboardParent from './parent/DashboardView.vue'
import DashboardTeacher from './teacher/DashboardView.vue'
import { onMounted, ref } from 'vue';
const role = ref()
onMounted(() => {
    role.value = authStore.user.role
})
</script>

<template>
    <div>
        <DashboardTeacher v-if="role === 1" />
        <DashboardParent v-if="role === 2" />
    </div>
</template>