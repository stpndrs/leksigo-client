<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import { useGenerateQuizStore } from '@/stores/GenerateQuizStore';
import { latestQuizStore } from '@/stores/LatestQuizStore';
import api from '@/utils/api';
import { triggerToast } from '@/utils/toast';
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const apiUrl = import.meta.env.VITE_APP_API_URL
const route = useRoute();
const router = useRouter()
const id = route.params.id;

// --- 1. STATE & DATA ---
const isLoading = ref(false);
const generateQuizStore = useGenerateQuizStore()
const generatedQuestions = ref([]);
const selectedIndices = ref([]);

const levels = ref([1, 2, 3]);

const methodMasterData = {
    1: { label: 'Mendengar Audio', color: 'blue' },
    2: { label: 'Menulis Ulang', color: 'orange' },
    3: { label: 'Membaca', color: 'green' },
    4: { label: 'Mengurut Kata', color: 'purple' },
    5: { label: 'Menebak Cepat', color: 'red' }
};

const methodOfArray = ref([
    { level: 1, data: [{ label: 'Mendengar Audio', value: 1 }, { label: 'Menulis Ulang', value: 2 }, { label: 'Membaca', value: 3 }] },
    { level: 2, data: [{ label: 'Mendengar Audio', value: 1 }, { label: 'Menulis Ulang', value: 2 }, { label: 'Membaca', value: 3 }] },
    { level: 3, data: [{ label: 'Mendengar Audio', value: 1 }, { label: 'Menulis Ulang', value: 2 }, { label: 'Membaca', value: 3 }, { label: 'Mengurut Kata', value: 4 }, { label: 'Menebak Cepat', value: 5 }] },
]);

const methodOptions = ref([]);

const form = reactive({
    quantity: '',
    level: '',
    method: '',
});

onMounted(() => {
    form.level = latestQuizStore.getLevel == null ? 1 : latestQuizStore.getLevel == 1 ? 2 : 3
    
    handleLevelChange()
})

// --- 2. LOGIC FORM ---
const handleLevelChange = () => {
    form.method = '';
    const found = methodOfArray.value.find(d => d.level == form.level);
    methodOptions.value = found ? found.data : [];
    generatedQuestions.value = [];
    selectedIndices.value = [];
};

// --- 3. LOGIC GENERATE ---
const handleGenerate = async () => {
    if (!form.quantity || !form.level) {
        triggerToast("Mohon masukkan Jumlah dan pilih Level terlebih dahulu.", 'info');
        return;
    }

    isLoading.value = true;
    generatedQuestions.value = [];
    selectedIndices.value = [];

    try {
        const response = await api.post('/exercise/generate', {
            quantity: Number(form.quantity) + 10,
            difficulty: form.level,
            method: form.method,
            exerciseId: id
        });

        const apiResponse = response.data;

        if (apiResponse.success && apiResponse.data?.questions) {
            generatedQuestions.value = apiResponse.data.questions.filter(d => d.level == form.level).slice(0, form.quantity);

            if (generatedQuestions.value.length === 0) {
                triggerToast("Tidak ada soal yang berhasil digenerate.", 'info');
            }
        } else {
            throw new Error(apiResponse.message || "Gagal mendapatkan data soal.");
        }

    } catch (error) {
        console.error("Error generating questions:", error);
        triggerToast("Terjadi kesalahan saat menghubungi server. Silakan coba lagi.", 'error');

    } finally {
        isLoading.value = false;
    }
};

// --- 4. LOGIC SELECTION ---
const isAllSelected = computed(() => {
    return generatedQuestions.value.length > 0 && selectedIndices.value.length === generatedQuestions.value.length;
});

const toggleSelectAll = () => {
    if (isAllSelected.value) {
        selectedIndices.value = [];
    } else {
        selectedIndices.value = generatedQuestions.value.map((_, index) => index);
    }
};

