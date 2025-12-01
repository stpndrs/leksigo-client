<script setup>
import { onMounted, ref, watch } from 'vue';
import InputComponent from '../fields/InputComponent.vue';
import ButtonComponent from '../buttons/ButtonComponent.vue';
import api from '@/utils/api';
import { formatDate } from '@/helpers/formatDate';

const search = ref()

const baseUrl = import.meta.env.VITE_APP_API_URL
const props = defineProps(['method', 'methodLabel', 'level', 'questionType', 'insertQuestion', 'handleQuestionBank'])
const questionBank = ref([])

onMounted(async () => {
    await api.get(`/questions?level=${props.level}&method=${props.method}`)
        .then(res => {
            questionBank.value = []
            questionBank.value = res.data.data
            if (props.method == 5 && props.questionType == 1) {
                questionBank.value = res.data.data.filter(d => d.question.type == 'hex')
            } else if (props.method == 5 && props.questionType == 2) {
                questionBank.value = res.data.data.filter(d => d.question.type == 'path')
            }

            console.log(props.questionType);

        }).catch(e => {
            console.log(e);
        })
})

watch(() => props => () => {
    console.log(props);
})
</script>

<template>
    <div class="modal-container">
        <div class="modal">
            <button class="modal-close" @click="props.handleQuestionBank()">X</button>
            <div class="modal-header">
                <InputComponent v-model="search" label="Cari Data Soal" type="text" placeholder="Cari Data Soal" />
            </div>
            <div class="modal-body">
                <div class="questions-container">
                    <div class="question-item" v-for="(item, index) in questionBank" :key="index">
                        <div class="question-header">
                            <img :src="`${baseUrl}/api/v1/${item?.question?.value}`" alt="Pertanyaan"
                                v-if="item?.question?.type == 'path'">
                            <h2 class="question" v-else>{{ item?.question?.value }}</h2>
                            <p class="date">{{ formatDate(item?.createdAt) }}</p>
                        </div>
                        <div class="question-body">
                            <p class="key">Kunci : {{ item?.key }}</p>
                        </div>
                        <div class="question-footer">
                            <div class="method">{{ methodLabel }}</div>
                            <div class="action">
                                <ButtonComponent label="Gunakkan" class="secondary" display="border" size="small"
                                    @click="props.insertQuestion(item)" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.modal-container {
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;

    &::before {
        position: absolute;
        top: 0;
        left: 0;
        content: '';
        width: 100%;
        height: 100%;
        background-color: black;
        opacity: 20%;
    }

    .modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--White);
        padding: 50px;
        border-radius: 20px;
        width: 85vw;
        height: 90vh;
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
            overflow-y: scroll;
            height: 60vh;
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

                    img {
                        width: 50%;
                        border-radius: 10px;
                    }
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