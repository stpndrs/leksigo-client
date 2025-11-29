<script setup>
// START SCRIPT SETUP

// --- 1. Imports ---
// Vue & Router
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Utils
import api from '@/utils/api';
import { globalToast, triggerToast } from '@/utils/toast';
import { latestQuizStore } from '@/stores/LatestQuizStore';

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
const isSaveBtnLoading = ref(false)
const isLoading = ref(false)

// Router
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const quizId = route.params.quizId;

// Modal & Toast State
const isModalShowed = ref(false); // Bank Soal
const isConfirmOpen = ref(false); // Konfirmasi Submit
const errors = ref({}); // Validasi error

// Form Step 1: Data Latihan
const name = ref('');
const description = ref('');
const method = ref(null); // Tipe soal aktif (1-5)
const levelCurrent = latestQuizStore.getLevel == null ? 1 : latestQuizStore.getLevel == 1 ? 2 : 3;
const level = ref(levelCurrent);
const objectValue = ref(null); // Khusus untuk method 5 (1=Warna, 2=Objek/Gambar)
const isDataSaved = ref(false); // Flag: False = Edit Judul/Level, True = Edit Soal

// Form Step 2: Data Pertanyaan
const numberOfQuestion = ref(1);
const questions = ref([]); // Array penampung semua soal
const question = ref('');  // v-model input soal aktif
const key = ref('');       // v-model input kunci jawaban aktif
const questionActive = ref(1); // Pointer navigasi nomor soal
const questionActiveData = ref([])

// Data Statis
const questionBank = ref([]);
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
        errors.value = {};
        if (!name.value) {
            errors.value.name = 'Nama latihan wajib diisi';
            return;
        }
        isDataSaved.value = true;
        triggerToast('Berhasil menyimpan data latihan', 'success');
    } catch (e) {
        triggerToast('Gagal menyimpan data', 'error');
    }
};

// START addQuestion (Navigasi: Tambah Soal Baru)
const addQuestion = () => {
    // Cek apakah soal saat ini sudah disimpan di array questions
    const currentSaved = questions.value.find(d => d.index == questionActive.value);
    if (!currentSaved) {
        triggerToast('Simpan pertanyaan saat ini terlebih dahulu sebelum menambah baru!', 'error');
        return;
    }

    // Reset v-model untuk soal baru
    question.value = '';
    key.value = '';
    numberOfQuestion.value += 1;
    questionActive.value = numberOfQuestion.value;

    // Reset tipe method untuk soal baru (opsional, tergantung UX yg diinginkan)
    // method.value = null; 
};

// START openQuestion (Navigasi: Pindah Nomor Soal)
const openQuestion = (num) => {
    if (num < 1 || num > numberOfQuestion.value) return;

    questionActive.value = num;
    handleAttemptQuestion(num); // Load data soal ke form
};

// START pushQuestion (Simpan Soal Aktif ke Array Memory)
const pushQuestion = () => {
    try {
        errors.value = {};
        isSaveBtnLoading.value = true

        // Validasi sederhana
        if (!question.value && objectValue.value !== 1) {
            // Jika bukan tebak warna, pertanyaan (teks/gambar) wajib ada
            errors.value.question = 'Isi pertanyaan/gambar terlebih dahulu';
        }
        if (method.value == 5 && objectValue.value == 1 && !question.value) {
            // Jika tebak warna
            errors.value.question = 'Pilih warna terlebih dahulu';
        }
        if (!key.value) {
            errors.value.key = 'Isi kunci jawaban terlebih dahulu';
        }

        if (Object.keys(errors.value).length > 0) return;

        // Cari apakah soal index ini sudah ada
        const findQuestion = questions.value.find(d => d.index == questionActive.value);

        const payload = {
            question: question.value,
            key: key.value,
            method: method.value,
            objectValue: objectValue.value ?? null,
            index: questionActive.value
        };

        if (!findQuestion) {
            // Buat baru
            questions.value.push(payload);
        } else {
            // Update existing
            findQuestion.question = question.value;
            findQuestion.key = key.value;
            findQuestion.method = method.value;
            findQuestion.objectValue = objectValue.value;
        }
        console.log(findQuestion)
        triggerToast('Berhasil menyimpan soal!', 'success');
    } catch (e) {
        triggerToast('Gagal menyimpan data', 'error');
    } finally {
        isSaveBtnLoading.value = false
    }
};

