<script setup>
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import InputComponent from '@/components/fields/InputComponent.vue';
import WysiwygEditorComponent from '@/components/fields/WysiwygEditorComponent.vue';
import FileUploadComponent from '@/components/fields/FileUploadComponent.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import CheckboxesComponent from '@/components/fields/CheckboxesComponent.vue';

import api from '@/utils/api';
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import QuestionBankModal from '@/components/modal/QuestionBankModal.vue';

const isModalShowed = ref(false)
const route = useRoute();
const questionBank = ref([])

const name = ref('');
const description = ref('');
const methodOfArray = ref([
    {
        level: 1,
        data: [
            { label: 'Mendengar Audio', value: 1 },
            { label: 'Menulis Ulang', value: 2 },
            { label: 'Membaca', value: 3 },
        ]
    },
    {
        level: 2,
        data: [
            { label: 'Mendengar Audio', value: 1 },
            { label: 'Menulis Ulang', value: 2 },
            { label: 'Membaca', value: 3 },
        ]
    },
    {
        level: 3,
        data: [
            { label: 'Mendengar Audio', value: 1 },
            { label: 'Menulis Ulang', value: 2 },
            { label: 'Membaca', value: 3 },
            { label: 'Mengurut Kata', value: 4 },
            { label: 'Menebak Cepat', value: 5 },
        ]
    },
]);
const methodSelected = ref([
    { label: 'Mendengar Audio', value: 1 },
    { label: 'Menulis Ulang', value: 2 },
    { label: 'Membaca', value: 3 },
]);
const method = ref(null);
const level = ref(null);

const numberOfQuestion = ref(1);
const questions = ref([]);
const question = ref('');
const key = ref('');
const questionActive = ref(1);

const isDataSaved = ref(false);
const errors = ref([]);

const methodLabel = computed(() => {
    return methodSelected.value.find(d => d.value == method.value) || { label: '' };
});

const saveData = () => {
    isDataSaved.value = true;
};

const addQuestion = () => {
    if (!questions.value.find(d => d.index == questionActive.value)) {
        return alert("Isi dan simpan soal saat ini terlebih dahulu");
    }

    question.value = '<p></p>';
    key.value = '';
    numberOfQuestion.value += 1;
    questionActive.value = numberOfQuestion.value;
};

const openQuestion = (num) => {
    if (num < 1 || num > numberOfQuestion.value) return;

    questionActive.value = num;
    handleAttemptQuestion(num)
};

const pushQuestion = () => {
    const isQuestionEmpty = !question.value || question.value === '<p><br></p>';
    const isKeyEmpty = !key.value;

    if (isQuestionEmpty) {
        return alert('Isi soal woy');
    }
    if (isKeyEmpty) {
        return alert('Isi kunci jawaban woy');
    }

    const findQuestion = questions.value.find(d => d.index == questionActive.value);

    if (!findQuestion) {
        questions.value.push({
            question: question.value,
            key: key.value,
            index: questionActive.value
        });
    } else {
        findQuestion.question = question.value;
        findQuestion.key = key.value;
    }
};

const handleMethod = (val) => {
    method.value = val;
};

const handleLevel = (val) => {
    const foundLevel = methodOfArray.value.find(d => d.level == val);

    if (foundLevel) {
        level.value = val;
        methodSelected.value = foundLevel.data;
        method.value = null;
    }
};

const handleQuestionBank = () => {
    isModalShowed.value = !isModalShowed.value
}

// Insert question from question bank while selected
const insertQuestion = (params) => {
    isModalShowed.value = false

    const findQuestion = questions.value.find(d => d.index == questionActive.value);
    if (!findQuestion) {
        questions.value.push({
            question: params.question.value,
            key: params.key,
            index: questionActive.value
        });
    } else {
        findQuestion.question = params.question.value;
        findQuestion.key = params.key;
    }

    handleAttemptQuestion(questionActive.value)
}

const handleAttemptQuestion = (num) => {
    const findQuestion = questions.value.find(d => d.index == num);

    if (findQuestion) {
        question.value = findQuestion.question;
        key.value = findQuestion.key;
    } else {
        question.value = '<p></p>';
        key.value = '';
    }
}

