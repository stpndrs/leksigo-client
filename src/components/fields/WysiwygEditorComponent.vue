<script setup>
// 'ref' tidak diperlukan di sini karena kita meneruskan prop
// import { ref } from 'vue' 

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// Mendefinisikan emit untuk v-model
const emit = defineEmits(['update:modelValue'])

// Mendefinisikan props untuk v-model
const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

</script>

<template>
    <div style="height: 300px;">
        <QuillEditor :content="modelValue" @update:content="$emit('update:modelValue', $event)" theme="snow"
            toolbar="essential" contentType="html" placeholder="Ketik sesuatu di sini..." />
    </div>
</template>

<style>
.ql-editor {
    min-height: 200px;
}
</style>