<script setup>
import { useRoute } from 'vue-router';
import sidebar from './Sidebar.vue'
import { onBeforeMount, onMounted, provide, ref } from 'vue';

const route = useRoute()

const isShowLoader = ref(true)

const routeWithoutSidebar = [
    'childs.detail',
    'childs.work',
    'exercise.create',
    'exercise.edit',
    'exercise.quiz.create',
    'exercise.quiz.detail',
    'exercise.quiz.overview',
    'exercise.quiz.list',
    'exercise.quiz.work',
    'exercise.quiz.summary',
    'exercise.quiz.review',
    'exercise.attitude',
    'material.create',
    'material.edit',
    'material.overview'
]

// loader
const setLoader = (status) => {
    isShowLoader.value = status
}
provide('toggleLoader', setLoader)
onMounted(() => {
    setTimeout(() => {
        isShowLoader.value = false
    }, 800)
})
</script>

<template>
    <div id="layout" :class="[{ nosidebar: routeWithoutSidebar.includes(route.name) }]">
        <sidebar v-if="!routeWithoutSidebar.includes(route.name)" />
        <div id="loader" v-if="isShowLoader">
            <div class="dots-container">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        </div>
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

    #loader {
        padding: 2rem;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 100000;
        background-color: white;

        .dots-container {
            display: flex;
            gap: 12px;
        }

        .dot {
            width: 20px;
            height: 20px;
            background-color: var(--Secondary-900);
            border-radius: 50%;
            animation: blink-animation 1.4s infinite ease-in-out;
        }

        .dot:nth-child(2) {
            animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
            animation-delay: 0.4s;
        }

        @keyframes blink-animation {

            0%,
            80%,
            100% {
                transform: scale(0.6);
                opacity: 0.5;
            }

            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
    }

    @media screen and (max-width: 991.98px) {
        grid-template-columns: 100%;

        #content {
            padding-top: 50px;
        }
    }
}
</style>