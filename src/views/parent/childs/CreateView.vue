<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import InputComponent from '@/components/fields/InputComponent.vue';
import RadioComponent from '@/components/fields/RadioComponent.vue';
import child from '@/assets/images/child.png'
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import api from '@/utils/api';
import InformationModal from '@/components/modal/InformationModal.vue';
import InfoIcon from '@/components/shape/InfoIcon.vue';

const router = useRouter()

const isShowModal = ref(false)
const fullName = ref('')
const isScreening = ref(null)
const level = ref()

function changeScreening() {
    if (!isScreening.value)
        level.value = ''
}

function selectLevel(params) {
    level.value = params
}

const errors = ref([])
async function submit() {
    errors.value = null
    await api.post(`/childs`, {
        fullName: fullName.value,
        isScreening: isScreening.value,
        level: level.value
    }).then((res) => {
        router.push({ name: 'childs.index' })
    }).catch((e) => {
        if (e.status === 422) errors.value = e.response.data.errors
    })
}

const handleModal = () => {
    isShowModal.value = !isShowModal.value
}
</script>

<template>
    <div class="container">
        <InformationModal v-if="isShowModal" :handleModal="handleModal" />
        <div class="page-header">
            <h1 class="page-title">Tambah Data Anak</h1>
            <button-component label="Kembali" size="small" display="border"
                @click="router.push({ name: 'childs.index' })" />
        </div>
        <div class="page-body">
            <div class="card">
                <div class="card-body">
                    <img :src="child" alt="Child">
                    <div class="form">
                        <input-component label="Nama Anak" type="text" placeholder="Contoh: Budi Pratama" id="fullName"
                            class="input" v-model="fullName" :isInvalid="errors?.fullName ?? false"
                            :invalidMsg="errors?.fullName ?? ''" />
                        <radio-component label="Sudah pernah screening disleksia?" :labels="['Sudah', 'Belum']"
                            :values="[1, 0]" name="screening" v-model="isScreening" @change="changeScreening"
                            class="input" :isInvalid="errors?.isScreening ?? false"
                            :invalidMsg="errors?.isScreening ?? ''" />
                        <div class="input-wrapper" v-if="isScreening" :class="{ 'invalid': errors?.level ?? false }">
                            <label for="level">
                                Level disleksia 
                                <InfoIcon @click="handleModal" class="info" />
                            </label>
                            <div class="level-container">
                                <div :class="['item', level == 1 ? 'active' : '']" @click="selectLevel(1)">1</div>
                                <div :class="['item', level == 2 ? 'active' : '']" @click="selectLevel(2)">2</div>
                                <div :class="['item', level == 3 ? 'active' : '']" @click="selectLevel(3)">3</div>
                            </div>
                            <div class="invalid-msg">{{ errors.level }}</div>
                        </div>
                        <button-component label="Simpan" size="full" @click="submit" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card {
    background-color: var(--White);
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 5.192px 31.153px 0 rgba(0, 0, 0, 0.25);

    .card-body {
        display: grid;
        grid-template-columns: 30% 70%;
        gap: 20px;

        img {
            width: 100%;
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

            .level-container {
                display: grid;
                grid-template-columns: 10% 10% 10%;
                gap: 20px;

                .item {
                    padding: 25px 20px;
                    border-radius: 10px;
                    font-size: 30px;
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

            .invalid-msg {
                display: none;
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

        .input {
            margin-bottom: 30px;
        }

        .info {
            cursor: pointer;
        }
    }
}
</style>