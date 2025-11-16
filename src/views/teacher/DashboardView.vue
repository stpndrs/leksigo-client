<script setup>
import { authStore } from '@/stores/AuthStore';
import { onMounted, ref } from 'vue';

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
                <div class="card score">
                    <div class="card-header">
                        <h4>Perolehan Skor</h4>
                    </div>
                    <div class="card-body">
                        <div>
                            <h1>80</h1>
                            <p>Skor Tertinggi</p>
                        </div>
                        <div>
                            <h1>65</h1>
                            <p>Skor Terendah</p>
                        </div>
                    </div>
                </div>
                <div class="card child">
                    <div class="card-header">
                        <h4>Perolehan Skor Anak Didik</h4>
                    </div>
                    <div class="card-body">
                        <div class="item">
                            <span class="identity">
                                <span class="level level-2">2</span>
                                <span class="name">Budi Pratama</span>
                            </span>
                            <span class="score">67</span>
                        </div>
                    </div>
                </div>
                <div class="card total">
                    <div class="card-header">
                        <h4>Jumlah Anak Didik</h4>
                    </div>
                    <div class="card-body">
                        <div class="item">
                            <span class="level level-1">Level 1</span>
                            <h3>2</h3>
                            <p>Anak</p>
                        </div>
                        <div class="item">
                            <span class="level level-2">Level 2</span>
                            <h3>2</h3>
                            <p>Anak</p>
                        </div>
                        <div class="item">
                            <span class="level level-3">Level 3</span>
                            <h3>2</h3>
                            <p>Anak</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.grid-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 8px;

    .card {
        padding: 30px;
        background-color: var(--White);
        border-radius: 15px;
    }

    .card-header {
        font-size: 20px;
        color: var(--Secondary-900);
        margin-bottom: 15px;
    }

    .card.score {
        .card-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            text-align: center;
            color: var(--Secondary-900);

            h1 {
                font-size: 80px;
            }
        }
    }

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

    .card.child {
        grid-row: span 2 / span 2;

        .card-body {
            .item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;

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
            }
        }
    }

    .card.total {
        grid-row-start: 2;

        .card-body {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .item {
                color: var(--Secondary-900);
                text-align: center;
                display: flex;
                flex-direction: column;
                gap: 10px;

                h3 {
                    font-size: 45px;
                    font-weight: bold;
                }
            }
        }
    }

    /* Target Tablet (Medium) */
    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
    }

    /* Target Ponsel (Kecil) */
    @media (max-width: 768px) {
        .card {
            padding: 20px;
        }
    }
}
</style>