<script setup>
import ButtonComponent from '../buttons/ButtonComponent.vue';
import ConfirmIcon from '../shape/ConfirmIcon.vue';

// 1. Definisikan props (tanpa 'function')
// Kita juga tambahkan props untuk teks tombol agar lebih fleksibel
const props = defineProps({
    title: String,
    message: String,
    confirmText: {
        type: String,
        default: "Simpan"
    },
    cancelText: {
        type: String,
        default: "Batal"
    },
    isBtnLoading: {
        type: Boolean,
        default: false
    }
})

// 2. Definisikan event yang akan di-emit
const emit = defineEmits(['confirm', 'cancel'])

// 3. Buat fungsi handler lokal untuk memanggil emit
// Ini opsional, tapi membuat template lebih rapi
const onConfirm = () => {
    emit('confirm');
}

const onCancel = () => {
    emit('cancel');
}
</script>

<template>
    <Transition name="fade">
        <div class="confirm-container" @click.self="onCancel">
            <div class="confirm">
                <div class="confirm-body">
                    <ConfirmIcon class="icon" />
                    <p class="title">{{ props.title }}</p>
                    <p class="description">{{ props.message }}</p>
                </div>
                <div class="confirm-footer">
                    <ButtonComponent :isDisabled="isBtnLoading" :label="isBtnLoading ? 'Loading...' : props.cancelText"
                        class="secondary" display="border" @click="onCancel" />
                    <ButtonComponent :isDisabled="isBtnLoading" :label="isBtnLoading ? 'Loading...' : props.confirmText"
                        class="secondary" @click="onConfirm" />
                </div>
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

.confirm-container {
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

    .confirm {
        background-color: var(--White);
        border-radius: 8px;
        z-index: 10;
        padding: 5rem;
        max-width: 450px;
        text-align: center;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        // flex-direction: column;
        gap: 10px;

        .confirm-body {
            .icon {}

            .title {
                color: var(--Neutral-700, #CC1D1D);
                font-size: 30px;
                font-weight: 700;
            }

            .description {
                font-size: 20px;
                margin-bottom: 30px;
            }
        }

        .confirm-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }
    }

}
</style>