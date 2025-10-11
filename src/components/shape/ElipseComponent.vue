<script setup>
import { computed } from 'vue';

// 1. Use withDefaults to provide default values for props.
// This is much cleaner than using '??' in the template.
const props = defineProps({
    size: {
        type: Number,
        default: 328
    },
    color: {
        type: String,
        default: '#FFFFFF'
    }
});

// 2. Use a computed property for values that depend on props.
// This ensures they are reactive and update automatically.
const circleSize = computed(() => props.size / 2);
const viewBox = computed(() => `0 0 ${props.size} ${props.size}`);
</script>

<template>
    <svg :width="props.size" :height="props.size" :viewBox="viewBox" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle :cx="circleSize" :cy="circleSize" :r="circleSize" :fill="props.color" />
    </svg>
</template>