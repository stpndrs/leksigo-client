<script setup>
import { ref, watch } from 'vue'
import SelectComponent from '../fields/SelectComponent.vue'

const props = defineProps({
    handleModal: Function,
    type: String,
    handleDateFilter: Function,
    handleStatusFilter: Function
})

const date = ref('')
const status = ref('')

// kirim ke parent kalau ada perubahan
watch(date, (val) => {
    props.handleDateFilter && props.handleDateFilter(val)
})

watch(status, (val) => {
    props.handleStatusFilter && props.handleStatusFilter(val)
})
</script>

<template>
    <div class="modal-container">
        <div class="modal">
            <div class="modal-header">
                <button class="modal-close" @click="props.handleModal(props.type)">X</button>
            </div>

            <div class="modal-body">
                <SelectComponent :options="[
                    { label: 'Default', value: '' },
                    { label: 'Awal ke Akhir', value: 'asc' },
                    { label: 'Akhir ke Awal', value: 'desc' }
                ]" id="date" label="Urutkan berdasarkan" v-model="date" />

                <SelectComponent v-if="props.type === 'exercise'" :options="[
                    { label: 'Pilih semuanya', value: '' },
                    { label: 'Sudah pernah dikerjakan', value: 1 },
                    { label: 'Belum pernah dikerjakan', value: 0 }
                ]" id="status" label="Tampilkan" v-model="status" />
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.modal-container {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    width: 100%;
    height: 100%;

    // &::before {
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     content: '';
    //     width: 100%;
    //     height: 100%;
    //     background-color: black;
    //     opacity: 20%;
    // }

    .modal {
        position: absolute;
        top: 20px;
        right: 20px;
        // transform: translate(-50%, -50%);
        background: var(--White);
        padding: 50px;
        border-radius: 10px;
        width: 30vw;
        box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.208);
        height: 40vh;
        z-index: 10;

        .modal-close {
            position: absolute;
            top: 30px;
            right: 30px;
            background: unset;
            border: 2px solid var(--Secondary-900);
            outline: 0;
            font-size: 15px;
            font-weight: bold;
            color: var(--Secondary-900);
            padding: 5px 10px;
            border-radius: 100px;
            cursor: pointer;
        }

        .modal-header {
            margin-bottom: 30px;
        }

        .modal-body {
            // overflow-y: scroll;
            // height: 100%;
            padding-right: 15px;

            .questions-container {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;

                .question-item {
                    color: var(--Secondary-900);
                    border: 2px solid var(--Secondary-900);
                    padding: 10px;
                    border-radius: 5px;
                }

                .question-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: start;
                    margin-bottom: 10px;
                }

                .question-body {
                    margin-bottom: 10px;
                }

                .question-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .method {
                        padding: 5px 15px;
                        background-color: var(--Secondary-900);
                        border-radius: 10px;
                        color: var(--White);
                        font-size: small;
                    }

                    .action {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 5px;
                    }
                }
            }
        }
    }
}
</style>