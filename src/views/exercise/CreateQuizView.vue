<script setup>
// START SCRIPT SETUP

// --- 1. Imports ---
// Vue & Router
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Utils
import api from '@/utils/api';

// Components
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import InputComponent from '@/components/fields/InputComponent.vue';
import WysiwygEditorComponent from '@/components/fields/WysiwygEditorComponent.vue';
import FileUploadComponent from '@/components/fields/FileUploadComponent.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import CheckboxesComponent from '@/components/fields/CheckboxesComponent.vue';
import QuestionBankModal from '@/components/modal/QuestionBankModal.vue';
import ToastComponent from '@/components/toast/ToastComponent.vue';
import ConfirmComponent from '@/components/confirm/ConfirmComponent.vue';
// --- End Imports ---

// --- 2. State (Refs & Computed) ---

// Environment
const baseUrl = import.meta.env.VITE_APP_API_URL;

// Router
const route = useRoute();
const router = useRouter();
const id = route.params.id

// Modal & Toast State
const isModalShowed = ref(false); // Bank Soal
const isConfirmOpen = ref(false); // Konfirmasi Submit
const confirmMsg = ref(''); // (Tidak terpakai, tapi ada)
const isShowToast = ref(false);
const toastMsg = ref('');
const toastType = ref('success');

// Form Step 1: Data Latihan
const name = ref('');
const description = ref('');
const method = ref(null);
const level = ref(null);
const objectValue = ref(null); // Khusus untuk method 5
const isDataSaved = ref(false); // Flag untuk pindah ke step 2
const errors = ref({}); // Validasi error (diubah ke object)

// Form Step 2: Data Pertanyaan
const numberOfQuestion = ref(1);
const questions = ref([]); // Array untuk menampung semua soal
const question = ref('');  // v-model untuk soal aktif
const key = ref('');       // v-model untuk kunci jawaban aktif
const questionActive = ref(1); // Navigasi soal

// Data Statis untuk Form
const questionBank = ref([]); // (Di-fetch nanti, jika perlu)
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
const typeOfObject = ref([
    { label: 'Warna', value: 1 },
    { label: 'Objek', value: 2 },
]);

// Computed Properties
const objectValueLabel = computed(() => {
    return typeOfObject.value.find(d => d.value == objectValue.value) || { label: '' };
});
const methodLabel = computed(() => {
    return methodSelected.value.find(d => d.value == method.value) || { label: '' };
});
// --- End State ---

// --- 3. Methods ---

// START saveData (Validasi Form Step 1)
const saveData = () => {
    try {
        errors.value = {}; // Reset errors
        if (!name.value) {
            if (!name.value) {
                errors.value.name = 'Nama latihan wajib diisi';
            }
            return;
        }
        isDataSaved.value = true;
        handleToast('Berhasil menyimpan data');
    } catch (e) {
        handleToast('Gagal menyimpan jawaban', 'error')
    }
};
// END saveData

// START addQuestion (Navigasi: Tambah Soal)
const addQuestion = () => {
    // Cek apakah soal saat ini sudah disimpan
    if (!questions.value.find(d => d.index == questionActive.value)) {
        handleToast('Isi dan simpan pertanyaan saat ini terlebih dahulu!', 'error');
        return;
    }

    // Reset v-model dan tambah nomor soal
    question.value = '';
    key.value = '';
    numberOfQuestion.value += 1;
    questionActive.value = numberOfQuestion.value;
};
// END addQuestion

// START openQuestion (Navigasi: Buka Soal)
const openQuestion = (num) => {
    if (num < 1 || num > numberOfQuestion.value) return;

    questionActive.value = num;
    handleAttemptQuestion(num); // Muat data soal
};
// END openQuestion

