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
    await api.get('/childs')
        .then((res) => {
            console.log(res.data);
            
            childs.value = res.data.data.childs
        }).catch((err) => {
            console.log(err);
        })
})
</script>

<template>
    <div class="container">
        <div class="page-header">
            <h1 class="page-title">Data Anak</h1>
            <button-component label="Tambah Anak" size="small" @click="router.push({ name: 'childs.create' })" />
        </div>
        <div class="page-body">
            <search-component v-model="search" placeholder="Cari data anak" @input="console.log(search)" />
            <div class="grid-container">
                <div class="item" v-for="(item, index) in childs" :key="index">
                    <child-component :level="item.childData.level ?? null" :name="item.childData.fullName" :code="item.childData.code"  />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.grid-container {
    display: grid;
    grid-template-columns: repeat(4, 24%);
    gap: 15px;
    margin-top: 30px;

    @media screen and (max-width: 991.98px) {
        grid-template-columns: repeat(2, 50%);
    }

    @media screen and (max-width: 767.98px) {
        grid-template-columns: repeat(1, 100%);
    }
}
</style>