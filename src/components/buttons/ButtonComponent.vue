<script setup>

const props = defineProps({
    label: {
        default: 'Button'
    },
    icon: {
        type: Object,
        default: null
    },
    type: {
        default: 'button'
    },
    display: {
        default: 'fill'
    },
    size: {
        default: 'normal'
    },
    class: {
        default: 'primary'
    },
    isDisabled: {
        default: false
    }
})

</script>

<template>
    <button :type="props.type"
        :class="[props.display + ' ' + props.size + ' ' + props.class, { disabled: isDisabled, 'has-icon': props.icon }]"
        class="button" :disabled="isDisabled">
        {{ props.label }}
        <component v-if="props.icon" :is="props.icon" class="button-icon" />
    </button>
</template>


<style lang="scss" scoped>
button {
    display: block;
    padding: 15px 30px;
    text-align: center;
    font-weight: bold;
    outline: 0;
    text-transform: capitalize;
    cursor: pointer;
    width: 100%;

    font-size: large;

    &.has-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;

        .button-icon {
            width: 15px;
        }
    }

    &.fill {
        border-radius: 10px;
        border: 0;
        color: var(--White, #FFF);

        &.primary {
            background-color: var(--Primary-900, #FF3C8A);
        }

        &.secondary {
            background-color: var(--Secondary-900, #FF3C8A);
        }

        &.danger {
            background-color: var(--Danger-900, #CC1D1D);
        }
    }

    &.border {
        background-color: var(--White);
        border-radius: 10px;

        &.primary {
            border: 1.195px solid var(--Primary-900, #FF3C8A);
            color: var(--Primary-900, #FF3C8A);
        }

        &.secondary {
            border: 1.195px solid var(--Secondary-900, #FF3C8A);
            color: var(--Secondary-900, #FF3C8A);
        }

        &.danger {
            border: 1.195px solid var(--Danger-900, #CC1D1D);
            color: var(--Danger-900, #CC1D1D);
        }

    }

    &.full {
        width: 100%;
    }

    &.normal {
        width: 50%;
    }

    &.small {
        width: fit-content;
        padding: 10px 25px;
        font-size: small;
        font-weight: 600;
        border-radius: 5px;
    }

    &.disabled {
        opacity: 50%;
        cursor: no-drop;
    }
}
</style>