const submit = async () => {
    errors.value = null;

    await api.post(`/exercise`, {
        childrenId: route.params.id,
        name: name.value,
        description: description.value,
        level: level.value,
        method: method.value,
        questions: questions.value
    }).then(res => {
        console.log(res);
    }).catch(e => {
        if (e.status === 422) errors.value = e.response.data.errors;
    });
};
</script>

<template>
    <div class="container">
        <QuestionBankModal v-if="isModalShowed" :questions="questionBank" :method="method"
            :methodLabel="methodLabel.label" :level="level" :insertQuestion="insertQuestion"
            :handleQuestionBank="handleQuestionBank" />
        <div class="page-header exercise">
            <router-link :to="{ name: 'childs.detail', params: route.params.code }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Buat Latihan Baru</h1>
        </div>
        <div class="page-body">
            <div class="form" v-if="!isDataSaved">
                <div class="input-flex">
                    <div class="input-wrapper">
                        <label for="type" :class="{ 'invalid': errors?.method ?? false }">Tipe Soal <span
                                class="req">*</span></label>
                        <CheckboxesComponent :data="methodSelected" :function="handleMethod"
                            :isInvalid="errors?.method ?? false" :invalidMsg="errors?.method ?? ''" />
                    </div>
                    <div class="input-wrapper level-wrapper" :class="{ 'invalid': errors?.level ?? false }">
                        <label for="level">Level Latihan <span class="req">*</span></label>
                        <div class="level-container">
                            <div :class="['item', level == 1 ? 'active' : '']" @click="handleLevel(1)">1</div>
                            <div :class="['item', level == 2 ? 'active' : '']" @click="handleLevel(2)">2</div>
                            <div :class="['item', level == 3 ? 'active' : '']" @click="handleLevel(3)">3</div>
                        </div>
                        <div class="invalid-msg">{{ errors?.level }}</div>
                    </div>
                </div>
                <input-component label="Judul Latihan" :required="true" type="text" placeholder="Judul latihan"
                    id="name" class="input" v-model="name" :isInvalid="errors?.name ?? false"
                    :invalidMsg="errors?.name ?? ''" />
                <div class="input-wrapper">
                    <label for="editor">Deskripsi</label>
                    <WysiwygEditorComponent v-model="description" class="textarea" />
                </div>
                <ButtonComponent label="Selanjutnya" size="full" class="secondary" @click="saveData" />
            </div>
            <div class="workspace" v-if="isDataSaved">
                <div class="form">
                    <div class="input-flex">
                        <div class="input-wrapper">
                            <label for="type" :class="{ 'invalid': errors?.method ?? false }">Tipe Soal</label>
                            <div class="method-selected">{{ methodLabel.label }}</div>
                        </div>
                        <div class="input-wrapper level-wrapper" :class="{ 'invalid': errors?.level ?? false }">
                            <label for="level">Level Latihan</label>
                            <div class="level-container">
                                <div :class="['item', level == 1 ? 'active' : '']" v-if="level == 1">1</div>
                                <div :class="['item', level == 2 ? 'active' : '']" v-if="level == 2">2</div>
                                <div :class="['item', level == 3 ? 'active' : '']" v-if="level == 3">3</div>
                            </div>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <label for="editor">Soal</label>
                        <WysiwygEditorComponent v-model="question" class="textarea" />
                    </div>
                    <input-component label="Kunci Jawaban" :required="true" type="text" placeholder="Kunci Jawaban"
                        id="key" class="input" v-model="key" :isInvalid="errors?.key ?? false"
                        :invalidMsg="errors?.key ?? ''" />
                    <ButtonComponent label="Simpan" size="full" class="secondary" @click="pushQuestion" />
                </div>
                <div class="navigation-container">
                    <div class="navigation">
                        <div class="navigation-header">
                            <h3 class="name">Navigasi</h3>
                        </div>
                        <div class="navigation-body">
                            <ul class="numbers">
                                <li :class="['number', { active: questionActive == i }]" v-for="i in numberOfQuestion"
                                    :key="i" @click="openQuestion(i)">{{ i }}</li>
                            </ul>
                            <button class="add-number" @click="addQuestion">+</button>
                        </div>
                        <div class="navigation-footer">
                            <ButtonComponent label="Sebelumnya" class="secondary" size="small" display="border"
                                @click="openQuestion(questionActive - 1)"
                                :isDisabled="numberOfQuestion == 1 || questionActive == 1" />
                            <ButtonComponent label="Selanjutnya" class="secondary" size="small" display="border"
                                @click="openQuestion(questionActive + 1)"
                                :isDisabled="questionActive == numberOfQuestion" />
                        </div>
                    </div>
                    <div class="question-bank">
                        <ButtonComponent label="Bank Soal" class="secondary" size="full" display="border"
                            @click="isModalShowed = true" />
                        <br>
                        <ButtonComponent label="Selesaikan penyimpanan soal" class="secondary" size="full"
                            display="border" @click="submit" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.input {
    margin-bottom: 30px;
}

