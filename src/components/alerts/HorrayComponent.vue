<script setup>
import { Vue3Lottie } from 'vue3-lottie';
import ButtonDangerComponent from '../buttons/ButtonDangerComponent.vue';
import horrayAnimation from '../../assets/images/horray_animation.json'
import ButtonComponent from '../buttons/ButtonComponent.vue';

const emit = defineEmits(['close']);
const props = defineProps(['title', 'message'])
</script>

<template>
    <Transition name="fade">
        <div class="alert">
            <div class="alert-body">
                <Vue3Lottie style="width: 60%;" :animationData="horrayAnimation" :loop="true" :autoPlay="true" />

                <ButtonComponent label="Tutup" @click="emit('close')" />
            </div>
        </div>
    </Transition>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease-out;
}

/* Kondisi awal saat elemen masuk (muncul) */
.fade-enter-from,
/* Kondisi akhir saat elemen keluar (hilang) */
.fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

.alert {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10000;

    &::before {
        content: '';
        width: 100%;
        height: 100%;
        background-color: #000000a2;
        position: absolute;
        top: 0;
        left: 0;
    }

    .alert-body {
        // background-color: var(--White);
        border-radius: 8px;
        z-index: 10;
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
    }
}
</style>