// START handleMethod (Pilih Tipe Soal)
const handleMethod = (val) => {
    method.value = val;
    console.log(questionActiveData.value);

    // Reset jika ganti ke tipe selain warna dan value sebelumnya adalah warna
    if (val != 5 && (question.value.startsWith('#') || question.value == '')) question.value = '';
    else question.value = handleSetQuestionWithChecking(questionActiveData.value)
};

// START handleLevel (Setup Dropdown Level)
const handleLevel = () => {
    const foundLevel = methodOfArray.value.find(d => d.level == level.value);
    if (foundLevel) {
        const isDataSame = JSON.stringify(methodSelected.value) == JSON.stringify(foundLevel.data);
        methodSelected.value = isDataSame ? methodSelected.value : foundLevel.data;
        // Jika method yang sedang dipilih tidak ada di level baru, reset method
        if (!methodSelected.value.find(m => m.value == method.value)) {
            method.value = null;
        }
    }
};

// START handleObjectColor (Pilih Tipe Objek di Method 5)
const handleObjectColor = (val) => {
    objectValue.value = val;
    // question.value = '';
    // if (method.value == 5) {
    //     question.value = '#000000';
    // }
};

// START Question Bank Handlers
const handleQuestionBank = () => {
    isModalShowed.value = !isModalShowed.value;
};

const insertQuestion = (params) => {
    isModalShowed.value = false;

    const findQuestion = questions.value.find(d => d.index == questionActive.value);
    const payload = {
        question: params.question.value,
        key: params.key,
        method: params.method,
        objectValue: null, // Biasanya bank soal text/audio
        index: questionActive.value
    };

    if (!findQuestion) {
        questions.value.push(payload);
    } else {
        findQuestion.question = payload.question;
        findQuestion.key = payload.key;
        findQuestion.method = payload.method;
        findQuestion.objectValue = null;
    }

    triggerToast('Berhasil mengambil soal!', 'success');
    handleAttemptQuestion(questionActive.value);
};

const setObjectValue = (params) => {
    if (params.startsWith('image/')) {
        objectValue.value = 2
    } else {
        objectValue.value = 1
    }
}

const handleSetQuestionWithChecking = (params) => {
    if (typeof (params.question) == 'object')
        return params.question.value;
    else
        return params.question;
}

// START handleAttemptQuestion (Load Data ke Form Input)
const handleAttemptQuestion = (num) => {
    // 1. Cari data di array questions
    const findQuestion = questions.value.find(d => d.index == num);

    if (findQuestion) {
        questionActiveData.value = findQuestion
        question.value = handleSetQuestionWithChecking(findQuestion)

        console.log(typeof (findQuestion.question), findQuestion.question);

        key.value = findQuestion.key;
        method.value = findQuestion.method;
        if (question.value)
            setObjectValue(question.value)
    } else {
        questionActiveData.value = null
        // 3. Jika tidak ada (soal baru yg belum disave), kosongkan
        question.value = '';
        key.value = '';
        method.value = null;
        objectValue.value = null;
    }

    console.log(objectValue.value);

};

// START Confirmation & Submit
const showConfirmation = () => {
    // Validasi minimal 1 soal
    if (questions.value.length === 0) {
        triggerToast('Buat minimal 1 soal dan simpan sebelum menyelesaikan.', 'error');
        return;
    }
    isConfirmOpen.value = true;
};

const handleConfirmAction = () => {
    submit();
    isConfirmOpen.value = false;
};

