<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import api from '@/utils/api';

import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import InputComponent from '@/components/fields/InputComponent.vue';
import WysiwygEditorComponent from '@/components/fields/WysiwygEditorComponent.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import QuestionBankModal from '@/components/modal/QuestionBankModal.vue';
import ConfirmComponent from '@/components/confirm/ConfirmComponent.vue';

const baseUrl = import.meta.env.VITE_APP_API_URL;

const route = useRoute();
const router = useRouter();

const isModalShowed = ref(false); // Bank Soal
const isConfirmOpen = ref(false); // Konfirmasi Submit

const name = ref('');
const description = ref('');
const level = ref(null);
const errors = ref({}); // Validasi error (diubah ke object)

const showConfirmation = () => {
    isConfirmOpen.value = true;
};

const handleLevel = (val) => {
    level.value = val;
};

const handleConfirmAction = () => {
    submit(); // Panggil fungsi submit utama
    isConfirmOpen.value = false; // Tutup modal
};

const handleCancelAction = () => {
    isConfirmOpen.value = false; // Tutup modal
};

const submit = async () => {
    errors.value = {}; // Reset errors

    // Kirim data ke API
    await api.post(`/exercise`, {
        childrenId: route.params.id,
        name: name.value,
        description: description.value,
        // level: level.value,
    }).then(res => {
        router.push({ name: 'childs.detail', params: route.params.id });
    }).catch(e => {
        if (e.status === 422) errors.value = e.response.data.errors;
    });
};
</script>

<template>
    <div class="container">
        <ConfirmComponent v-if="isConfirmOpen" title="Simpan soal?"
            message="Apakah Anda yakin untuk menyimpan soal latihan?" confirmText="Simpan" cancelText="Batal"
            @confirm="handleConfirmAction" @cancel="handleCancelAction" />

        <QuestionBankModal v-if="isModalShowed" :questions="questionBank" :method="method"
            :methodLabel="methodLabel.label" :level="level" :questionType="objectValue" :insertQuestion="insertQuestion"
            :handleQuestionBank="handleQuestionBank" />
        <div class="page-header exercise">
            <router-link :to="{ name: 'childs.detail', params: route.params.id }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Buat Latihan Baru</h1>
        </div>
        <div class="page-body">
            <div class="form">
                <!-- <div class="input-flex">
                    <div class="input-wrapper level-wrapper" :class="{ 'invalid': errors?.level ?? false }">
                        <label for="level">Level Latihan <span class="req">*</span></label>
                        <div class="level-container">
                            <div :class="['item', level == 1 ? 'active' : '']" @click="handleLevel(1)">1</div>
                            <div :class="['item', level == 2 ? 'active' : '']" @click="handleLevel(2)">2</div>
                            <div :class="['item', level == 3 ? 'active' : '']" @click="handleLevel(3)">3</div>
                        </div>
                        <div class="invalid-msg">{{ errors?.level }}</div>
                    </div>
                </div> -->

                <input-component label="Judul Latihan" :required="true" type="text" placeholder="Judul latihan"
                    id="name" class="input" v-model="name" :isInvalid="errors?.name ?? false"
                    :invalidMsg="errors?.name ?? ''" />

                <div class="input-wrapper">
                    <label for="editor">Deskripsi</label>
                    <WysiwygEditorComponent v-model="description" class="textarea" />
                </div>

                <ButtonComponent label="Simpan" size="full" class="secondary" @click="showConfirmation" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* START STYLES */

/* --- Input Umum --- */
.input {
    margin-bottom: 30px;
}

.textarea {
    margin-bottom: 50px;
}

textarea.textarea {
    margin: auto;
    width: 100%;
    min-height: 50vh;
    border: 1px solid black;
    outline: none;
    border-radius: 10px;
    padding: 15px;
    background: unset;
}

.input-flex {
    display: grid;
    grid-template-columns: 70% auto;

    &.level-wrapper {
        justify-self: end;
    }
}

/* --- End Input Umum --- */

/* --- Wrapper Input & Level --- */
.input-wrapper {
    margin-bottom: 30px;

    label {
        color: var(--Neutral-700);
        display: block;
        font-weight: 500;
        margin-bottom: 10px;
        font-size: medium;
    }

    /* Level Selector */
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

    /* --- Status Invalid (Error) --- */
    .invalid-msg {
        display: none;
    }

    label.invalid {
        color: var(--Danger-900, #CC1D1D);
    }

    &.invalid {
        label {
            color: var(--Danger-9G00, #CC1D1D);
        }

        textarea {
            border: 2px solid var(--Danger-900);
        }

        .item {
            // Untuk level
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

    /* --- End Status Invalid --- */

    /* Preview Gambar dari Bank Soal */
    .question-from-bank {
        color: var(--Danger-900);
        margin-bottom: 15px;

        img {
            width: 30%;
            border-radius: 10px;
            margin-top: 10px;
        }
    }
}
</style>