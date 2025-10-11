<script setup>
import InputComponent from '@/components/fields/InputComponent.vue';
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import ElipseComponent from '@/components/shape/ElipseComponent.vue';
import teacher_parent from '@/assets/images/teacher_parent.png'
import child from '@/assets/images/child.png'
import { ref } from 'vue';
import axios from 'axios';
import { authStore } from '@/stores/AuthStore';
import FailComponent from '@/components/alerts/FailComponent.vue';
import { useRouter } from 'vue-router';

const api = import.meta.env.VITE_APP_API_URL
const router = useRouter()
const email = ref('')
const password = ref('')
const role = ref('')

// Alerts
const showAlert = ref(false);
const alertTitle = ref('')
const alertMsg = ref('')

function toggleAlert() {
    showAlert.value = !showAlert.value;
}



// Submit
const errors = ref([])
const isMultipleRole = ref(false)
async function submit() {
    errors.value = null
    await axios.post(`${api}/api/v1/auth/login`, {
        email: email.value,
        password: password.value,
    })
        .then((res) => {
            if (res.data.isMultipleRole) {
                isMultipleRole.value = true
            } else {
                authStore.setToken(res.data.token)

                router.push({ name: 'dashboard' })
            }
        }).catch((e) => {
            if (e.status === 422) errors.value = e.response.data.errors
            if (e.status === 400 || e.status === 401) {
                showAlert.value = true;
                alertTitle.value = 'Gagal melakukan login';
                alertMsg.value = e.response.data.message;
                email.value = '';
                password.value = ''
            }
        })
}
</script>

<template>
    <section>
        <FailComponent v-show="showAlert" @close="toggleAlert" :title="alertTitle" :message="alertMsg" />
        <div class="section-header">
            <h1 class="section-title">Selamat Datang !</h1>
        </div>
        <div class="section-body login-container" v-if="!isMultipleRole">
            <div class="decorative-background">
                <elipse-component size="328" color="#8ED7FF" class="elipse-one" />
                <elipse-component size="2060" color="#FF70A9" class="elipse-two" />
            </div>
            <div class="card">
                <div class="card-body">
                    <div class="item forms">
                        <form @submit.prevent="submit">
                            <img :src="teacher_parent" alt="Login">
                            <input-component type="email" label="Email" placeholder="Contoh: example@mail.com"
                                id="email" v-model="email" :isInvalid="errors?.email ?? false"
                                :invalidMsg="errors?.email ?? ''" />
                            <input-component type="password" label="Password" placeholder="● ● ● ● ● ●" id="password"
                                v-model="password" :isInvalid="errors?.password ?? false"
                                :invalidMsg="errors?.password ?? ''" />
                            <button-component label="Masuk" type="submit" display="fill" size="full" @click="submit" />
                            <button-component label="Buat Akun" type="button" display="border" size="full"
                                @click="router.push({ name: 'register' })" />
                        </form>
                    </div>
                    <div class="item">
                        <img :src="child" alt="child" class="child">
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

.login-container {
    .decorative-background {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0; // Pastikan berada di belakang
        overflow: hidden; // <-- PINDAHKAN overflow ke sini
    }

    .elipse-one {
        position: absolute;
        top: 15rem;
        left: 20rem;
        // z-index: -1;
    }

    .elipse-two {
        position: absolute;
        bottom: -100rem;
        right: -80rem;
        // z-index: -1;

    }

    .card {
        z-index: 1;
        position: relative;
    }

    .card-body {
        display: grid;
        grid-template-columns: 30% 40%;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        padding: 2rem;

        img.child {
            width: 100%;
        }

        @media screen and (max-width: 991.98px) {
            grid-template-columns: 100%;
            gap: 100px;
        }

        @media screen and (max-width: 767.98px) {
            padding: 1rem;
        }
    }

    .forms {
        background-color: var(--White);
        padding: 3rem;
        border-radius: 20px;
        box-shadow: 0 5.192px 31.153px 0 rgba(0, 0, 0, 0.25);

        img {
            width: 100%;
        }

        .input-wrapper {
            margin-bottom: 20px;

            &.invalid {
                margin-bottom: 20px;
            }
        }

        .button {
            margin-bottom: 10px;
        }

        @media screen and (max-width: 767.98px) {
            padding: 1.5rem;
        }
    }
}


.role-container {
    .card {
        background-color: var(--White);
        padding: 3rem;
        border-radius: 20px;
        box-shadow: 0 5.192px 31.153px 0 rgba(0, 0, 0, 0.25);
        margin-top: 30px;
    }

    .card-header {
        color: var(--Primary-900);
        margin-bottom: 10px;
        font-size: 30px;
        text-align: center;
        margin-bottom: 50px;
    }

    .card-body {
        display: grid;
        grid-template-columns: 50% 50%;
        align-items: center;
        justify-content: space-between;
        gap: 30px;
        // padding: 2rem;

        img.child {
            width: 100%;
        }

        @media screen and (max-width: 991.98px) {
            grid-template-columns: 100%;
            gap: 100px;
        }

        @media screen and (max-width: 767.98px) {
            padding: 1rem;
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
    }

    .card-footer {
        padding: 30px 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>