const handleCancelAction = () => {
    isConfirmOpen.value = false;
};

// Utility: File to Base64
const fileToBase64 = (params) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(params);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// MAIN SUBMIT FUNCTION
const submit = async () => {
    errors.value = {};
    isLoading.value = true

    // Proses konversi File -> Base64 (hanya jika user upload file baru)
    // Jika user membiarkan gambar lama (string path), biarkan apa adanya
    const formattedQuestions = await Promise.all(questions.value.map(async (item) => {
        // Cek Method 5 (Tebak Cepat) & Object 2 (Gambar)
        if (item.method == 5 && item.objectValue == 2) {
            if (item.question instanceof File) {
                // Konversi file baru
                const base64File = await fileToBase64(item.question);
                return { ...item, question: base64File };
            }
        }
        // Kembalikan item original (termasuk yg questionnya string path)
        return item;
    }));

    // Kirim ke API
    await api.put(`/exercise/${id}/quiz/${quizId}`, {
        exerciseId: route.params.id,
        quizId: route.params.quizId,
        name: name.value,
        description: description.value,
        level: level.value,
        questions: formattedQuestions
    }).then(res => {
        triggerToast('Quiz berhasil diperbarui', 'success');
        router.push({ name: 'exercise.quiz.list', params: { id: route.params.id } });
    }).catch(e => {
        if (e.response && e.response.status === 422) {
            errors.value = e.response.data.errors;
            triggerToast('Periksa kembali inputan Anda', 'error');
        } else {
            triggerToast('Gagal menyimpan quiz', 'error');
        }
    }).finally(() => {
        isLoading.value = true
    })
};

// --- ON MOUNTED (FETCH DATA) ---
onMounted(async () => {
    // Fetch Quiz Data
    const res = await api.get(`/exercise/${id}/quiz/${quizId}`);
    const data = res.data.data;

    // 1. Populate Step 1 (Info Dasar)
    name.value = data.name;
    level.value = data.level;
    description.value = data.description;

    // Update dropdown method sesuai level yang didapat
    handleLevel();

    // 2. Populate Step 2 (Pertanyaan)
    if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {

        // Map API data to Frontend structure
        questions.value = data.questions.map((item, i) => {
            return {
                question: item.question, // String path atau text
                key: item.key,
                method: item.method,
                // Handle snake_case dari API atau camelCase
                objectValue: item.object_value ?? item.objectValue ?? null,
                index: i + 1 // Buat index UI (1, 2, 3...)
            };
        });

        // Update jumlah soal
        numberOfQuestion.value = questions.value.length;

        // Set flag bahwa data Step 1 sudah "Saved" agar pindah ke view Editor
        isDataSaved.value = true;

        // Tampilkan soal nomor 1
        questionActive.value = 1;
        handleAttemptQuestion(1);
    }
    console.log(questions.value)
});

</script>

