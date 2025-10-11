<script setup>
import HomeIcon from '@/components/shape/HomeIcon.vue';
import LibrarybooksIcon from '@/components/shape/LibrarybooksIcon.vue';
import StickynoteIcon from '@/components/shape/StickynoteIcon.vue';
import UserIcon from '@/components/shape/UserIcon.vue';
import { useRoute } from 'vue-router';
import { ref } from 'vue'; // 👈 1. Import 'ref'
import { authStore } from '@/stores/AuthStore';
import router from '@/router';

const route = useRoute();

// 2. Buat state untuk mengontrol visibilitas sidebar
const isSidebarOpen = ref(false);

// 3. Buat fungsi untuk toggle state
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};



// fungsi logout
const logout = () => {
    if (confirm('Yakin ingin keluar aplikasi')) {
        authStore.clearToken()
        router.push({ name: 'login' })
    }
}
</script>

<template>
    <button @click="toggleSidebar" class="hamburger-menu">
        <span></span>
        <span></span>
        <span></span>
    </button>

    <div v-if="isSidebarOpen" @click="toggleSidebar" class="sidebar-overlay"></div>

    <aside id="sidebar" :class="{ 'is-open': isSidebarOpen }">
        <div class="sidebar-body">
            <ul class="menus">
                <li :class="['menu', { 'active': route.name === 'dashboard' }]">
                    <router-link :to="{ name: 'dashboard' }" class="menu-link">
                        <HomeIcon /> Dashboard
                    </router-link>
                </li>
                <li :class="['menu', { 'active': route.name === 'childs.index' }]">
                    <router-link :to="{ name: 'childs.index' }" class="menu-link">
                        <UserIcon /> Data anak didik
                    </router-link>
                </li>
                <li :class="['menu']">
                    <router-link to="#" class="menu-link" @click="logout">
                        <UserIcon /> Logout
                    </router-link>
                </li>
            </ul>
        </div>
    </aside>
</template>

<style lang="scss" scoped>
// Letakkan di bagian paling atas style Anda atau di file variabel
$breakpoint-desktop: 992px; // Titik di mana sidebar akan tampil permanen

#sidebar {
    padding: 5rem 0;
    background-color: var(--White);
    height: 100vh;

    // --- Gaya Default (Mobile) ---
    position: fixed; // Gunakan fixed agar bisa overlay di atas konten
    top: 0;
    left: 0;
    width: 280px; // Beri lebar spesifik
    z-index: 1000; // Pastikan di atas overlay dan konten
    transform: translateX(-100%); // Sembunyikan ke kiri
    transition: transform 0.3s ease-in-out; // Animasi halus

    // Class yg akan ditambahkan oleh Vue
    &.is-open {
        transform: translateX(0); // Tampilkan sidebar
    }

    // --- Gaya untuk Desktop ---
    @media (min-width: $breakpoint-desktop) {
        position: sticky; // Kembali ke sticky di desktop
        transform: translateX(0); // Selalu terlihat
        width: auto; // Atau lebar spesifik untuk desktop jika perlu
    }

    .menus {
        // ... style menu Anda tidak berubah ...
        margin: 0;
        padding: 0;

        .menu {
            list-style: none;
            padding: 15px 30px;

            &.active {
                background-color: #E9F5FE;

                .menu-link {
                    color: var(--Secondary-900);
                    font-weight: bold;

                    svg path {
                        fill: var(--Secondary-900);
                    }
                }
            }

            .menu-link {
                text-decoration: none;
                color: var(--Neutral-700);
                display: flex;
                justify-content: start;
                gap: 10px;
                align-items: center;
                font-size: large;
            }
        }
    }
}

// --- Style untuk Tombol Hamburger ---
.hamburger-menu {
    display: flex; // Tampilkan di mobile
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1001; // Di atas segalanya
    position: fixed; // Agar tetap di posisinya
    top: 1.5rem;
    left: 1.5rem;

    span {
        width: 2rem;
        height: 0.25rem;
        background: var(--Neutral-700);
        border-radius: 10px;
    }

    @media (min-width: $breakpoint-desktop) {
        display: none; // Sembunyikan di desktop
    }
}

// --- Style untuk Overlay ---
.sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); // Latar belakang gelap transparan
    z-index: 999; // Di bawah sidebar, tapi di atas konten utama

    @media (min-width: $breakpoint-desktop) {
        display: none; // Sembunyikan di desktop
    }
}
</style>