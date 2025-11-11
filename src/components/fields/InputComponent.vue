<script setup>
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
    },
    required: {
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])

</script>

<template>
    <div class="input-wrapper" :class="{ 'invalid': isInvalid }">
        <label :for="props.id">
            {{ props.label }}
            <span v-if="props.required" class="req">*</span>
        </label>
        <input :type="props.type" :placeholder="props.placeholder" :id="props.id"
            :class="['input', { 'input-color': props.type == 'color' }]" :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)">
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

    input {
        width: 100%;
        display: block;
        background-color: var(--Neutral-100);
        padding: 20px 15px; // <-- Padding desktop
        border-radius: 5px;
        outline: 0;
        border: none;
        font-size: 1rem; // <-- Tambahan: set font-size

        &.input-color {
            height: 100px; // <-- Tinggi color picker desktop
        }
    }

    input::placeholder {
        color: var(--Neutral-300);
    }

    .invalid-msg {
        display: none;
    }

    &.invalid {
        label {
            color: var(--Danger-900, #CC1D1D);
        }

        input {
            border: 2px solid var(--Danger-900);
            background-color: unset;
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
        label {
            font-size: small; // <-- Kecilkan font label
            margin-bottom: 8px;
        }

        input {
            padding: 16px 12px; // <-- Kurangi padding di ponsel

            &.input-color {
                height: 80px; // <-- Kurangi tinggi color picker
            }
        }
    }
}
</style>