// START pushQuestion (Simpan Soal Aktif ke Array)
const pushQuestion = () => {
    errors.value = {}; // Reset errors
    if (!question.value || !key.value) {
        if (!question.value) {
            errors.value.question = 'Isi pertanyaan terlebih dahulu';
        }
        if (!key.value) {
            errors.value.key = 'Isi kunci jawaban terlebih dahulu';
        }
        return;
    }

    // Cari apakah soal sudah ada di array
    const findQuestion = questions.value.find(d => d.index == questionActive.value);

    if (!findQuestion) {
        // Jika belum ada, push baru
        questions.value.push({
            question: question.value,
            key: key.value,
            method: method.value,
            index: questionActive.value
        });
    } else {
        // Jika sudah ada, update
        findQuestion.question = question.value;
        findQuestion.key = key.value;
        findQuestion.method = method.value;
    }
    handleToast('Berhasil menyimpan soal!');
};
// END pushQuestion

// START handleMethod (Handler untuk Checkbox Tipe Soal)
const handleMethod = (val) => {
    method.value = val;
};
// END handleMethod

// START handleLevel (Handler untuk Pilihan Level)
const handleLevel = (val) => {
    const foundLevel = methodOfArray.value.find(d => d.level == val);

    if (foundLevel) {
        level.value = val;
        // Cek jika data method sama, tidak perlu reset pilihan method
        const isDataSame = JSON.stringify(methodSelected.value) == JSON.stringify(foundLevel.data);
        methodSelected.value = isDataSame ? methodSelected.value : foundLevel.data;
        method.value = isDataSame ? method.value : null;
    }
};
// END handleLevel

// START handleObjectColor (Handler untuk Pilihan Tipe Objek)
const handleObjectColor = (val) => {
    objectValue.value = val;
    if (objectValue.value == 1) { // Jika pilih 'Warna'
        question.value = '#000000'; // Set default color
    }
};
// END handleObjectColor

// START handleQuestionBank (Buka/Tutup Modal Bank Soal)
const handleQuestionBank = () => {
    isModalShowed.value = !isModalShowed.value;
};
// END handleQuestionBank

// START insertQuestion (Handler dari Modal Bank Soal)
const insertQuestion = (params) => {
    isModalShowed.value = false;

    // Logika mirip pushQuestion, tapi data dari bank soal
    const findQuestion = questions.value.find(d => d.index == questionActive.value);
    if (!findQuestion) {
        questions.value.push({
            question: params.question.value, // 'question.value' dari bank soal
            key: params.key,
            method: params.method,
            index: questionActive.value
        });
    } else {
        findQuestion.question = params.question.value;
        findQuestion.key = params.key;
        findQuestion.method = params.method;
    }

    handleToast('Berhasil menyimpan soal!');
    handleAttemptQuestion(questionActive.value); // Tampilkan data di form
};
// END insertQuestion

// START handleAttemptQuestion (Muat Data Soal ke Form)
const handleAttemptQuestion = (num) => {
    const findQuestion = questions.value.find(d => d.index == num);

    if (findQuestion) {
        // Jika soal ada di array, muat ke v-model
        question.value = findQuestion.question;
        key.value = findQuestion.key;
        method.value = findQuestion.method
    } else {
        // Jika tidak ada (soal baru), kosongkan v-model
        question.value = '';
        key.value = '';
        method.value = null
    }
};
// END handleAttemptQuestion

// START Confirmation Modal Handlers
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
// END Confirmation Modal Handlers

// START handleToast (Helper untuk Menampilkan Toast)
const handleToast = (msg, type) => {
    isShowToast.value = true;
    toastMsg.value = msg;
    toastType.value = type ?? 'success';
};
// END handleToast

// START Watcher untuk Toast
// (Menggunakan sistem 1 toast, bukan antrian array)
watch(() => isShowToast.value, () => {
    if (isShowToast.value == true) {
        setTimeout(() => {
            isShowToast.value = false;
        }, 3000);
    }
});
// END Watcher untuk Toast

// START fileToBase64 (Utility Function)
const fileToBase64 = (params) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(params);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
// END fileToBase64