.textarea {
    margin-bottom: 50px;
}

.input-flex {
    display: grid;
    grid-template-columns: 70% auto;

    &.level-wrapper {
        justify-self: end;
    }
}

.input-wrapper {
    margin-bottom: 30px;

    label {
        color: var(--Neutral-700);
        display: block;
        font-weight: 500;
        margin-bottom: 10px;
        font-size: medium;
    }

    &.level-wrapper {
        .level-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;

            .item {
                padding: 10px 25px;
                border-radius: 10px;
                font-size: 20px;
                font-weight: bold;
                font-family: 'Ubuntu Sans';
                border: 2px solid;
                text-align: center;
                cursor: pointer;

                &:nth-child(1) {
                    border-color: var(--Secondary-900);
                    color: var(--Secondary-900);

                    &.active {
                        background-color: var(--Secondary-900);
                        color: var(--White);
                    }
                }

                &:nth-child(2) {
                    border-color: var(--Ternary-500);
                    color: var(--Ternary-500);

                    &.active {
                        background-color: var(--Ternary-500);
                        color: var(--White);
                    }
                }

                &:nth-child(3) {
                    border-color: var(--Primary-900);
                    color: var(--Primary-900);

                    &.active {
                        background-color: var(--Primary-900);
                        color: var(--White);
                    }
                }
            }
        }
    }



    .invalid-msg {
        display: none;
    }

    label.invalid {
        color: var(--Danger-900, #CC1D1D);
    }

    &.invalid {

        label {
            color: var(--Danger-900, #CC1D1D);
        }

        .item {
            border-color: var(--Danger-900) !important;
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

.workspace {
    display: grid;
    grid-template-columns: 75% auto;
    gap: 50px;

    .method-selected {
        list-style: none;
        padding: 5px 15px;
        border-radius: 10px;
        cursor: pointer;
        border-color: var(--Primary-900) !important;
        background-color: var(--Primary-900) !important;
        color: var(--White) !important;
        width: fit-content;
    }
}

.navigation {
    background-color: var(--White);
    padding: 30px;
    border-radius: 10px;
    margin-bottom: 30px;

    .navigation-header {
        margin-bottom: 10px;

        h3 {
            color: var(--Secondary-900);
            font-size: larger;
        }
    }

    .navigation-body {
        margin-bottom: 10px;

        .numbers {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 5px;
            margin-bottom: 10px;

            .number {
                list-style: none;
                color: var(--Secondary-900);
                border: 2px solid var(--Secondary-900);
                border-radius: 5px;
                width: 45px;
                height: 45px;
                text-align: center;
                align-content: center;
                font-weight: bold;
                cursor: pointer;

                &.active {
                    background-color: var(--Info-200);
                    color: var(--White);
                }
            }

        }

        .add-number {
            color: var(--Secondary-900);
            border: 2px dashed var(--Secondary-900);
            border-radius: 5px;
            width: 45px;
            height: 45px;
            font-size: 30px;
            cursor: pointer;
            background-color: unset;
        }
    }

    .navigation-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }
}
</style>