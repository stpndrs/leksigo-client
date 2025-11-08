<script setup>
import { useRoute } from 'vue-router';
import sidebar from './Sidebar.vue'

const route = useRoute()

const routeWithoutSidebar = ['childs.detail', 'childs.work', 'exercise.create', 'exercise.quiz.create', 'exercise.quiz.overview', 'exercise.quiz.list', 'exercise.quiz.work', 'exercise.quiz.summary', 'exercise.attitude', 'material.create', 'material.edit', 'material.overview']
</script>

<template>
    <div id="layout" :class="[{ nosidebar: routeWithoutSidebar.includes(route.name) }]">
        <sidebar v-if="!routeWithoutSidebar.includes(route.name)" />
        <div id="content">
            <router-view />
        </div>
    </div>
</template>

<style lang="scss" scoped>
#layout {
    display: grid;
    grid-template-columns: 20% 80%;

    &.nosidebar {
        grid-template-columns: 100%;
    }

    min-height: 100vh;
    background: var(--Soft-white);

    #content {
        padding: 30px;
    }

    @media screen and (max-width: 991.98px) {
        grid-template-columns: 100%;

        #content {
            padding-top: 50px;
        }
    }
}
</style>