const handleSaveSelection = async () => {
    if (selectedIndices.value.length === 0) {
        triggerToast("Pilih setidaknya satu soal untuk disimpan.", 'info');
        return;
    }
    const selectedData = selectedIndices.value.map(index => generatedQuestions.value[index]);
    console.log("Soal yang dipilih untuk disimpan:", selectedData);

    const result = await generateQuizStore.saveGeneratedQuiz(selectedData)
    console.log(result);

    if (result.success) {
        triggerToast('Berhasil menyimpan data')
        router.push({ name: 'exercise.quiz.create', params: id })
    } else {
        triggerToast("Gagal menyimpan.", 'error');
    }
};

const getMethodBadge = (methodId) => {
    return methodMasterData[methodId] || { label: 'Unknown', color: 'gray' };
};
</script>

<template>
    <div class="page-container">
        <header class="page-header">
            <div class="header-content">
                <router-link :to="{ name: 'exercise.quiz.list', params: { id: id } }" class="back-btn">
                    <ChevronLeftIcon />
                </router-link>
                <div>
                    <h1 class="page-title">Pilih Soal AI</h1>
                    <p class="page-subtitle">Generate soal otomatis dan pilih yang sesuai.</p>
                </div>
            </div>
        </header>

        <main class="main-content">
            <section class="control-panel">
                <div class="input-grid">
                    <div class="form-group">
                        <label for="quantity">Jumlah Soal</label>
                        <div class="input-wrapper">
                            <input id="quantity" v-model="form.quantity" type="number" placeholder="Contoh: 10"
                                min="1" />
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Level</label>
                        <div class="select-wrapper">
                            <select v-model="form.level" @change="handleLevelChange" disabled>
                                <option value="" disabled>Pilih Level</option>
                                <option v-for="l in levels" :key="l" :value="l">Level {{ l }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Metode Utama</label>
                        <div class="select-wrapper">
                            <select v-model="form.method">
                                <option value="">Pilih Metode</option>
                                <option v-for="m in methodOptions" :key="m.value" :value="m.value">{{ m.label }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group btn-container">
                        <ButtonComponent @click="handleGenerate" :isDisabled="isLoading"
                            :label="isLoading ? 'Generating...' : 'Generate Soal'" size="full" class="primary" />
                    </div>
                </div>
            </section>

            <hr class="divider" />

            <section class="result-area" v-if="generatedQuestions.length > 0 || isLoading">
                <div class="result-header">
                    <h3>Hasil Generate ({{ generatedQuestions.length }})</h3>
                    <label class="select-all-checkbox" v-if="!isLoading && generatedQuestions.length > 0">
                        <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll">
                        <span class="custom-check"></span>
                        <span class="label-text">Pilih Semua</span>
                    </label>
                </div>

                <div v-if="isLoading" class="loading-state">
                    <div class="spinner"></div>
                    <p>Sedang menyusun pertanyaan...</p>
                </div>

                <div v-else class="questions-list">
                    <div v-for="(item, index) in generatedQuestions" :key="index" class="question-card"
                        :class="{ 'is-selected': selectedIndices.includes(index) }">
                        <div class="card-header-row">
                            <div class="card-checkbox">
                                <input type="checkbox" :value="index" v-model="selectedIndices" :id="`q-${index}`">
                            </div>
                            <div class="card-meta">
                                <span class="badge level">Lvl {{ item.level }}</span>
                                <span class="badge method" :class="getMethodBadge(item.method).color">
                                    {{ getMethodBadge(item.method).label }}
                                </span>
                            </div>
                        </div>

                        <label :for="`q-${index}`" class="card-content">
                            <img :src="`${apiUrl}/api/v1/image/exercise/${item.question.value}`" alt="Image"
                                v-if="item.question.value.endsWith('.png')">
                            <div :style="{ 'background-color': item.question.value }" class="object-color"
                                v-else-if="item.question.value.startsWith('#')"></div>
                            <!-- PREVIEW WARNA DAN FIXING LEVEL KETIKA GENERATE -->
                            <h4 class="question-text" v-else>{{ item.question.value }}</h4>
                            <div class="card-footer">
                                <span class="key-label">Kunci Jawaban:</span>
                                <span class="key-value">{{ item.key }}</span>
                            </div>
                        </label>
                    </div>
                </div>
            </section>

            <section v-else class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>Belum ada soal</h3>
                <p>Silakan masukkan jumlah, pilih Level & Metode, lalu klik Generate.</p>
            </section>
        </main>

        <div class="bottom-action-bar" v-if="generatedQuestions.length > 0">
            <div class="bar-content">
                <span class="selection-info">
                    <strong>{{ selectedIndices.length }}</strong> soal dipilih
                </span>
                <ButtonComponent @click="handleSaveSelection" label="Simpan ke Latihan Soal" class="primary"
                    :isDisabled="selectedIndices.length === 0" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Onest:wght@300;400;600;700&family=Ubuntu+Sans:wght@400;700&display=swap');

.page-container {
    // Variables
    --Primary-900: #FF3C8A;
    --Primary-100: #FFF0F5;
    --Secondary-900: #008BD8;
    --Secondary-100: #F0F9FF;
    --Neutral-100: #E5E7EB;
    --Neutral-200: #F3F4F6;
    --Neutral-400: #9CA3AF;
    --Neutral-700: #374151;
    --Neutral-900: #111827;
    --White: #FFFFFF;
    --Shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --Shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --Radius-md: 12px;
    --Radius-sm: 8px;

    font-family: 'Onest', sans-serif;
    background-color: #F9FAFB;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-bottom: 100px; // Space for sticky bar
}

// --- Header ---
.page-header {
    background: var(--White);
    padding: 1.25rem 2rem;
    border-bottom: 1px solid var(--Neutral-100);
    position: sticky;
    top: 0;
    z-index: 50;

    .header-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .page-title {
        font-size: 1.5rem;
        color: var(--Neutral-900);
        font-family: 'Ubuntu Sans', sans-serif;
        font-weight: 700;
        margin: 0;
        line-height: 1.2;
    }

    .page-subtitle {
        color: var(--Neutral-700);
        font-size: 0.95rem;
        margin: 0.25rem 0 0 0;
    }

    .back-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: var(--Neutral-700);
        transition: background 0.2s;

        &:hover {
            background-color: var(--Neutral-100);
        }
    }
}

.main-content {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem;

    @media (max-width: 768px) {
        padding: 1rem;
    }
}

// --- Control Panel (Form) ---
.control-panel {
    background: var(--White);
    padding: 1.5rem;
    border-radius: var(--Radius-md);
    box-shadow: var(--Shadow-sm);
    border: 1px solid var(--Neutral-100);

    .input-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 2fr auto; // Quantity, Level, Method, Button
        gap: 1.5rem;
        align-items: start;

        @media (max-width: 992px) {
            grid-template-columns: 1fr 1fr;
        }

        @media (max-width: 576px) {
            grid-template-columns: 1fr;
        }
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        label {
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--Neutral-700);
        }

        // Styling Inputs & Selects
        input,
        select {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid var(--Neutral-400); // Border lebih terlihat
            border-radius: var(--Radius-sm);
            font-size: 0.95rem;
            font-family: inherit;
            outline: none;
            background-color: var(--White);
            transition: all 0.2s ease;
            color: var(--Neutral-900);

            &:focus {
                border-color: var(--Secondary-900);
                box-shadow: 0 0 0 3px var(--Secondary-100);
            }

            &::placeholder {
                color: #9CA3AF;
            }
        }

        // Fix alignment for button
        &.btn-container {
            align-self: end;

            .full-height-btn {
                height: 48px; // Match input height generally
            }
        }
    }
}