// START submit (Fungsi Submit Utama ke API)
const submit = async () => {
    errors.value = {}; // Reset errors

    // Jika method 5 (Tebak Cepat) & object 2 (Gambar)
    if (method.value == 5 && objectValue.value == 2) {
        // Ubah semua file baru (instanceof File) menjadi Base64
        // Soal dari bank soal (string path) akan diabaikan
        const formattingPromises = questions.value.map(async (item) => {
            if (!(item.question instanceof File)) {
                return item;
            }

            const base64File = await fileToBase64(item.question);
            return {
                ...item,
                question: base64File
            };
        });

        // Tunggu semua konversi selesai sebelum lanjut
        questions.value = await Promise.all(formattingPromises);
    }

    // Kirim data ke API
    await api.post(`/exercise/quiz`, {
        exerciseId: route.params.id,
        name: name.value,
        description: description.value,
        level: level.value,
        // method: method.value,
        questions: questions.value
    }).then(res => {
        router.push({ name: 'exercise.quiz.list', params: route.params.id });
    }).catch(e => {
        if (e.status === 422) errors.value = e.response.data.errors;
    });
};
// END submit
// --- End Methods ---

// END SCRIPT SETUP
</script>

<template>
    <div class="container">

        <ConfirmComponent v-if="isConfirmOpen" title="Simpan soal?"
            message="Apakah Anda yakin untuk menyimpan soal latihan?" confirmText="Simpan" cancelText="Batal"
            @confirm="handleConfirmAction" @cancel="handleCancelAction" />

        <ToastComponent :message="toastMsg" :type="toastType" v-show="isShowToast" />

        <QuestionBankModal v-if="isModalShowed" :questions="questionBank" :method="method"
            :methodLabel="methodLabel.label" :level="level" :questionType="objectValue" :insertQuestion="insertQuestion"
            :handleQuestionBank="handleQuestionBank" />
        <div class="page-header exercise">
            <router-link :to="{ name: 'exercise.quiz.list', params: route.params.id }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Buat Quiz Baru</h1>
        </div>
        <div class="page-body">

            <div class="form" v-if="!isDataSaved">
                <div class="input-wrapper level-wrapper" :class="{ 'invalid': errors?.level ?? false }">
                    <label for="level">Level Latihan <span class="req">*</span></label>
                    <div class="level-container">
                        <div :class="['item', level == 1 ? 'active' : '']" @click="handleLevel(1)">1</div>
                        <div :class="['item', level == 2 ? 'active' : '']" @click="handleLevel(2)">2</div>
                        <div :class="['item', level == 3 ? 'active' : '']" @click="handleLevel(3)">3</div>
                    </div>
                    <div class="invalid-msg">{{ errors?.level }}</div>
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
                            <label for="type" :class="{ 'invalid': errors?.method ?? false }">Tipe Soal <span
                                    class="req">*</span></label>
                            <CheckboxesComponent :data="methodSelected" :function="handleMethod"
                                :isInvalid="errors?.method ?? false" :invalidMsg="errors?.method ?? ''" />

                            <label for="type" :class="{ 'invalid': errors?.method ?? false }" v-if="method == 5">Pilih
                                tipe
                                soal <span class="req">*</span></label>
                            <CheckboxesComponent :data="typeOfObject" :function="handleObjectColor" :isInvalid="false"
                                :invalidMsg="errors?.method ?? ''" v-if="method == 5" />
                        </div>
                    </div>
                    <!-- <div class="input-flex">
                        <div class="input-wrapper">
                            <label for="type">Tipe Soal</label>
                            <div class="method-selected">{{ methodLabel.label }}</div>
                            <label for="type" v-if="objectValue">Tipe Objek</label>
                            <div class="method-selected" v-if="objectValue">{{ objectValueLabel.label }}</div>
                        </div>
                        <div class="input-wrapper level-wrapper">
                            <label for="level">Level Latihan</label>
                            <div class="level-container">
                                <div :class="['item', level == 1 ? 'active' : '']" v-if="level == 1">1</div>
                                <div :class="['item', level == 2 ? 'active' : '']" v-if="level == 2">2</div>
                                <div :class="['item', level == 3 ? 'active' : '']" v-if="level == 3">3</div>
                            </div>
                        </div>
                    </div> -->

                    <div class="input-wrapper" v-if="[1, 2, 3, 4].includes(method)"
                        :class="{ 'invalid': errors?.question ?? false }">
                        <label for="textarea">Pertanyaan</label>
                        <textarea v-model="question" id="textarea" placeholder="Masukkan pertanyaan"
                            :class="['textarea', { 'invalid': errors?.question ?? false }]"></textarea>
                        <div class="invalid-msg">{{ errors?.question }}</div>
                    </div>

                    <input-component v-if="method == 5 && objectValue == 1" label="Pilih Warna" :required="true"
                        type="color" placeholder="Pilih Warna" id="color" class="input" v-model="question"
                        :isInvalid="errors?.question ?? false" :invalidMsg="errors?.question ?? ''" />

                    <div class="input-wrapper" v-if="method == 5 && objectValue == 2">
                        <div class="question-from-bank" v-if="(typeof question == 'string' && question != '')">
                            <p>Upload gambar baru jika ingin mengganti gambar</p>
                            <img :src="`${baseUrl}/api/v1/${question}`" alt="Question from bank">
                        </div>
                        <label for="file">Upload gambar objek</label>
                        <FileUploadComponent v-model="question" :id="'file'" :infoText="'Upload gambar objek'"
                            accept="image/*" />
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
                            display="border" @click="showConfirmation" />
                    </div>
                </div>
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
    min-height: 250px; // <-- Kurangi tinggi minimum
    border: 1px solid var(--Neutral-400); // <-- Gunakan variabel warna
    outline: none;
    border-radius: 10px;
    padding: 15px;
    background: unset;
    font-family: 'Ubuntu Sans', sans-serif;
    font-size: 1rem;

    &.invalid {
        border-color: var(--Danger-900);
    }
}

