<script setup lang="ts">
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import DoneIcon from '@/components/shape/DoneIcon.vue';
import LockIcon from '@/components/shape/LockIcon.vue';
import LockOpenIcon from '@/components/shape/LockOpenIcon.vue';
import { formatDate } from '@/helpers/formatDate';
import { workStore } from '@/stores/WorkStore';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const isWorkMode = workStore.isWorkMode

const data = ref({})
const id = route.params.id

const totalQuizPoint = ref(0)


onMounted(async () => {
    if (isWorkMode) {
        await api.get(`/exercise/${route.params.id}`, {
            params: {
                hidden: false
            }
        })
            .then((res) => {
                console.log(res);
                data.value = res.data.data
                console.log(data.value);

                data.value.quiz.forEach(item => {
                    totalQuizPoint.value += item.quizPoint || 0
                });
            }).catch(err => {
                console.error(err)
            })
    } else {
        await api.get(`/exercise/${route.params.id}`)
            .then((res) => {
                console.log(res);
                data.value = res.data.data
                console.log(data.value);

                data.value.quiz.forEach(item => {
                    totalQuizPoint.value += item.quizPoint || 0
                });
            }).catch(err => {
                console.error(err)
            })
    }
})

</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'childs.detail', params: { id: data?.childrenId } }">
                <ChevronLeftIcon />
            </router-link>
            <div>
                <p class="page-title">Kerjakan : <strong>{{ data?.name }}</strong></p>
                <div class="page-description" v-html="data?.description"></div>
            </div>
        </div>
        <div class="page-body">
            <div class="action">
                <p class="score">Total Skor : <strong>{{ totalQuizPoint }}</strong></p>
                <ButtonComponent label="Buat Latihan" class="secondary"
                    @click="router.push({ name: 'exercise.quiz.create', params: { id: id } })" v-if="!isWorkMode" />
            </div>
            <div class="quiz-container">
                <div :class="['item', { disabled: index > 0 ? data?.quiz[index - 1]?.answers?.length == 0 || data?.quiz[index - 1]?.quizPoint < 60 : false }]"
                    v-for="(item, index) in data?.quiz" :key="index"
                    @click="(index > 0 ? data?.quiz[index - 1]?.answers?.length == 0 || data?.quiz[index - 1]?.quizPoint < 60 : false) ? null : $router.push({ name: 'exercise.quiz.overview', params: { id: id, quizId: item._id } })">
                    <div class="point">{{ item?.quizPoint ?? 0 }}</div>
                    <div class="identity">
                        <p class="title">{{ item.name }}</p>
                        <p class="date">{{ formatDate(item.date) }}</p>
                        <div class="category">Level {{ item.level }}</div>
                    </div>
                    <div class="status">
                        <DoneIcon v-if="item.answers.length > 0" />
                        <LockOpenIcon
                            v-else-if="index > 0 ? data?.quiz[index - 1]?.answers?.length > 0 && data?.quiz[index - 1]?.quizPoint > 60 : true" />
                        <LockIcon v-else />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    p {
        font-size: 35px;
        color: var(--Secondary-900);
    }
}

.quiz-container {
    .item {
        display: grid;
        grid-template-columns: 10% 70% 20%;
        gap: 40px;
        align-items: center;
        border: 3px solid var(--Secondary-900);
        border-radius: 10px;
        padding: 10px;
        margin-bottom: 30px;
        cursor: pointer;
        background: var(--White);

        .point {
            font-size: 50px;
            color: var(--Secondary-900);
            text-align: center;
            border-right: 3px dashed var(--Info-200);
            padding: 10px;
        }

        .identity {
            font-size: 25px;
            color: var(--Secondary-900);

            .title {
                font-weight: bold;
            }

            .category {
                padding: 5px 15px;
                border-radius: 10px;
                margin-top: 10px;
                font-size: 15px;
                background-color: var(--Secondary-900);
                width: fit-content;
                color: white;
            }
        }

        .question {
            text-align: center;
            font-size: 30px;
            color: var(--Info-200);

            .worked {
                color: var(--Secondary-900);
            }

            .total {
                color: var(--Primary-900);
            }
        }

        &.disabled {
            cursor: not-allowed;
            opacity: 50%;
        }
    }
}
</style>