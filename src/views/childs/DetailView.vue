<script setup>
import { authStore } from '@/stores/AuthStore';
import TeacherDetailView from '../teacher/childs/DetailView.vue';
import ParentDetailView from '../parent/childs/DetailView.vue';

</script>

<template>
    <TeacherDetailView v-if="authStore.user.role == 1" />
    <ParentDetailView v-if="authStore.user.role == 2" />
</template>