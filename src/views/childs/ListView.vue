<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import SearchComponent from '@/components/fields/SearchComponent.vue';
import ChildComponent from '@/components/cards/ChildComponent.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/api';

const router = useRouter()
const search = ref('')

const childs = ref([])
onMounted(async () => {
    await getData()
})

const getData = async () => {
    await api.get('/childs')
        .then((res) => {
            childs.value = res.data.data.childs
        }).catch((err) => {
            console.log(err);
        })
}

const destroy = async (id) => {
    if (confirm("Yakin ingin menghapus data?")) {
        await api.delete(`/childs/${id}`)
            .then((res) => {
                console.log(res.data);
                getData()
            }).catch((err) => {
                console.log(err);
            })
    }
}
</script>

<template>
    <div class="container">
        <div class="page-header">
            <h1 class="page-title">Data Anak Didik</h1>
            <button-component label="Tambah Anak" size="small" @click="router.push({ name: 'childs.create' })" />
        </div>
        <div class="page-body">
            <search-component v-model="search" placeholder="Cari data anak" @input="console.log(search)" />
            <div class="grid-container">
                <div class="item" v-for="(item, index) in childs" :key="index">
                    <child-component :id="item.child._id" :level="item.child.level ?? null" :name="item.child.fullName"
                        :code="item.child.code" :parentName="item.parentName ?? null" :method="destroy" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.grid-container {
    display: grid;
    // Gunakan 1fr (fraction) sebagai ganti %
    // Ini otomatis menghitung ruang untuk 'gap'
    grid-template-columns: repeat(4, 1fr); // <-- 4 kolom (Desktop)
    gap: 15px;
    margin-top: 30px;

    // Tablet: Ubah ke 2 kolom
    @media screen and (max-width: 991.98px) {
        grid-template-columns: repeat(2, 1fr);
    }

    // Ponsel: Ubah ke 1 kolom
    @media screen and (max-width: 767.98px) {
        grid-template-columns: 1fr; // <-- 'repeat(1, 100%)' bisa disingkat jadi '1fr'
    }
}
</style>