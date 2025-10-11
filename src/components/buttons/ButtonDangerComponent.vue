<script setup>

const props = defineProps({
    label: {
        default: 'Button'
    },
    type: {
        default: 'button'
    },
    display: {
        default: 'fill'
    },
    size: {
        default: 'normal'
    }
})

</script>

<template>
    <button :type="props.type" :class="props.display" class="button">{{ props.label }}</button>
</template>


<style lang="scss" scoped>
button {
    display: block;
    padding: 15px 10px;
    text-align: center;
    font-weight: bold;
    outline: 0;
    text-transform: capitalize;
    cursor: pointer;
    width: 100%;

    font-size: large;

    &.fill {
        background-color: var(--Danger-900);
        border-radius: 10px;
        border: 0;
        color: var(--White, #FFF);
    }

    &.border {
        background-color: var(--White);
        border-radius: 10px;
        border: 1.195px solid var(--Danger-900, #CC1D1D);
        color: var(--Danger-900, #CC1D1D);
    }
}
</style>