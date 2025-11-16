<script setup>
import { authStore } from '@/stores/AuthStore';
import { onMounted, ref } from 'vue';
import child from '@/assets/images/child.png'
import CopyIcon from '@/components/shape/CopyIcon.vue';

const fullName = ref()
onMounted(() => {
    fullName.value = authStore.user.fullName
})
</script>

<template>
    <div class="container">
        <div class="page-header">
            <h1 class="page-title">Selamat Datang, {{ fullName }}</h1>
        </div>
        <div class="page-body">
            <div class="grid-container">
                <div class="item">
                    <div>
                        <img :src="child" alt="Child" />
                        <div class="identity">
                            <span class="level level-1">1</span>
                            <span class="name">Budi Pratama</span>
                        </div>
                        <span class="teacher">| Nama Guru</span>
                        <span class="code">
                            <CopyIcon /> <span>#<strong>code</strong></span>
                        </span>
                    </div>
                    <div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div>
                        <img :src="child" alt="Child" />
                        <div class="identity">
                            <span class="level level-1">1</span>
                            <span class="name">Budi Pratama</span>
                        </div>
                        <span class="teacher">| Nama Guru</span>
                        <span class="code">
                            <CopyIcon /> <span>#<strong>code</strong></span>
                        </span>
                    </div>
                    <div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div>
                        <img :src="child" alt="Child" />
                        <div class="identity">
                            <span class="level level-1">1</span>
                            <span class="name">Budi Pratama</span>
                        </div>
                        <span class="teacher">| Nama Guru</span>
                        <span class="code">
                            <CopyIcon /> <span>#<strong>code</strong></span>
                        </span>
                    </div>
                    <div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div>
                        <img :src="child" alt="Child" />
                        <div class="identity">
                            <span class="level level-1">1</span>
                            <span class="name">Budi Pratama</span>
                        </div>
                        <span class="teacher">| Nama Guru</span>
                        <span class="code">
                            <CopyIcon /> <span>#<strong>code</strong></span>
                        </span>
                    </div>
                    <div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                        <div class="exercise">
                            <h3>Latihan 1, baru permulaan hehe</h3>
                            <p>Total Skor : 90</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.level {
    padding: 10px 15px;
    border-radius: 5px;

    &.level-1 {
        background-color: var(--Secondary-500);
        color: var(--White);
    }

    &.level-2 {
        background-color: var(--Ternary-300);
        color: var(--White);
    }

    &.level-3 {
        color: var(--White);
        background-color: var(--Primary-500);
    }
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;

    .item {
        display: grid;
        gap: 15px;
        grid-template-columns: repeat(2, 1fr);
        background-color: var(--White);
        padding: 20px;
        border-radius: 10px;


        div:nth-child(1) {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: start;
            gap: 10px;

            img {
                width: 100%;
                display: block;
            }

            .identity {
                display: flex;
                justify-content: start;
                align-items: center;
                gap: 15px;
            }

            .name,
            .score {
                color: var(--Secondary-900);
                font-size: 25px;
                font-weight: bold;
            }

            .teacher,
            .code {
                font-size: 20px;
                color: var(--Secondary-900);
            }

            .code {
                display: flex;
                justify-content: start;
                align-items: center;
                gap: 10px;
            }
        }

        div:nth-child(2) {
            .exercise {
                background-color: var(--Secondary-500);
                color: var(--White);
                padding: 15px;
                border-radius: 10px;
                border: 3px solid var(--Secondary-900);
                margin-bottom: 10px;

                h3 {
                    font-weight: bold;
                }
            }
        }
    }
}
</style>