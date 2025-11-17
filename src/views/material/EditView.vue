<script setup>
import ChevronLeftIcon from '@/components/shape/ChevronLeft.Icon.vue';
import InputComponent from '@/components/fields/InputComponent.vue';
import WysiwygEditorComponent from '@/components/fields/WysiwygEditorComponent.vue';

import api from '@/utils/api';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FileUploadComponent from '@/components/fields/FileUploadComponent.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import CheckboxesComponent from '@/components/fields/CheckboxesComponent.vue';

const baseUrl = import.meta.env.VITE_APP_API_URL
const route = useRoute()
const router = useRouter()
const id = route.params.id
const materialId = route.params.materialId

const title = ref('')
const link = ref('')
const files = ref([])
const oldImages = ref([])
const description = ref('')
const methodOfArray = ref([
    {
        level: 1,
        data: [
            {
                label: 'Mendengar Audio',
                value: 1
            },
            {
                label: 'Menulis Ulang',
                value: 2
            },
            {
                label: 'Membaca',
                value: 3
            },
        ]
    },
    {
        level: 2,
        data: [
            {
                label: 'Mendengar Audio',
                value: 1
            },
            {
                label: 'Menulis Ulang',
                value: 2
            },
            {
                label: 'Membaca',
                value: 3
            },
        ]
    },
    {
        level: 3,
        data: [
            {
                label: 'Mendengar Audio',
                value: 1
            },
            {
                label: 'Menulis Ulang',
                value: 2
            },
            {
                label: 'Membaca',
                value: 3
            },
            {
                label: 'Mengurut Kata',
                value: 4
            },
            {
                label: 'Menebak Cepat',
                value: 5
            },
        ]
    },
])
const methodSelected = ref([])
const method = ref(null)
const level = ref(null)

const errors = ref([])

const handleMethod = (val) => {
    method.value = val
}

const handleLevel = (val) => {
    level.value = val

    // reset the selected method
    method.value = null
    methodSelected.value = null
    methodSelected.value = methodOfArray.value.filter(d => d.level == val ? d : null)[0].data

}

onMounted(async () => {
    await api.get(`materials/${route.params.materialId}`)
        .then(res => {
            console.log(res);
            const data = res.data.data
            title.value = data.title
            description.value = data.description
            link.value = data.link
            level.value = data.level
            method.value = data.method
            methodSelected.value = methodOfArray.value.filter(d => d.level == data.level)[0].data
            files.value = data.images
            oldImages.value = data.images
        }).catch(e => {
            console.log(e);
        })
})