.divider {
    border: 0;
    height: 1px;
    background: var(--Neutral-100);
    margin: 2.5rem 0;
}

// --- Result Area ---
.result-area {
    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        h3 {
            font-size: 1.25rem;
            color: var(--Neutral-900);
            font-family: 'Ubuntu Sans';
            font-weight: 700;
        }

        .select-all-checkbox {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-weight: 600;
            color: var(--Secondary-900);
            user-select: none;
            transition: opacity 0.2s;

            &:hover {
                opacity: 0.8;
            }

            input {
                cursor: pointer;
                width: 18px;
                height: 18px;
                accent-color: var(--Secondary-900);
            }
        }
    }
}

// --- Questions List & Cards ---
.questions-list {
    display: grid;
    // Responsive Grid: Min width 350px, auto fill
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
}

.question-card {
    background: var(--White);
    border: 1px solid var(--Neutral-100);
    border-radius: var(--Radius-md);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
        transform: translateY(-4px);
        box-shadow: var(--Shadow-md);
        border-color: var(--Secondary-900);
    }

    // Selected State
    &.is-selected {
        background-color: var(--Secondary-100);
        border-color: var(--Secondary-900);

        // Accent line on left
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background-color: var(--Secondary-900);
            border-top-left-radius: var(--Radius-md);
            border-bottom-left-radius: var(--Radius-md);
        }
    }

    .card-header-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
    }

    .card-checkbox input {
        width: 20px;
        height: 20px;
        cursor: pointer;
        accent-color: var(--Secondary-900);
    }

    .card-content {
        flex: 1;
        cursor: pointer;

        img {
            width: 100%;
        }
    }

    .object-color {
        width: 300px;
        height: 150px;
        display: block;
        background-color: white;
        border-radius: 10px;
        border: 1px solid var(--Neutral-300);
    }

    .card-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: flex-end;

        .badge {
            font-size: 0.7rem;
            padding: 4px 10px;
            border-radius: 50px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;

            &.level {
                background: var(--Neutral-200);
                color: var(--Neutral-700);
            }

            &.method {
                &.blue {
                    background: #DBEAFE;
                    color: #1E40AF;
                }

                &.orange {
                    background: #FFEDD5;
                    color: #9A3412;
                }

                &.green {
                    background: #DCFCE7;
                    color: #166534;
                }

                &.purple {
                    background: #F3E8FF;
                    color: #6B21A8;
                }

                &.red {
                    background: #FEE2E2;
                    color: #991B1B;
                }
            }
        }
    }

    .question-text {
        font-size: 1.15rem;
        color: var(--Neutral-900);
        margin: 0.5rem 0 1rem 0;
        line-height: 1.5;
        font-weight: 600;
    }

    .card-footer {
        padding-top: 1rem;
        border-top: 1px dashed var(--Neutral-200);
        display: flex;
        flex-direction: column;

        .key-label {
            font-size: 0.8rem;
            color: var(--Neutral-400);
            font-weight: 600;
            text-transform: uppercase;
        }

        .key-value {
            font-size: 1rem;
            color: var(--Secondary-900);
            font-weight: 600;
        }
    }
}

// --- Empty & Loading States ---
.loading-state,
.empty-state {
    background: var(--White);
    border-radius: var(--Radius-md);
    padding: 4rem 2rem;
    text-align: center;
    color: var(--Neutral-700);
    border: 1px dashed var(--Neutral-200);

    .spinner {
        width: 48px;
        height: 48px;
        border: 5px solid var(--Neutral-100);
        border-top-color: var(--Primary-900);
        border-radius: 50%;
        margin: 0 auto 1.5rem;
        animation: spin 1s linear infinite;
    }

    .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.8;
    }

    h3 {
        font-family: 'Ubuntu Sans';
        margin-bottom: 0.5rem;
        color: var(--Neutral-900);
    }
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

// --- Sticky Bottom Bar ---
.bottom-action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.9); // Semi transparent
    backdrop-filter: blur(10px); // Blur effect
    border-top: 1px solid var(--Neutral-100);
    padding: 1rem 2rem;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
    z-index: 100;

    .bar-content {
        max-width: 1000px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .selection-info {
            font-size: 1.1rem;
            color: var(--Neutral-700);

            strong {
                color: var(--Secondary-900);
                font-weight: 700;
            }
        }
    }
}
</style>