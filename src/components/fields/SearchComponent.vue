<script setup>
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    placeholder: {
        default: 'Placeholder'
    },
})

const emit = defineEmits(['update:modelValue'])

</script>

<template>
    <input type="text" name="search" id="search" :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)" class="search" :placeholder="placeholder">
</template>

<style lang="scss" scoped>
.search {
    width: 100%;
    padding: 20px 25px;
    border-radius: 10px;
    outline: 0;
    border: unset;
    background-color: var(--White);
    box-shadow: 0 2px 19px rgba(0, 0, 0, 0.08);
}
</style>