<template>
    <div class="container">

        <ConfirmComponent v-if="isConfirmOpen" title="Simpan perubahan?"
            message="Apakah Anda yakin untuk menyimpan perubahan soal latihan?" confirmText="Simpan" cancelText="Batal"
            @confirm="handleConfirmAction" @cancel="handleCancelAction" :isBtnLoading="isSaveBtnLoading" />

        <QuestionBankModal v-if="isModalShowed" :questions="questionBank" :method="method"
            :methodLabel="methodLabel.label" :level="level" :questionType="objectValue" :insertQuestion="insertQuestion"
            :handleQuestionBank="handleQuestionBank" />

        <div class="page-header exercise">
            <router-link :to="{ name: 'exercise.quiz.list', params: { id: route.params.id } }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Edit Quiz</h1>
        </div>

        <div class="page-body">

            <div class="form" v-if="!isDataSaved">
                <div class="input-wrapper level-wrapper" :class="{ 'invalid': errors?.level }">
                    <label for="level">Level Latihan <span class="req">*</span></label>
                    <div class="level-container">
                        <div :class="['item', level == 1 ? 'active' : '']" @click="level = 1; handleLevel()">1</div>
                        <div :class="['item', level == 2 ? 'active' : '']" @click="level = 2; handleLevel()">2</div>
                        <div :class="['item', level == 3 ? 'active' : '']" @click="level = 3; handleLevel()">3</div>
                    </div>
                    <div class="invalid-msg">{{ errors?.level }}</div>
                </div>

                <input-component label="Judul Latihan" :required="true" type="text" placeholder="Judul latihan"
                    id="name" class="input" v-model="name" :isInvalid="!!errors?.name" :invalidMsg="errors?.name" />

                <div class="input-wrapper">
                    <label for="editor">Deskripsi</label>
                    <WysiwygEditorComponent v-model="description" class="textarea" />
                </div>

                <ButtonComponent label="Selanjutnya" size="full" class="secondary" @click="saveData" />
            </div>

            <div class="workspace" v-if="isDataSaved">

                <div class="form">
                    <div
                        style="margin-bottom: 20px; padding: 10px; background: #f4f4f4; border-radius: 8px; font-size: 0.9rem;">
                        <strong>Edit:</strong> {{ name }} (Level {{ level }})
                        <span style="float: right; cursor: pointer; color: blue;" @click="isDataSaved = false">Ubah
                            Info</span>
                    </div>

                    <div class="input-flex">
                        <div class="input-wrapper">
                            <label for="type" :class="{ 'invalid': errors?.method }">Tipe Soal <span
                                    class="req">*</span></label>
                            <CheckboxesComponent :data="methodSelected" :function="handleMethod"
                                :isInvalid="!!errors?.method" :invalidMsg="errors?.method" :selectedValue="method" />

                            <div v-if="method == 5" style="margin-top: 15px;">
                                <label for="obj" :class="{ 'invalid': errors?.method }">Pilih Tipe Objek <span
                                        class="req">*</span></label>
                                <CheckboxesComponent :data="typeOfObject" :function="handleObjectColor"
                                    :isInvalid="false" :invalidMsg="''" :selectedValue="objectValue" />
                            </div>
                        </div>
                    </div>

                    <div class="input-wrapper" v-if="[1, 2, 3, 4].includes(method)"
                        :class="{ 'invalid': errors?.question }">
                        <label for="textarea">Pertanyaan</label>
                        <textarea v-model="question" id="textarea" placeholder="Masukkan pertanyaan"
                            :class="['textarea', { 'invalid': errors?.question }]"></textarea>
                        <div class="invalid-msg">{{ errors?.question }}</div>
                    </div>

                    <input-component v-if="method == 5 && objectValue == 1" label="Pilih Warna" :required="true"
                        type="color" placeholder="Pilih Warna" id="color" class="input" v-model="question"
                        :isInvalid="!!errors?.question" :invalidMsg="errors?.question" />

                    <div class="input-wrapper" v-if="method == 5 && objectValue == 2">

                        <div class="question-from-bank"
                            v-if="(typeof question == 'string' && question != '' && question.startsWith('image/'))">
                            <p>Gambar saat ini:</p>
                            <img :src="`${baseUrl}/api/v1/${question}`" alt="Gambar Soal"
                                style="max-width: 200px; border-radius: 8px;">
                            <p style="font-size: 0.8rem; margin-top: 5px;">Upload gambar baru di bawah untuk
                                menggantinya.</p>
                        </div>

                        <label for="file">Upload gambar objek</label>
                        <FileUploadComponent v-model="question" :id="'file'" :infoText="'Upload gambar objek'"
                            accept="image/*" />
                        <div v-if="errors?.question" class="invalid-msg" style="display:block">{{ errors.question }}
                        </div>
                    </div>

                    <input-component label="Kunci Jawaban" :required="true" type="text" placeholder="Kunci Jawaban"
                        id="key" class="input" v-model="key" :isInvalid="!!errors?.key" :invalidMsg="errors?.key" />

                    <ButtonComponent :isDisabled="isSaveBtnLoading" :label="isSaveBtnLoading ? 'Loading...' : 'Simpan'"
                        size="full" class="secondary" @click="pushQuestion" />
                </div>

                <div class="navigation-container">
                    <div class="navigation">
                        <div class="navigation-header">
                            <h3 class="name">Navigasi Soal</h3>
                        </div>
                        <div class="navigation-body">
                            <ul class="numbers">
                                <li :class="['number', { active: questionActive == i }]" v-for="i in numberOfQuestion"
                                    :key="i" @click="openQuestion(i)">{{ i }}</li>
                            </ul>
                            <button class="add-number" @click="addQuestion" title="Tambah Soal Baru">+</button>
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
                        <ButtonComponent label="Ambil dari Bank Soal" class="secondary" size="full" display="border"
                            @click="isModalShowed = true" />
                        <br>
                        <ButtonComponent :isDisabled="isLoading" :label="isLoading ? 'Loading...' : 'Selesaikan penyimpanan soal'" class="secondary" size="full"
                            @click="showConfirmation" />
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
    min-height: 150px;
    border: 1px solid var(--Neutral-400);
    outline: none;
    border: 1px solid var(--Neutral-700);
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
    grid-template-columns: 1fr auto;
    gap: 20px;

    &.level-wrapper {
        justify-self: end;
    }
}

