<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ConfirmComponent from '@/components/confirm/ConfirmComponent.vue';
import InputComponent from '@/components/fields/InputComponent.vue';
import WysiwygEditorComponent from '@/components/fields/WysiwygEditorComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute()
const router = useRouter()

const id = route.params.id
const quizId = route.params.quizId
const isConfirmOpen = ref(false); // Konfirmasi Submit

const data = ref({})
const note = ref(null)
const point = ref(null)

onMounted(async () => {
    try {
        const exerciseResponse = await api.get(`/exercise/${id}`);
        const exerciseData = exerciseResponse.data.data;
        data.value.exercise = exerciseData;

        if (exerciseData && exerciseData.childrenId) {
            const childResponse = await api.get(`/childs/${exerciseData.childrenId}`);
            data.value.child = childResponse.data.data.child;
        } else {
            console.warn("Data latihan atau childrenId tidak ditemukan.");
        }
    } catch (err) {
        console.error("Gagal mengambil data:", err);
    }
});

const submit = async () => {
    await api.post('/exercise/attitude', {
        exerciseId: id,
        quizId: quizId,
        note: note.value,
        point: point.value
    }).then(res => {
        console.log(res);
        router.push({ name: 'exercise.quiz.summary', params: { id: id, quizId: quizId } })
    }).catch(err => {
        console.log(err);
    })
}

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


</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'exercise.quiz.summary', params: { id: id, quizId: quizId } }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Penilaian Perilaku</h1>
        </div>
        <div class="page-body">
            <ConfirmComponent v-if="isConfirmOpen" title="Simpan penilaian?"
                message="Apakah Anda yakin untuk menyimpan penilaian?" confirmText="Simpan" cancelText="Batal"
                @confirm="handleConfirmAction" @cancel="handleCancelAction" />
            <div class="identity">
                <h1>{{ data?.child?.fullName }}</h1>
                <p>#{{ data?.child?.code }}</p>
            </div>
            <div class="input-wrapper">
                <label for="editor">Catatan Penilaian Perilaku <span class="req">*</span></label>
                <WysiwygEditorComponent v-model="note" class="textarea" />
            </div>
            <InputComponent type="number" label="Penilaian Perilaku" placeholder="Contoh: 80" id="point" v-model="point"
                :isInvalid="errors?.point ?? false" :invalidMsg="errors?.point ?? ''" :required="true" />
            <ButtonComponent label="Simpan" class="secondary" @click="showConfirmation" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.identity {
    color: var(--Secondary-900);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;

    p {
        font-size: 25px;
        font-weight: 600;
        font-family: 'Ubuntu Sans', sans-serif;
    }
}

.input-wrapper {
    margin-bottom: 80px;

    // Style labelnya sekalian
    label {
        display: block;
        font-weight: 500;
        font-size: medium;
    }

    .textarea {
        margin-top: 15px;
    }

    span.req {
        color: red;
    }
}

/* --- RESPONSIVE --- */

/* Target Tablet (dan di bawahnya) */
@media (max-width: 768px) {
    .identity {
        flex-direction: column; // <-- Pecah jadi vertikal
        align-items: flex-start; // <-- Ratakan kiri
        gap: 5px; // <-- Beri jarak
        margin-bottom: 25px;

        p {
            font-size: 20px; // Kecilkan font
        }
    }

    .input-wrapper {
        margin-bottom: 40px; // Kurangi margin
    }
}

/* Target Ponsel Kecil */
@media (max-width: 576px) {
    .identity {
        p {
            font-size: 18px;
        }
    }
}
</style>