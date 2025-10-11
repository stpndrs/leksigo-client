<script setup>
import InputComponent from '@/components/fields/InputComponent.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import teacher from '@/assets/images/teacher.png'
import parent from '@/assets/images/parent.png'
import { ref } from 'vue';
import axios from 'axios';
import { authStore } from '@/stores/AuthStore';
import FailComponent from '@/components/alerts/FailComponent.vue';
import { useRouter } from 'vue-router';

const api = import.meta.env.VITE_APP_API_URL
const router = useRouter()
const fullName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const role = ref(null)

// Alerts
const showAlert = ref(false);

function toggleAlert() {
    showAlert.value = !showAlert.value;
}


// Select Role
function selectRole(params) {
    role.value = params
}


// Submit
const errors = ref([])
async function submit() {
    errors.value = null
    await axios.post(`${api}/api/v1/auth/register`, {
        fullName: fullName.value,
        email: email.value,
        phone: phone.value,
        password: password.value,
        role: role.value
    })
        .then((res) => {
            authStore.setToken(res.data.token)

            router.push({ name: 'dashboard' })
        }).catch((e) => {
            if (e.status === 422) errors.value = e.response.data.errors
        })
}
</script>

<template>
    <section>
        <FailComponent v-show="showAlert" @close="toggleAlert" />
        <div class="section-header">
            <h1 class="section-title">Pendaftaran Akun</h1>
        </div>
        <div class="section-body">
            <div class="card">
                <div class="card-body">
                    <div class="item">
                        <h4 class="role">Saya Adalah :</h4>
                        <p class="invalid-msg" v-if="errors?.role">{{ errors?.role }} :</p>
                        <div class="teacher" :class="[{ 'active': role === 1 }, { 'invalid': errors?.role ?? false }]"
                            @click="selectRole(1)">
                            <img :src="teacher" alt="As a Teacher">
                            <h4>Guru</h4>
                        </div>
                        <div class="parent" :class="[{ 'active': role === 2 }, { 'invalid': errors?.role ?? false }]"
                            @click="selectRole(2)">
                            <img :src="parent" alt="As a Parent">
                            <h4>Orang Tua</h4>
                        </div>
                    </div>
                    <div class="item forms">
                        <form @submit.prevent="submit">
                            <input-component type="text" label="Nama Lengkap" placeholder="Contoh: Sri Mulyani"
                                id="fullName" v-model="fullName" :isInvalid="errors?.fullName ?? false"
                                :invalidMsg="errors?.fullName ?? ''" />
                            <input-component type="email" label="Email" placeholder="Contoh: example@mail.com"
                                id="email" v-model="email" :isInvalid="errors?.email ?? false"
                                :invalidMsg="errors?.email ?? ''" />
                            <input-component type="number" label="No Telepon" placeholder="Contoh: 0812345678"
                                id="phone" v-model="phone" :isInvalid="errors?.phone ?? false"
                                :invalidMsg="errors?.phone ?? ''" />
                            <input-component type="password" label="Password" placeholder="● ● ● ● ● ●" id="password"
                                v-model="password" :isInvalid="errors?.password ?? false"
                                :invalidMsg="errors?.password ?? ''" />
                            <button-component label="Buat Akun" type="submit" display="fill" size="full"
                                @click="submit" />
                            <button-component label="Masuk" type="button" display="border" size="full"
                                @click="router.push({ name: 'login' })" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>


<style lang="scss" scoped>
section {
    background-color: var(--Soft-white);
    position: relative;
}

.card {
    background-color: var(--White);
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 5.192px 31.153px 0 rgba(0, 0, 0, 0.25);

    @media screen and (max-width: 767.98px) {
        padding: 1.5rem;
    }

    margin-top: 30px;
}

.card-body {
    display: grid;
    grid-template-columns: 30% auto;
    align-items: center;
    gap: 30px;
    // background: black;
    padding: 2rem;

    @media screen and (max-width: 991.98px) {
        grid-template-columns: 100%;
        gap: 100px;
    }

    @media screen and (max-width: 767.98px) {
        padding: 1rem;
    }


    .role {
        color: var(--Primary-900);
        margin-bottom: 10px;
        font-size: 30px;
    }

    .invalid-msg {
        display: block;
        color: var(--Danger-900);
        font-size: larger;
        font-weight: bold;
        margin: 10px 0;
    }

    .teacher,
    .parent {
        text-align: center;
        font-weight: 700;
        padding: 2rem 5rem;
        border: 3px solid;
        border-radius: 10px;
        display: block;
        cursor: pointer;

        h4 {
            font-size: 35px;
        }

        img {
            width: 12rem;
            margin-bottom: 5px;
        }

        &.invalid {
            border-color: var(--Danger-900);
        }

        @media screen and (max-width: 767.98px) {
            padding: 1.5rem;
        }
    }

    .teacher {
        border-color: var(--Ternary-500);
        color: var(--Ternary-500, #8B3DFF);
        margin-bottom: 30px;

        &.active {
            background-color: var(--Ternary-500);
            color: var(--White, #FFF);
        }
    }

    .parent {
        border-color: var(--Secondary-900);
        color: var(--Secondary-900, #8B3DFF);

        &.active {
            background-color: var(--Secondary-900);
            color: var(--White, #FFF);
        }
    }


    .forms {
        .input-wrapper {
            margin-bottom: 40px;

            &.invalid {
                margin-bottom: 20px;
            }
        }

        .button {
            margin-bottom: 10px;
        }
    }

}
</style>