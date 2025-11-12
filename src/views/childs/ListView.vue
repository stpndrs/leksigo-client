<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import SearchComponent from '@/components/fields/SearchComponent.vue';
import ChildComponent from '@/components/cards/ChildComponent.vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/api';
import { authStore } from '@/stores/AuthStore';

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

const filteredChilds = computed(() => {
    if (!search.value) {
        return childs.value;
    }

    const query = search.value.toLowerCase().trim();

    return childs.value.filter((item) => {
        const childName = item.child?.fullName?.toLowerCase() || '';
        const childCode = item.child?.code?.toLowerCase() || '';
        const parentName = item.parentName?.toLowerCase() || '';

        return childName.includes(query) ||
            childCode.includes(query) ||
            parentName.includes(query);
    });
});

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
            <h1 class="page-title">Data Anak {{ authStore.user.role == 1 ? 'Didik' : '' }}</h1>
            <button-component label="Tambah Anak" size="small" @click="router.push({ name: 'childs.create' })" />
        </div>
        <div class="page-body">
            <search-component v-model="search" placeholder="Cari nama, kode, atau orang tua..." />

            <div class="grid-container">
                <div class="item" v-for="(item, index) in filteredChilds" :key="index">
                    <child-component :id="item.child._id" :level="item.child.level ?? null" :name="item.child.fullName"
                        :code="item.child.code" :parentName="item.parentName ?? null" :method="destroy" />
                </div>

                <div v-if="filteredChilds.length === 0" class="empty-state">
                    <p>Data tidak ditemukan.</p>
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

    .empty-state {
        grid-column: 1 / -1; // Agar mengambil lebar penuh grid
        text-align: center;
        padding: 2rem;
        color: var(--Neutral-500, #888);
        font-size: 1.1rem;
    }
}
</style>