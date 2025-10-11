<script setup>
import ButtonDangerComponent from '../buttons/ButtonDangerComponent.vue';
const emit = defineEmits(['close']);
const props = defineProps(['title', 'message'])
</script>

<template>
    <Transition name="fade">
        <div class="alert">
            <div class="alert-body">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 63 63" fill="none">
                    <g clip-path="url(#clip0_156_505)">
                        <path
                            d="M31.5 5.25C16.9837 5.25 5.25 16.9837 5.25 31.5C5.25 46.0163 16.9837 57.75 31.5 57.75C46.0163 57.75 57.75 46.0163 57.75 31.5C57.75 16.9837 46.0163 5.25 31.5 5.25ZM31.5 52.5C19.9237 52.5 10.5 43.0762 10.5 31.5C10.5 19.9237 19.9237 10.5 31.5 10.5C43.0762 10.5 52.5 19.9237 52.5 31.5C52.5 43.0762 43.0762 52.5 31.5 52.5ZM40.9238 18.375L31.5 27.7987L22.0763 18.375L18.375 22.0763L27.7987 31.5L18.375 40.9238L22.0763 44.625L31.5 35.2013L40.9238 44.625L44.625 40.9238L35.2013 31.5L44.625 22.0763L40.9238 18.375Z"
                            fill="#CC1D1D" />
                    </g>
                    <defs>
                        <clipPath id="clip0_156_505">
                            <rect width="63" height="63" fill="white" />
                        </clipPath>
                    </defs>
                </svg>

                <p class="title">{{ props.title }}</p>
                <p class="description">{{ props.message }}</p>
                <button-danger-component label="Tutup" type="submit" display="border" @click="emit('close')" />
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
        background-color: #0000004c;
        position: absolute;
        top: 0;
        left: 0;
    }

    .alert-body {
        background-color: var(--White);
        border-radius: 8px;
        z-index: 10;
        padding: 5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;

        .title {
            color: var(--Danger-900, #CC1D1D);
            font-size: 30px;
            font-weight: 700;
        }

        .description {
            margin-bottom: 30px;
        }
    }
}
</style>