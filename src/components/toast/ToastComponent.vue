<script setup>
const props = defineProps(['title', 'message', 'type'])
</script>

<template>
    <div class="toast-container">

        <div class="toast toast--success" v-if="props.type == 'success'">
            <div class="toast__icon">
                &#10003;
            </div>
            <div class="toast__content">
                <p class="toast__title">Sukses</p>
                <p class="toast__message">{{ props.message }}</p>
            </div>
            <button class="toast__close">&times;</button>
        </div>

        <div class="toast toast--error" v-if="props.type == 'error'">
            <div class="toast__icon">
                &#10005;
            </div>
            <div class="toast__content">
                <p class="toast__title">Gagal</p>
                <p class="toast__message">{{ props.message }}</p>
            </div>
            <button class="toast__close">&times;</button>
        </div>

        <div class="toast toast--info" v-if="props.type == 'info'">
            <div class="toast__icon">
                &#8505;
            </div>
            <div class="toast__content">
                <p class="toast__title">Informasi</p>
                <p class="toast__message">{{ props.message }}</p>
            </div>
            <button class="toast__close">&times;</button>
        </div>

    </div>
</template>

<style lang="scss" scoped>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 9999;
}

.toast {
    display: flex;
    align-items: flex-start;
    background-color: var(--color-white);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    padding: 16px;
    min-width: 300px;
    max-width: 350px;
    border-left: 5px solid;
    position: relative;
    animation: slideInRight 0.3s ease-out;

    &__icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: var(--color-white);
        flex-shrink: 0;
        margin-right: 12px;
    }

    &__content {
        flex-grow: 1;
    }

    &__title {
        margin: 0 0 5px 0;
        font-weight: bold;
        color: var(--color-text);
        font-size: 1rem;
    }

    &__message {
        margin: 0;
        font-size: 0.9rem;
        color: var(--color-text-light);
    }

    &__close {
        position: absolute;
        top: 10px;
        right: 12px;
        background: transparent;
        border: none;
        font-size: 1.25rem;
        color: var(--color-text-light);
        cursor: pointer;
        padding: 0;
        line-height: 1;

        &:hover {
            color: var(--color-text);
        }
    }

    &--success {
        border-color: var(--toast-success);

        .toast__icon {
            background-color: var(--toast-success);
        }
    }

    &--error {
        border-color: var(--toast-error);

        .toast__icon {
            background-color: var(--toast-error);
        }
    }

    &--info {
        border-color: var(--toast-info);

        .toast__icon {
            background-color: var(--toast-info);
        }
    }

    &.fade-out {
        animation: fadeOut 0.3s ease-in forwards;
    }
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
        transform: translateX(100%);
    }
}
</style>