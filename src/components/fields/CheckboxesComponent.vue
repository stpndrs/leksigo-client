<script setup>
import { ref, watch } from 'vue';


const props = defineProps({
    data: {
        type: Array,
    },
    function: {
        type: Function
    },
    selectedValue: {
        type: Number,
        default: ''
    },
    isInvalid: {
        type: Boolean,
        default: false
    },
    invalidMsg: {
        type: String,
        default: 'This input is invalid'
    }
})


const selectedValue = ref(props?.selectedValue);
// watch to reset the selected value data
watch(() => [props.data, props.selectedValue], () => {
    selectedValue.value = props.selectedValue;
})
// handle on method clicked
const handleClick = (value) => {
    selectedValue.value = value;

    if (props.function) {
        props.function(value);
    }
}
</script>

<template>

    <div class="input-wrapper">
        <ul class="checkbox-container" :class="{ 'invalid': isInvalid }">
            <li :class="['checkbox-item', { active: item.value == selectedValue }]" v-for="(item, index) in props.data"
                :key="index" @click="handleClick(item.value)">{{
                    item.label }}</li>
        </ul>
        <div class="invalid-msg" v-if="props.invalidMsg">{{ props.invalidMsg }}</div>
    </div>

</template>

<style lang="scss" scoped>
.input-wrapper {
    width: 100%;

    .checkbox-container {
        display: flex;
        flex-wrap: wrap; // <-- PERUBAHAN UTAMA: Izinkan item turun baris
        // width: fit-content; // <-- Dihapus
        // justify-content: space-between; // <-- Dihapus
        gap: 10px;
        margin: 0;
        padding: 0;

        .checkbox-item {
            list-style: none;
            padding: 5px 15px;
            border-radius: 10px;
            cursor: pointer;
            border: 2px solid;
            border-color: var(--Primary-900);
            color: var(--Primary-900);
            transition: background-color 0.2s, color 0.2s; // <-- Tambahan: transisi
            user-select: none; // <-- Tambahan: cegah teks ter-highlight

            &.active {
                border-color: var(--Primary-900) !important;
                background-color: var(--Primary-900) !important;
                color: var(--White) !important;
            }
        }

        &.invalid {
            .checkbox-item {
                // Hanya ubah yang perlu (border dan color)
                border-color: var(--Danger-900);
                color: var(--Danger-900);

                &.active {
                    // Pastikan state active tetap menimpa saat invalid
                    border-color: var(--Danger-900) !important;
                    background-color: var(--Danger-900) !important;
                    color: var(--White) !important;
                }
            }
        }
    }

    .invalid-msg {
        display: block; // v-if/v-show yang akan mengontrol ini
        color: var(--Danger-900);
        font-size: small;
        margin-top: 10px;
    }
}

/* --- RESPONSIVE --- */

/* Target Ponsel Kecil */
@media (max-width: 576px) {
    .input-wrapper .checkbox-container .checkbox-item {
        padding: 4px 10px; // <-- Padding lebih kecil
        font-size: 0.9rem; // <-- Font lebih kecil
    }
}
</style>