const submit = async () => {
    errors.value = null

    const formData = new FormData()
    formData.append('childrenId', route.params.id)
    formData.append('title', title.value)
    if (description.value) formData.append('description', description.value)
    if (level.value) formData.append('level', level.value)
    if (method.value) formData.append('method', method.value)
    if (link.value) formData.append('link', link.value)

    if (files.value && files.value.length > 0) {
        for (let i = 0; i < files.value.length; i++) {
            formData.append('images', files.value[i])
        }
    }

    await api.put(`/materials/${materialId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
        router.push({ name: 'childs.detail', params: { id: route.params.id } })
    }).catch(e => {
        if (e.response && e.response.status === 422) {
            errors.value = e.response.data.errors
        } else {
            console.error(e)
        }
    })
}
</script>

<template>
    <div class="container">
        <div class="page-header">
            <router-link :to="{ name: 'material.overview', params: { id, materialId } }">
                <ChevronLeftIcon />
            </router-link>
            <h1 class="page-title">Buat Materi Baru</h1>
        </div>
        <div class="page-body">
            <div class="form">
                <div class="input-flex">
                    <div class="input-wrapper">
                        <label for="type" :class="{ 'invalid': errors?.method ?? false }">Tipe Materi <span
                                class="req">*</span></label>
                        <CheckboxesComponent :data="methodSelected" :function="handleMethod" :selectedValue="method"
                            :isInvalid="errors?.method ?? false" :invalidMsg="errors?.method ?? ''" />
                    </div>
                    <div class="input-wrapper level-wrapper" :class="{ 'invalid': errors?.level ?? false }">
                        <label for="level">Level Materi <span class="req">*</span></label>
                        <div class="level-container">
                            <div :class="['item', level == 1 ? 'active' : '']" @click="handleLevel(1)">1</div>
                            <div :class="['item', level == 2 ? 'active' : '']" @click="handleLevel(2)">2</div>
                            <div :class="['item', level == 3 ? 'active' : '']" @click="handleLevel(3)">3</div>
                        </div>
                        <div class="invalid-msg">{{ errors?.level }}</div>
                    </div>
                </div>
                <input-component label="Judul Materi" :required="true" type="text" placeholder="Judul materi" id="title"
                    class="input" v-model="title" :isInvalid="errors?.title ?? false"
                    :invalidMsg="errors?.title ?? ''" />
                <input-component label="Tautan Materi Video" type="text" placeholder="Tautan materi video" id="link"
                    class="input" v-model="link" :isInvalid="errors?.link ?? false" :invalidMsg="errors?.link ?? ''" />
                <div class="input-wrapper">
                    <label for="editor">Materi Tulis</label>
                    <WysiwygEditorComponent v-model="description" class="textarea" />
                </div>
                <div class="input-wrapper">
                    <!-- Preview Image -->
                    <div v-if="files.length > 0">
                        <label for="oldImg">Gambar Lama :</label>
                        <div class="old-images-container" id="oldImg">
                            <img :src="`${baseUrl}/api/v1/${item}`" alt="Material Image" v-for="(item, index) in oldImages"
                                :key="index">
                        </div>
                    </div>
                    <label for="file">Gambar Media Pembelajaran (Masukkan file baru jika ingin mengganti)</label>
                    <file-upload-component v-model="files" :id="'files'" :infoText="'Upload materi pembelajaran'"
                        class="input" :isMultiple="true" />
                </div>
                <ButtonComponent label="Simpan" size="full" @click="submit" />
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
    grid-template-columns: 1fr auto; // <-- Diubah dari 70% auto
    gap: 30px; // <-- Tambahkan gap
}

.input-wrapper {
    margin-bottom: 30px;

    .old-images-container {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;
        margin-bottom: 30px;

        img {
            width: 100%;
            border-radius: 10px;
        }
    }

    label {
        color: var(--Neutral-700);
        display: block;
        font-weight: 500;
        margin-bottom: 10px;
        font-size: medium;
    }

    &.level-wrapper {
        justify-self: end;

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

    // --- Perbaikan Nesting SCSS ---
    .invalid-msg {
        display: none;
    }

    label.invalid {
        // Style ini mungkin tidak terpakai jika invalid di wrapper
        color: var(--Danger-900, #CC1D1D);
    }

    &.invalid {

        // <-- &.invalid seharusnya di dalam .input-wrapper
        label {
            color: var(--Danger-900, #CC1D1D);
        }

        .item {
            // Untuk .level-wrapper
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

/* --- RESPONSIVE --- */

/* Target Tablet (dan di bawahnya) */
@media (max-width: 1024px) {
    .input-flex {
        grid-template-columns: 1fr; // <-- Pecah jadi 1 kolom
    }

    .input-wrapper {
        &.level-wrapper {
            justify-self: start; // <-- Ratakan kiri di mobile
            order: -1; // <-- Pindahkan Level ke atas Tipe Materi

            .level-container {
                // Atur agar box tidak terlalu lebar di mobile
                grid-template-columns: repeat(3, minmax(80px, 120px));
            }
        }
    }
}

/* Target Ponsel Kecil */
@media (max-width: 576px) {
    .input {
        margin-bottom: 20px;
    }

    .textarea {
        margin-bottom: 30px;
    }

    .input-wrapper {
        margin-bottom: 20px;

        &.level-wrapper .level-container {
            gap: 10px;

            .item {
                padding: 8px 15px; // Kecilkan padding box
                font-size: 16px; // Kecilkan font
            }
        }
    }
}
</style>