/* --- Wrapper Input & Level --- */
.input-wrapper {
    margin-bottom: 30px;

    label {
        color: var(--Neutral-700);
        display: block;
        font-weight: 500;
        margin-bottom: 10px;
        font-size: medium;

        &.invalid {
            color: var(--Danger-900);
        }
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
                transition: background-color 0.2s, color 0.2s;
                cursor: pointer;

                &:not(.active) {
                    opacity: .5;
                }

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
        color: var(--Danger-900);
        font-size: small;
        margin-top: 5px;
    }

    &.invalid .invalid-msg {
        display: block;
    }

    .question-from-bank {
        color: var(--Danger-900);
        margin-bottom: 15px;
    }
}

/* --- Workspace --- */
.workspace {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 50px;
}

/* --- Navigasi Soal --- */
.navigation {
    background-color: var(--White);
    padding: 30px;
    border-radius: 10px;
    margin-bottom: 30px;
    position: sticky;
    top: 20px;
    border: 1px solid var(--Neutral-200);

    .navigation-header {
        margin-bottom: 10px;

        h3 {
            color: var(--Secondary-900);
            font-size: larger;
        }
    }

    .navigation-body {
        margin-bottom: 20px;

        .numbers {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
            gap: 8px;
            margin-bottom: 10px;
            padding: 0;

            .number {
                list-style: none;
                color: var(--Secondary-900);
                border: 2px solid var(--Secondary-900);
                border-radius: 5px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s;

                &.active {
                    background-color: var(--Info-200);
                    color: var(--White);
                    border-color: var(--Info-200);
                }

                &:hover:not(.active) {
                    background-color: var(--Neutral-100);
                }
            }
        }

        .add-number {
            color: var(--Secondary-900);
            border: 2px dashed var(--Secondary-900);
            border-radius: 5px;
            width: 40px;
            height: 40px;
            font-size: 24px;
            cursor: pointer;
            background-color: unset;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;

            &:hover {
                background-color: var(--Neutral-100);
            }
        }
    }

    .navigation-footer {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }
}

/* --- RESPONSIVE --- */
@media (max-width: 1024px) {
    .workspace {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .navigation-container {
        order: -1;
    }

    .navigation {
        position: relative;
        top: 0;
    }
}

@media (max-width: 576px) {
    .input-wrapper.level-wrapper .level-container .item {
        padding: 8px 15px;
        font-size: 16px;
    }

    .question-from-bank img {
        width: 100%;
    }
}
</style>