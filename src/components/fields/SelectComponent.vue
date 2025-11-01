<script setup>
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    options: {
        type: Array,
        default: () => [
            { label: 'Masukkan pilihan', value: 0 }
        ]
    },
    label: {
        type: String,
        default: 'Label'
    },
    id: {
        type: String,
        default: 'select'
    },
    isInvalid: {
        type: Boolean,
        default: false
    },
    invalidMsg: {
        type: String,
        default: 'This select is invalid'
    },
    required: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div class="select-wrapper" :class="{ invalid: isInvalid }">
        <label :for="props.id">
            {{ props.label }}
            <span class="req" v-if="props.required">*</span>
        </label>

        <select :id="props.id" class="select" :value="props.modelValue"
            @change="$emit('update:modelValue', $event.target.value)">
            <option v-for="(item, index) in props.options" :key="index" :value="item.value">
                {{ item.label }}
            </option>
        </select>

        <div class="invalid-msg">{{ props.invalidMsg }}</div>
    </div>
</template>

<style lang="scss" scoped>
.select-wrapper {
    margin-bottom: 30px;

    label {
        color: var(--Neutral-700);
        display: block;
        font-weight: 500;
        margin-bottom: 10px;
        font-size: medium;
    }

    select {
        width: 100%;
        display: block;
        background-color: var(--Neutral-100);
        padding: 20px 15px;
        border-radius: 5px;
        outline: 0;
        border: none;
    }

    .invalid-msg {
        display: none;
    }

    &.invalid {
        label {
            color: var(--Danger-900, #CC1D1D);
        }

        select {
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
</style>
