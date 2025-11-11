<script setup>
const props = defineProps(['handleModal'])
</script>

<template>
    <div class="modal-container">
        <div class="modal">
            <button class="modal-close" @click="props.handleModal()">X</button>
            <div class="modal-header">
                <h1 class="modal-title">Informasi Tingkatan Disleksia Anak</h1>
                <hr>
                <p class="modal-description">Panduan ini membantu orang tua mengenali tingkat kesulitan membaca dan
                    menulis yang mungkin dialami anak untuk menyesuaikan dukungan metode pembelajaran</p>
            </div>
            <div class="modal-body">
                <div class="info-container">
                    <div class="info-item">
                        <div class="info-header">
                            <span class="level">1</span>
                            <span class="title">Ringan</span>
                        </div>
                        <div class="info-body">
                            <p>Anak menunjukkan kesulitan ringan dalam membaca dan menulis.</p>
                            <ul>
                                <li>Sulit mengucapkan kata dengan jelas</li>
                                <li>Kesulitan dalam mengenali atau membuat rima</li>
                                <li>Lambat mengenal huruf dan bunyi alfabet</li>
                                <li>Membaca agak lambat atau kadang salah dalam membaca kata</li>
                                <li>Ejaan sering salah dan tidak konsisten</li>
                                <li>Sulit mengenali bunyi suku kata dalam kata</li>
                            </ul>
                            <p>Biasanya bisa terbantu dengan <strong>latihan rutin dan bimbingan ringan</strong>.</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-header">
                            <span class="level">2</span>
                            <span class="title">Sedang</span>
                        </div>
                        <div class="info-body">
                            <p>Kesulitan membaca dan menulis lebih jelas terlihat</p>
                            <ul>
                                <li>Membaca tidak lancar, sering berhenti atau menebak kata</li>
                                <li>Sulit mengeja atau memecah kata dengan benar</li>
                                <li>Ejaan masih sering salah mesikpun sudah diajarkan berulang</li>
                                <li>Sulit memahami isi bacaan atau cepat lupa setelah membaca</li>
                                <li>Tantangan daam menulis kalimat atau menyusun paragraf dengan baik</li>
                            </ul>
                            <p><strong>Membutuhkan dukungan belajar tambahan dan latihan terstruktur</strong>.</p>
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="info-header">
                            <span class="level">3</span>
                            <span class="title">Berat</span>
                        </div>
                        <div class="info-body">
                            <p>Anak mengalami tantangan signifikan dalam membaca dan menulis. Hingga memengaruhi
                                kegiatan belajar sehari-hari</p>
                            <ul>
                                <li>Membaca sangat lambat atau sering salah mengucapkan kata</li>
                                <li>Ejaan sangat buruk, bahkan untuk kata yang sederhana</li>
                                <li>Kesulitan memahami isi bacaan mesikpun sudah dibaca berulang kali</li>
                                <li>Kesulitan dalam menulis dan menyalin teks</li>
                                <li>Tulisan tangan tidak rapi dan sulit dibaca</li>
                                <li>Tantangan besar dalam menyusun kalimat dan menulis dengan jelas</li>
                            </ul>
                            <p><strong>Perlu pendampingan khusus dan program belajar individual</strong>.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.modal-container {
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    width: 100%;
    height: 100%;

    &::before {
        position: absolute;
        top: 0;
        left: 0;
        content: '';
        width: 100%;
        height: 100%;
        background-color: black;
        opacity: 20%;
    }

    .modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--White);
        padding: 50px;
        border-radius: 20px;
        width: 85vw;
        height: 90vh;
        z-index: 10;

        .modal-close {
            position: absolute;
            top: 30px;
            right: 30px;
            background: unset;
            border: 2px solid var(--Secondary-900);
            outline: 0;
            font-size: 15px;
            font-weight: bold;
            color: var(--Secondary-900);
            padding: 5px 10px;
            border-radius: 100px;
            cursor: pointer;
        }

        .modal-header {
            margin-bottom: 30px;

            .modal-title {
                color: var(--Secondary-900);
                margin-bottom: 10px;
            }

            hr {
                border-bottom: 1px solid var(--Secondary-900);
                margin-bottom: 10px;
            }

            .modal-description {
                color: var(--Neutral-700);
            }
        }

        .modal-body {
            overflow-y: scroll;
            height: 60vh;
            padding-right: 15px;


            .info-container {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 15px;

                .info-item {
                    padding: 30px;
                    border-radius: 10px;
                    background-color: white;

                    .info-header {
                        font-size: 30px;
                        margin-bottom: 40px;

                        .level {
                            padding: 10px 20px;
                            border-radius: 10px;
                            color: var(--White);
                            margin-right: 10px;
                        }
                    }

                    .info-body {
                        color: var(--Neutral-700);
                    }


                    &:nth-child(1) {
                        .info-header {
                            .level {
                                background-color: var(--Secondary-500);
                            }

                            .title {
                                color: var(--Secondary-500);
                            }
                        }
                    }
                    
                    &:nth-child(2) {
                        
                        .info-header {
                            .level {
                                background-color: var(--Ternary-300);
                            }
                            .title {
                                color: var(--Ternary-300);
                            }
                        }
                    }
                    
                    &:nth-child(3) {
                        .info-header {
                            .level {
                                background-color: var(--Primary-500);
                            }
                            .title {
                                color: var(--Primary-500);
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>