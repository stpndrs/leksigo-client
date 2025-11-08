<script setup>
import { authStore } from '@/stores/AuthStore';
import ParentCreateView from '../parent/childs/CreateView.vue';
import TeacherCreateView from '../teacher/childs/CreateView.vue';

</script>

<template>
    <TeacherCreateView v-if="authStore.user.role == 1" />
    <ParentCreateView v-if="authStore.user.role == 2" />
</template>