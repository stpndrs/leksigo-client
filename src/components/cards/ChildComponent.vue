<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import child from '@/assets/images/child.png'
import CopyIcon from '@/components/shape/CopyIcon.vue';
import { useRouter } from 'vue-router';
import { workStore } from '@/stores/WorkStore';

const props = defineProps(['id', 'level', 'name', 'code', 'parentName', 'method'])
const router = useRouter()

const handleWorkMode = (params) => {
    if (params == 'detail') {
        workStore.exitWorkMode()
        router.push({ name: 'childs.detail', params: { id: props.id } })
    } else {
        workStore.enterWorkMode()
        router.push({ name: 'childs.detail', params: { id: props.id } })
    }
}

</script>

<template>
    <div class="card">
        <div class="card-header">
            <img :src="child" alt="Child">
            <div class="level" v-if="props.level">
                {{ props.level }}
            </div>
        </div>
        <div class="card-body">
            <p class="name">{{ props.name }}</p>
            <p class="parent" v-if="props.parentName">{{ props.parentName }}</p>
            <div class="code">
                <CopyIcon /> {{ props.code }}
            </div>
        </div>
        <div class="card-footer">
            <button-component label="Detail" size="full" @click="handleWorkMode('detail')" />
            <button-component label="Kerjakan Tugas" size="full" @click="handleWorkMode('work')" />
            <button-component label="Hapus" display="border" size="full" @click="props.method(props.id)" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card {
    background-color: var(--White);
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 3.098px 34.083px 0 rgba(0, 0, 0, 0.10);
    color: var(--Secondary-900);

    .card-header {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
        position: relative;

        .level {
            position: absolute;
            top: -15px;
            right: -15px;
            background: var(--Ternary-300);
            padding: 10px 15px;
            text-align: center;
            color: white;
            font-weight: bold;
            border-radius: 5px;
        }
    }

    img {
        width: 10rem;
    }

    .name {
        font-size: 25px;
        font-weight: bold;
    }

    .code {
        display: flex;
        justify-content: start;
        align-items: center;
        gap: 5px;
        margin: 10px 0;
        font-size: 15px;
    }

    .button {
        margin-top: 20px;
    }
}
</style>