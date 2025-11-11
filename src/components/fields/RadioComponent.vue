<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    type: {
        default: 'text'
    },
    label: {
        default: 'Label'
    },
    labels: {
        type: Array,
        default: ['Label']
    },
    values: {
        type: Array,
    },
    name: {
        default: 'name'
    },
    placeholder: {
        default: 'Placeholder'
    },
    id: {
        default: 'input'
    },
    isInvalid: {
        default: false
    },
    invalidMsg: {
        default: 'This input is invalid'
    }
})

const emit = defineEmits(['update:modelValue'])
// 2. Buat computed property untuk v-model
const computedValue = computed({
    get() {
        return props.modelValue
    },
    set(newValue) {
        emit('update:modelValue', newValue)
    }
})
</script>

<template>
    <div class="input-wrapper" :class="{ 'invalid': isInvalid }">
        <label :for="props.id">{{ props.label }}</label>
        <div class="radio-wrapper" v-for="(item, index) in props.labels" :key="index">
            <input type="radio" :name="props.name" :id="props.id + `-${index}`" :value="props.values[index]"
                v-model="computedValue">
            <label :for="props.id + `-${index}`">{{ item }}</label>
        </div>
        <div class="invalid-msg">{{ props.invalidMsg }}</div>
    </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
    label {
        color: var(--Neutral-700);
        display: block;
        font-weight: 500;
        margin-bottom: 10px;
        font-size: medium;
    }

    .radio-wrapper {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;

        /* Tambahkan sedikit margin bawah antar radio button */
        input {
            appearance: none;
            /* Penting untuk menghilangkan tampilan default browser */
            width: 18px;
            height: 18px;
            border: 2px solid var(--System-dark, #333);
            /* Lingkaran luar */
            border-radius: 50%;
            background-color: #fff;
            cursor: pointer;
            position: relative;
            /* Untuk memposisikan pseudo-elemen di dalamnya */
            flex-shrink: 0; // <-- Tambahan: Mencegah tombol radio gepeng
        }


        input:checked::before {
            content: '';
            display: block;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            background-color: var(--System-dark, #333);
            /* Lingkaran dalam yang solid */
            border-radius: 50%;
        }

        label {
            cursor: pointer;
            color: #333;
            margin: unset;
            font-size: 1rem; // <-- Set base font size
        }
    }

    .invalid-msg {
        display: none;
    }

    &.invalid {

        // Label utama
        >label {
            color: var(--Danger-900, #CC1D1D);
        }

        // Label radio item
        .radio-wrapper label {
            color: var(--Danger-900, #CC1D1D);
        }

        input {
            border: 2px solid var(--Danger-900);
            background-color: unset;
        }

        // <-- Tambahan: Buat titiknya merah saat invalid
        input:checked::before {
            background-color: var(--Danger-900);
        }

        .invalid-msg {
            display: block;
            color: var(--Danger-900);
            font-size: small;
            margin-top: 10px;
        }
    }
}

/* --- RESPONSIVE --- */

/* Target Ponsel Kecil */
@media (max-width: 576px) {
    .input-wrapper {

        // Label utama
        >label {
            font-size: small; // <-- Kecilkan font
        }

        // Label radio item
        .radio-wrapper label {
            font-size: 0.9rem; // <-- Kecilkan font
        }
    }
}
</style>