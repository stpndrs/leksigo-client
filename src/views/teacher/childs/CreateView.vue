<script setup>
import ButtonComponent from '@/components/buttons/ButtonComponent.vue';
import InputComponent from '@/components/fields/InputComponent.vue';
import FailComponent from '@/components/alerts/FailComponent.vue';
import child from '@/assets/images/child.png'
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import api from '@/utils/api';

const router = useRouter()

const code = ref('')
const isLoading = ref(false)

// Alerts
const showAlert = ref(false);
const alertTitle = ref('')
const alertMsg = ref('')

function toggleAlert() {
	showAlert.value = !showAlert.value;
}

const errors = ref([])
async function submit() {
	errors.value = null
	isLoading.value = true

	await api.post(`/childs/insert`, {
		code: code.value,
	}).then((res) => {
		router.push({ name: 'childs.index' })
	}).catch((e) => {
		if (e.status === 422) errors.value = e.response.data.errors
		if (e.status === 400) {
			showAlert.value = true;
			alertTitle.value = 'Gagal menambahkan anak didik';
			alertMsg.value = e.response.data.message;
		}
	}).finally(() => {
		isLoading.value = false
	})
}
</script>

<template>
	<FailComponent v-show="showAlert" @close="toggleAlert" :title="alertTitle" :message="alertMsg" />
	<div class="container">
		<div class="page-header">
			<h1 class="page-title">Tambah Data Anak Didik</h1>
			<button-component label="Kembali" size="small" display="border"
				@click="router.push({ name: 'childs.index' })" />
		</div>
		<div class="page-body">
			<div class="card">
				<div class="card-body">
					<img :src="child" alt="Child">
					<div class="form">
						<input-component label="Kode unik anak" type="text" placeholder="Contoh: 0Z2XV" id="code"
							class="input" v-model="code" :isInvalid="errors?.code ?? false"
							:invalidMsg="errors?.code ?? ''" />
						<button-component :isDisabled="isLoading" :label="isLoading ? 'Loading...' : 'Simpan'"
							size="full" @click="submit" />
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
		grid-template-columns: 30% 70%; // <-- Layout default desktop
		gap: 20px;
		align-items: center; // <-- Tambahan: agar form & gambar sejajar di tengah

		img {
			width: 100%;
			max-width: 350px; // <-- Tambahan: batasi lebar gambar
			justify-self: center; // <-- Tambahan: pusatkan gambar di grid
		}

		.input {
			margin-bottom: 30px;
		}
	}
}

/* --- RESPONSIVE --- 
Target tablet (dan di bawahnya)
*/
@media (max-width: 992px) {
	.card {
		padding: 2rem; // Kurangi padding di layar lebih kecil

		.card-body {
			grid-template-columns: 1fr; // Ubah jadi 1 kolom (vertikal)
			gap: 40px; // Beri jarak lebih untuk tumpukan

			img {
				max-width: 250px; // Kecilkan gambar di mobile
			}
		}
	}
}

/* Target ponsel kecil */
@media (max-width: 576px) {
	.card {
		padding: 1.5rem;
		border-radius: 15px;
	}
}
</style>