.input-flex {
    display: grid;
    grid-template-columns: 1fr auto; // <-- Diubah ke 1fr auto
    gap: 20px;

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

/* --- End Wrapper Input & Level --- */


/* --- Workspace (Form Step 2) --- */
.workspace {
    display: grid;
    grid-template-columns: 3fr 1fr; // <-- Diubah jadi 3fr 1fr (lebih umum)
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
        margin-bottom: 30px;
    }
}

/* --- End Workspace --- */

/* --- Navigasi Soal --- */
.navigation {
    background-color: var(--White);
    padding: 30px;
    border-radius: 10px;
    margin-bottom: 30px;
    // Tambahkan ini agar nempel di atas saat scroll (jika diinginkan)
    position: sticky;
    top: 20px;

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
            // Gunakan auto-fit agar otomatis mengisi kolom
            grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
            gap: 5px;
            margin-bottom: 10px;

            .number {
                list-style: none;
                color: var(--Secondary-900);
                border: 2px solid var(--Secondary-900);
                border-radius: 5px;
                width: 45px; // Lebar tetap
                height: 45px; // Tinggi tetap
                display: flex; // <-- Gunakan flex
                align-items: center; // <-- Pusatkan vertikal
                justify-content: center; // <-- Pusatkan horizontal
                font-weight: bold;
                cursor: pointer;
                transition: background-color 0.2s, color 0.2s; // <-- Tambahkan transisi

                &.active {
                    background-color: var(--Info-200);
                    color: var(--White);
                    border-color: var(--Info-200); // <-- Samakan border
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
            transition: background-color 0.2s; // <-- Tambahkan transisi

            &:hover {
                background-color: var(--Neutral-100);
            }
        }
    }

    .navigation-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }
}

/* --- End Navigasi Soal --- */


/* --- RESPONSIVE --- */

/* Target Tablet Besar */
@media (max-width: 1024px) {
    .workspace {
        grid-template-columns: 1fr; // <-- Pecah jadi 1 kolom
        gap: 30px;
    }

    .navigation-container {
        order: -1; // <-- Pindahkan navigasi ke atas form soal
    }

    .navigation {
        position: relative; // <-- Hapus sticky di mobile
        top: 0;
    }
}

/* Target Ponsel */
@media (max-width: 576px) {
    .input {
        margin-bottom: 20px;
    }

    .textarea {
        margin-bottom: 30px;
        min-height: 200px; // Kurangi tinggi textarea di ponsel
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

    .navigation {
        padding: 20px; // Kurangi padding
    }
}

/* END STYLES */
</style>