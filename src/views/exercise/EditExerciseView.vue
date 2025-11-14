<script setup>
import { ref, computed, watch, onMounted } from 'vue';
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

const id = route.params.id
const isModalShowed = ref(false); // Bank Soal
const isConfirmOpen = ref(false); // Konfirmasi Submit

const name = ref('');
const description = ref('');
const level = ref(null);
const errors = ref({}); // Validasi error (diubah ke object)

const showConfirmation = () => {
    isConfirmOpen.value = true;
};

const handleConfirmAction = () => {
    submit(); // Panggil fungsi submit utama
    isConfirmOpen.value = false; // Tutup modal
};

const handleCancelAction = () => {
    isConfirmOpen.value = false; // Tutup modal
};

onMounted(async () => {
    await api.get(`/exercise/${id}`)
        .then(res => {
            console.log(res);
            name.value = res.data.data.name
            description.value = res.data.data.description
        }).catch(e => {
            console.log(e);
        })
})

const submit = async () => {
    errors.value = {}; // Reset errors

    // Kirim data ke API
    await api.put(`/exercise/${id}`, {
        name: name.value,
        description: description.value,
    }).then(res => {
        router.push({ name: 'exercise.quiz.list', params: route.params.id });
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
            <router-link :to="{ name: 'exercise.quiz.list', params: route.params.id }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Edit Latihan</h1>
        </div>
        <div class="page-body">
            <div class="form">

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

// Style ini sepertinya tidak terpakai karena Anda menggunakan WysiwygEditorComponent
// Tapi saya biarkan jika Anda membutuhkannya
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
    grid-template-columns: 1fr auto; // <-- Diubah ke 1fr auto
    gap: 20px; // <-- Tambahkan gap

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
                transition: background-color 0.2s, color 0.2s; // <-- Tambahkan transisi

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
    // Dipindahkan ke luar .input-wrapper agar bisa dipakai global
    .invalid-msg {
        display: none;
    }

    label.invalid {
        color: var(--Danger-900, #CC1D1D);
    }

    // Seharusnya ini ada di .input-wrapper, bukan di root style
    &.invalid {
        label {
            color: var(--Danger-900, #CC1D1D);
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
            width: 30%; // <-- Default desktop
            border-radius: 10px;
            margin-top: 10px;
        }
    }
}


/* --- RESPONSIVE --- */

/* Target Tablet */
@media (max-width: 768px) {
    .input-flex {
        grid-template-columns: 1fr; // <-- Pecah jadi 1 kolom
    }

    .input-wrapper {
        .question-from-bank img {
            width: 50%; // <-- Besarkan gambar preview
        }
    }
}

/* Target Ponsel */
@media (max-width: 576px) {
    .input {
        margin-bottom: 20px;
    }

    .textarea {
        margin-bottom: 30px;
    }

    .input-wrapper {
        margin-bottom: 20px;

        &.level-wrapper {
            .level-container {
                gap: 10px;

                .item {
                    padding: 8px 15px; // Kecilkan padding
                    font-size: 16px; // Kecilkan font
                }
            }
        }

        .question-from-bank img {
            width: 100%; // <-- Penuhi layar
        }
    }
}
</style>