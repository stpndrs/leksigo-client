<script setup>
import BookmarkIcon from '@/components/shape/BookmarkIcon.vue';
import EnvelopeIcon from '@/components/shape/EnvelopeIcon.vue';
import InstagramIcon from '@/components/shape/InstagramIcon.vue';
import KanbanIcon from '@/components/shape/KanbanIcon.vue';
import ShopiIcon from '@/components/shape/ShopiIcon.vue';
import { useHead } from '@vueuse/head';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

// --- STATE ---
const isMobileMenuOpen = ref(false); // State untuk Hamburger Menu

// Data Fitur
const features = ref([
	{
		title: "Media Pembelajaran",
		desc: "Modul interaktif dengan AI adaptif untuk siswa.",
		icon: "book"
	},
	{
		title: "Manajemen Akademik",
		desc: "Digitalisasi administrasi & pantauan terapi (PPI).",
		icon: "chart"
	},
	// {
	// 	title: "Wadah Jualan Vokasi",
	// 	desc: "Marketplace karya otentik siswa SLB.",
	// 	icon: "store"
	// }
]);

// Data FAQ
const faqs = ref([
	{
		question: "Apa itu LeksiGo?",
		answer: "LeksiGo adalah ekosistem digital terpadu untuk Sekolah Luar Biasa (SLB) yang mencakup manajemen sekolah, media pembelajaran adaptif berbasis AI, dan marketplace vokasi.",
		isOpen: true
	},
	{
		question: "Apakah cocok untuk semua ketunaan?",
		answer: "Ya, fitur LeksiGo dirancang fleksibel (Tipe Khusus). Modul kami dapat disesuaikan untuk tunanetra, tunarungu, hingga tunagrahita.",
		isOpen: false
	},
	{
		question: "Siapa saja penggunanya?",
		answer: "Kami menghubungkan Sekolah (Guru/Kepsek), Terapis, Orang Tua, dan Siswa dalam satu aplikasi yang saling terintegrasi.",
		isOpen: false
	},
	{
		question: "Bagaimana cara berlangganan?",
		answer: "Kami menyediakan model berlangganan (SaaS) untuk sekolah. Hubungi kami untuk demo gratis.",
		isOpen: false
	}
]);

// Data Pricing
// Data Pricing disesuaikan eksak dengan gambar mockup baru
const pricings = ref([
	{
		name: "FREE TRIAL",
		subPrice: "Gratis",
		exactPrice: "Gratis",
		period: "Selamanya",
		icon: "gift",
		colorClass: "card-blue",
		features: [
			"Kelola 1 anak",
			"1 Latihan",
			"1 Materi",
			"Lihat penilaian & progress belajar",
			"Tambah latihan & materi"
		]
	},
	{
		name: "STARTER",
		subPrice: "Rp70 Ribuan / Bulan",
		exactPrice: "Rp72.000",
		period: "/ bulan",
		icon: "sprout",
		colorClass: "card-green",
		features: [
			"Kelola 5 anak",
			"2 Latihan",
			"2 Materi",
			"Generate latihan (1)",
			"Lihat penilaian & progress belajar",
			"Tambah latihan & materi"
		]
	},
	{
		name: "MEDIUM",
		subPrice: "Rp140 Ribuan / Bulan",
		exactPrice: "Rp144.000",
		period: "/ bulan",
		icon: "star",
		colorClass: "card-orange",
		features: [
			"Kelola 5 anak",
			"10 Latihan",
			"15 Materi",
			"Generate latihan (10)",
			"Generate materi (10)",
			"Lihat penilaian & progress belajar",
			"Tambah latihan & materi"
		]
	},
	{
		name: "PREMIUM",
		subPrice: "Rp500 Ribuan / Bulan",
		exactPrice: "Rp504.000",
		period: "/ bulan",
		icon: "crown",
		colorClass: "card-purple",
		features: [
			"Kelola anak unlimited",
			"Latihan unlimited",
			"Materi unlimited",
			"Generate latihan unlimited",
			"Generate materi unlimited",
			"Lihat penilaian & progress belajar",
			"Tambah latihan & materi"
		]
	}
]);

// Logic Toggle
const toggleFaq = (index) => {
	faqs.value.forEach((faq, i) => {
		if (i === index) faq.isOpen = !faq.isOpen;
		else faq.isOpen = false;
	});
};

const toggleMobileMenu = () => {
	isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

useHead({
	// 1. Judul Halaman (Muncul di Tab Browser & Google)
	title: 'LeksiGo - Aplikasi Manajemen SLB & Marketplace Vokasi',

	// 2. Meta Tags Standar
	meta: [
		{
			name: 'description',
			content: 'LeksiGo adalah ekosistem digital terpadu untuk Sekolah Luar Biasa (SLB). Kelola manajemen sekolah, pembelajaran adaptif AI, dan jual karya vokasi siswa dalam satu aplikasi.'
		},
		{
			name: 'keywords',
			content: 'Aplikasi SLB, Manajemen Sekolah Luar Biasa, Pendidikan Inklusi, Marketplace Vokasi ABK, Media Pembelajaran Adaptif, Sistem Informasi Sekolah'
		},
		{
			name: 'author',
			content: 'Tim LeksiGo'
		},
		{
			name: 'robots',
			content: 'index, follow' // Izinkan Google meng-index halaman ini
		},

		// 3. Open Graph (Agar tampilan cantik saat di-share di WA/Facebook/LinkedIn)
		{
			property: 'og:title',
			content: 'LeksiGo - Solusi Digital Sekolah Luar Biasa'
		},
		{
			property: 'og:description',
			content: 'Bantu sekolah lebih berdaya dengan manajemen terintegrasi dan marketplace vokasi khusus siswa disabilitas.'
		},
		{
			property: 'og:image',
			content: 'https://leksigo.com/assets/images/thumbnail.png' // Ganti dengan URL gambar asli nanti
		},
		{
			property: 'og:url',
			content: 'https://leksigo.com'
		},
		{
			property: 'og:type',
			content: 'website'
		},

		// 4. Twitter Card (Agar cantik di Twitter/X)
		{
			name: 'twitter:card',
			content: 'summary_large_image'
		},
		{
			name: 'twitter:title',
			content: 'LeksiGo - Ekosistem SLB Terpadu'
		},
		{
			name: 'twitter:description',
			content: 'Platform manajemen & vokasi untuk Sekolah Luar Biasa.'
		},
		{
			name: 'twitter:image',
			content: 'https://leksigo.com/assets/images/thumbnail.png'
		}
	],

	// 5. Link Canonical (Mencegah duplikasi konten di mata Google)
	link: [
		{
			rel: 'canonical',
			href: 'https://leksigo.com'
		},
		{
			rel: 'icon',
			href: '/icon.ico', // Pastikan punya favicon
			type: 'image/x-icon'
		}
	]
})
</script>

<template>
	<div class="leksi-container">

		<nav class="navbar">
			<div class="nav-content">
				<div class="logo">
					<img src="../../public/icon.png" alt="Icon">
					<span class="brand-name">LeksiGo</span>
				</div>

				<div style="display: flex; justify-content: center; align-items: center; gap: 30px;">
					<div class="nav-links desktop-only">
						<a href="#" class="active">Beranda</a>
						<a href="#about">Tentang</a>
						<a href="https://instagram.com/edu.leksigo">Hubungi Kami</a>
					</div>

					<button class="btn btn-primary desktop-only" @click="router.push({ name: 'login' })">Login</button>
				</div>

				<button class="hamburger mobile-only" @click="toggleMobileMenu">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B4256" stroke-width="2">
						<path d="M3 12H21" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M3 6H21" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M3 18H21" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
			</div>

			<div class="mobile-menu" :class="{ 'is-open': isMobileMenuOpen }">
				<a href="#" @click="toggleMobileMenu">Beranda</a>
				<a href="#about" @click="toggleMobileMenu">Tentang</a>
				<a href="#contact" @click="toggleMobileMenu">Hubungi Kami</a>
				<button class="btn btn-primary w-full">Login</button>
			</div>
		</nav>

		<header class="hero">
			<div class="hero-content">
				<h1>
					Ekosistem Digital Terpadu untuk <br>
					Sekolah Luar Biasa yang Lebih Berdaya
				</h1>
				<p class="hero-sub">
					Kelola manajemen sekolah, dukung pembelajaran adaptif berbasis AI, <br class="desktop-br">
					dan pasarkan karya vokasi siswa dalam satu aplikasi yang fleksibel.
				</p>
				<div class="cta-group">
					<a href="mailto:contact@leksigo.com" class="btn btn-primary">Coba Demo Gratis</a>
					<a href="mailto:contact@leksigo.com" class="btn btn-outline">Hubungi Kami</a>
				</div>
			</div>
		</header>

		<section class="features">
			<div class="section-header">
				<h1 class="text-pink">LeksiGo</h1>
				<h2>Mendukung kebutuhan kamu</h2>
			</div>

			<div class="cards-grid">
				<div v-for="(feature, index) in features" :key="index" class="feature-card">
					<div class="icon-wrapper">
						<BookmarkIcon v-if="feature.icon === 'book'" />
						<KanbanIcon v-if="feature.icon === 'chart'" />
						<ShopiIcon v-if="feature.icon === 'store'" />
					</div>
					<h3>{{ feature.title }}</h3>
					<p>{{ feature.desc }}</p>
				</div>
			</div>
		</section>

		<section class="about" id="about">
			<div class="about-container">
				<div class="about-image-wrapper">
					<img src="@/assets/images/thumbnail.png" alt="Tentang LeksiGo" />
				</div>

				<div class="about-text">
					<span class="badge-text">Sedikit,</span>
					<h2>Tentang <span class="text-pink">LeksiGo</span></h2>
					<p>
						LeksiGo dibangun atas dasar semangat inklusivitas. Kami menyadari bahwa setiap Sekolah Luar
						Biasa (SLB) memiliki tantangan unik.
						<br><br>
						Oleh karena itu, LeksiGo hadir sebagai solusi teknologi yang <strong>fleksibel</strong> dan
						<strong>terintegrasi</strong> untuk menghubungkan sekolah, terapis, orang tua, dan siswa dalam
						satu ekosistem yang memberdayakan.
					</p>
				</div>
			</div>
		</section>

		<section class="pricing" id="pricing">
			<div class="section-header">
				<h1 class="text-pink">Pilihan Paket</h1>
				<h2>Investasi Terbaik untuk Efisiensi Sekolah</h2>
			</div>

			<div class="pricing-grid">
				<div v-for="(plan, index) in pricings" :key="index" class="pricing-card" :class="plan.colorClass">

					<div class="card-header">
						<h3>{{ plan.name }}</h3>
						<p class="sub-price">{{ plan.subPrice }}</p>

						<div class="illustration-wrapper">
							<div class="icon-circle">
								<svg v-if="plan.icon === 'gift'" width="28" height="28" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round">
									<polyline points="20 12 20 22 4 22 4 12"></polyline>
									<rect x="2" y="7" width="20" height="5"></rect>
									<line x1="12" y1="22" x2="12" y2="7"></line>
									<path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
									<path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
								</svg>

								<svg v-if="plan.icon === 'sprout'" width="28" height="28" viewBox="0 0 24 24"
									fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round">
									<path d="M7 20h10"></path>
									<path d="M12 20v-8"></path>
									<path d="M12 12a5 5 0 0 1 5-5h3"></path>
									<path d="M12 14a5 5 0 0 0-5-5H4"></path>
								</svg>

								<svg v-if="plan.icon === 'star'" width="28" height="28" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round">
									<polygon
										points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
									</polygon>
								</svg>

								<svg v-if="plan.icon === 'crown'" width="28" height="28" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="2" stroke-linecap="round"
									stroke-linejoin="round">
									<path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
								</svg>
							</div>
						</div>
					</div>

					<ul class="plan-features">
						<li v-for="(feat, fIndex) in plan.features" :key="fIndex">
							<div class="check-wrapper">
								<svg class="check-icon" width="12" height="12" viewBox="0 0 24 24" fill="none"
									stroke="currentColor" stroke-width="3" stroke-linecap="round"
									stroke-linejoin="round">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</div>
							<span>{{ feat }}</span>
						</li>
					</ul>

					<div class="card-footer">
						<div class="price-btn">
							<span class="main-amount">{{ plan.exactPrice }}</span>
							<span class="sub-period" v-if="plan.period !== 'Selamanya'">{{ plan.period }}</span>
							<span class="sub-period text-dim" v-else>{{ plan.period }}</span>
						</div>
					</div>

				</div>
			</div>
		</section>

		<section class="faq">
			<div class="faq-container">
				<div class="faq-header">
					<h2>Frequently<br>Asked<br>Questions</h2>
					<p>Mungkin, pertanyaan kamu kejawab disini...</p>
				</div>

				<div class="faq-list">
					<div v-for="(item, index) in faqs" :key="index" class="faq-item" :class="{ 'active': item.isOpen }">
						<button class="faq-question" @click="toggleFaq(index)">
							{{ item.question }}
							<span class="chevron">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#008BD8"
									stroke-width="2">
									<path d="M6 9L12 15L18 9" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</span>
						</button>

						<div class="faq-answer-wrapper" :class="{ 'is-open': item.isOpen }">
							<div class="faq-answer-inner">
								<p>{{ item.answer }}</p>
							</div>
						</div>

					</div>
				</div>
			</div>
		</section>

		<footer>
			<div class="footer-content">
				<div class="footer-brand">
					<div class="logo">
						<img src="../../public/icon.png" alt="LeksiGo Logo">
					</div>
					<p class="brand-desc">
						<strong class="text-pink">LeksiGo</strong> Platform teknologi pendidikan yang berdedikasi untuk
						menciptakan akses pendidikan berkualitas
						dan kemandirian ekonomi bagi penyandang disabilitas.
					</p>
					<div class="brand-socials">
						<a href="https://www.instagram.com/edu.leksigo">
							<InstagramIcon />
						</a>
						<a href="mailto:contact@leksigo.com">
							<EnvelopeIcon />
						</a>
					</div>
				</div>

				<div class="footer-links">
					<h4>LeksiGo</h4>
					<a href="#">Tentang Kami</a>
					<a href="#">Mitra</a>
					<a href="#">Kontak</a>
				</div>

				<div class="footer-links">
					<h4>Bantuan</h4>
					<a href="#">FAQ</a>
					<a href="#">Syarat & Ketentuan</a>
				</div>
			</div>
		</footer>
		<div class="copyright">
			<p>Copyright &copy; 2025 - LeksiGo | All Rights Reserved</p>
		</div>
	</div>
</template>

<style lang="scss">
* {
	scroll-behavior: smooth;
	font-family: 'Ubuntu Sans';
}

.text-pink {
	color: var(--Primary-900);
}

.font-bold {
	font-weight: 700;
}

.ml-2 {
	margin-left: 8px;
}

.w-full {
	width: 100%;
}

.btn {
	padding: 10px 24px;
	border-radius: 8px;
	font-weight: 600;
	font-size: 0.9rem;
	cursor: pointer;
	transition: all 0.3s;
	border: none;
	text-decoration: none;

	&-primary {
		background-color: var(--Primary-900);
		color: var(--White);
		box-shadow: 0 4px 12px rgba(255, 60, 138, 0.3);

		&:hover {
			background-color: var(--Primary-500);
			transform: translateY(-2px);
		}
	}

	&-outline {
		background: transparent;
		border: 1px solid var(--Primary-900);
		color: var(--Primary-900);

		&:hover {
			background: var(--Primary-900);
			color: white;
		}
	}
}

.leksi-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 20px;
	overflow-x: hidden; // Prevent horizontal scroll on mobile
}

/* --- NAVBAR RESPONSIVE --- */
.navbar {
	padding: 20px 0;
	position: relative; // For mobile menu absolute positioning

	.nav-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 8px;

		img {
			width: 80px;
		}

		.brand-name {
			font-weight: 700;
			color: var(--Primary-900);
			font-size: 1.2rem;
		}
	}

	// Default Desktop Styles
	.nav-links {
		display: flex;
		gap: 30px;

		a {
			text-decoration: none;
			font-weight: 500;
			color: black;
			font-size: 1.25rem;
			// font-size: 0.95rem;

			&:hover {
				color: var(--Primary-900);
			}

			&.active {
				color: var(--Primary-900);
				font-weight: 700;
			}
		}
	}

	.hamburger {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
	}

	.mobile-menu {
		display: none;
	}

	// MOBILE STYLES (Max-width 768px)
	@media (max-width: 768px) {
		.desktop-only {
			display: none !important;
		}

		.mobile-only {
			display: block;
		}

		.hamburger {
			display: block;
		}

		.mobile-menu {
			position: absolute;
			top: 100%;
			left: -20px; // Counteract container padding
			right: -20px; // Counteract container padding
			background: var(--White);
			flex-direction: column;
			padding: 20px;
			gap: 15px;
			box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
			border-bottom: 1px solid var(--Neutral-100);
			z-index: 50;

			&.is-open {
				display: flex;
				animation: slideDown 0.3s ease;
			}

			a {
				text-decoration: none;
				color: var(--System-dark);
				font-weight: 500;
				padding: 10px 0;
				border-bottom: 1px solid var(--Neutral-100);
			}
		}
	}
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* --- HERO RESPONSIVE --- */
.hero {
	text-align: center;
	padding: 80px 20px 60px;

	h1 {
		font-size: 3rem;
		line-height: 1.3;
		margin-bottom: 20px;
		font-weight: 700;
	}

	.hero-sub {
		color: var(--Primary-900);
		font-size: 1.5rem;
		line-height: 1.6;
		margin-bottom: 40px;
		font-weight: 500;
	}

	.cta-group {
		display: flex;
		justify-content: center;
		gap: 16px;
	}

	@media (max-width: 768px) {
		padding: 40px 0;

		h1 {
			font-size: 1.8rem;
		}

		// Font lebih kecil di HP
		.hero-sub {
			font-size: 0.95rem;
		}

		.desktop-br {
			display: none;
		}

		// Hilangkan enter paksa di HP
		.cta-group {
			flex-direction: column;
			width: 100%;
		}

		.btn {
			width: 100%;
		}

		// Tombol full width
	}
}

/* --- FEATURES RESPONSIVE --- */
.features {
	padding: 60px 0;
	text-align: center;

	.section-header {
		margin-bottom: 40px;

		h1 {
			font-size: 3rem;
			line-height: 1.3;
			font-weight: 700;
		}

		h2 {
			font-size: 1.8rem;
			font-weight: 600;
		}
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
	}

	.feature-card {
		background-color: var(--Primary-900);
		padding: 30px 20px;
		border-radius: 12px;
		color: var(--White);
		transition: transform 0.3s;

		.icon-wrapper {
			margin-bottom: 16px;

			svg {
				width: 60px;
			}
		}

		h3 {
			font-size: 1.1rem;
			margin-bottom: 8px;
		}

		p {
			font-size: 0.9rem;
			opacity: 0.9;
		}
	}

	@media (max-width: 900px) {
		.cards-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 600px) {
		.cards-grid {
			grid-template-columns: 1fr;
		}

		// 1 Kolom di HP
		.section-header h2 {
			font-size: 1.5rem;
		}
	}
}

/* --- ABOUT SECTION (UPDATED) --- */
.about {
	padding: 80px 0;

	.about-container {
		display: flex;
		align-items: center; // Supaya vertikal di tengah (center)
		justify-content: space-between;
		gap: 60px; // Jarak antara gambar dan teks
	}

	// Wrapper Gambar agar responsif
	.about-image-wrapper {
		flex: 1; // Mengambil 50% lebar
		display: flex;
		justify-content: center; // Posisi gambar di tengah area-nya

		img {
			width: 100%;
			height: auto;
			object-fit: contain;

			// Opsional: Tambahkan sedikit shadow/radius agar manis seperti di Figma
			border-radius: 20px;
			// box-shadow: 0 10px 30px rgba(0,0,0,0.08); // Uncomment jika ingin bayangan
		}
	}

	// Bagian Teks
	.about-text {
		flex: 1; // Mengambil 50% lebar sisa

		.badge-text {
			color: var(--Secondary-900); // Warna biru
			font-weight: 600;
			font-size: 1.1rem;
			display: block;
			margin-bottom: 8px;
		}

		h2 {
			font-size: 2.5rem;
			margin-bottom: 24px;
			line-height: 1.2;

			.text-pink {
				color: var(--Primary-900);
			}
		}

		p {
			color: var(--Neutral-700);
			line-height: 1.8;
			font-weight: 500;
			font-size: 1.2rem;
		}
	}

	// --- RESPONSIVE (MOBILE) ---
	@media (max-width: 900px) {
		padding: 50px 0;

		.about-container {
			flex-direction: column-reverse; // Gambar di bawah, teks di atas (atau hapus reverse jika ingin gambar di atas)
			gap: 40px;
			text-align: center; // Teks rata tengah di HP
		}

		.about-image-wrapper img {
			max-width: 100%; // Gambar full width di HP
			padding: 0 20px;
		}

		.about-text h2 {
			font-size: 2rem;
		}
	}
}

/* --- FAQ RESPONSIVE --- */
/* --- FITUR CARD (HOVER EFFECT) --- */
.features {
	padding: 60px 0;
	text-align: center;

	.section-header {
		margin-bottom: 40px;

		h2 {
			font-size: 1.8rem;
			font-weight: 600;
		}
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
	}

	.feature-card {
		background: var(--Primary-900);
		padding: 30px 20px;
		border-radius: 16px; // Lebih bulat sedikit
		color: var(--White);
		position: relative;
		overflow: hidden;

		// Transisi Smooth untuk semua properti
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		box-shadow: 0 4px 6px rgba(255, 60, 138, 0.1);
		border: 1px solid transparent;

		.icon-wrapper {
			margin-bottom: 16px;
			transition: transform 0.4s ease; // Animasi ikon terpisah
		}

		h3 {
			font-size: 1.1rem;
			margin-bottom: 8px;
			position: relative;
			z-index: 2;
		}

		p {
			font-size: 0.9rem;
			opacity: 0.9;
			position: relative;
			z-index: 2;
		}

		// Efek Hover:
		&:hover {
			transform: translateY(-10px) scale(1.02); // Naik ke atas & sedikit membesar
			box-shadow: 0 20px 30px -10px rgba(255, 60, 138, 0.5); // Bayangan pink bersinar
			background: linear-gradient(135deg, var(--Primary-900), var(--Primary-500)); // Gradient halus

			// Ikon membesar dan sedikit miring
			.icon-wrapper {
				transform: scale(1.2) rotate(-5deg);
			}
		}
	}

	@media (max-width: 900px) {
		.cards-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 600px) {
		.cards-grid {
			grid-template-columns: 1fr;
		}

		.section-header h2 {
			font-size: 1.5rem;
		}
	}
}

/* --- PRICING SECTION (GLOW & CIRCLE STYLING) --- */
.pricing {
	padding: 60px 0;
	text-align: center;

	.pricing-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 18px;
		align-items: stretch;
		margin-top: 40px;
	}

	.pricing-card {
		background: var(--White);
		border-radius: 24px;
		padding: 40px 22px 30px 22px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.02);
		border: 1.5px solid transparent;

		&:hover {
			transform: translateY(-8px);

			// Efek hover ikon membesar tipis saat kartu di-hover
			.icon-circle {
				transform: scale(1.08);
			}
		}
	}

	/* --- SKEMA WARNA DENGAN SOFT GLOW EFFECT --- */
	.card-blue {
		border-color: #E6EEF8;

		h3 {
			color: #0060C0;
		}

		.icon-circle {
			background: #EDF4FC;
			color: #3482E2;
			box-shadow: 0 10px 20px rgba(52, 130, 226, 0.15);
		}

		.check-wrapper {
			background: #EDF4FC;
			color: #3482E2;
		}

		.price-btn {
			background-color: #EDF4FC;
			color: #1E66C9;
		}
	}

	.card-green {
		border-color: #EAF5ED;

		h3 {
			color: #1E824C;
		}

		.icon-circle {
			background: #EAF7EE;
			color: #27AE60;
			box-shadow: 0 10px 20px rgba(39, 174, 96, 0.15);
		}

		.check-wrapper {
			background: #EAF7EE;
			color: #27AE60;
		}

		.price-btn {
			background-color: #EAF7EE;
			color: #1E7E34;
		}
	}

	.card-orange {
		border-color: #FDF1EA;

		h3 {
			color: #D35400;
		}

		.icon-circle {
			background: #FDF2E9;
			color: #E67E22;
			box-shadow: 0 10px 20px rgba(230, 126, 34, 0.15);
		}

		.check-wrapper {
			background: #FDF2E9;
			color: #E67E22;
		}

		.price-btn {
			background-color: #FDF2E9;
			color: #C0392B;
		}
	}

	.card-purple {
		border-color: #F3EFFB;

		h3 {
			color: #512DA8;
		}

		.icon-circle {
			background: #F1EDFA;
			color: #8E44AD;
			box-shadow: 0 10px 20px rgba(142, 68, 173, 0.15);
		}

		.check-wrapper {
			background: #F1EDFA;
			color: #8E44AD;
		}

		.price-btn {
			background-color: #F1EDFA;
			color: #512DA8;
		}
	}

	/* --- DETAIL STYLING KARTU --- */
	.card-header {
		text-align: center;
		margin-bottom: 25px;

		h3 {
			font-size: 1.35rem;
			font-weight: 800;
			letter-spacing: 0.5px;
			margin-bottom: 6px;
		}

		.sub-price {
			font-size: 0.85rem;
			color: #94A3B8;
			font-weight: 600;
			margin-bottom: 25px;
		}

		.illustration-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 10px;

			// Box Bulatan untuk Ikon Utama
			.icon-circle {
				width: 65px;
				height: 65px;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				transition: transform 0.3s ease;
			}
		}
	}

	.plan-features {
		list-style: none;
		padding: 0;
		margin: 0 0 35px 0;
		text-align: left;
		flex-grow: 1;

		li {
			display: flex;
			align-items: center; // Bikin teks dan checklist sejajar tengah secara vertikal
			gap: 12px;
			font-size: 0.95rem;
			color: #334155;
			margin-bottom: 16px;
			font-weight: 500;

			// Bulatan kecil untuk background icon check
			.check-wrapper {
				width: 24px;
				height: 24px;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-shrink: 0;
			}
		}
	}

	.card-footer {
		width: 100%;

		.price-btn {
			width: 100%;
			padding: 16px 12px;
			border-radius: 16px;
			font-weight: 700;
			font-size: 1.2rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			line-height: 1.2;
			transition: transform 0.2s, opacity 0.2s;
			cursor: pointer;

			&:hover {
				transform: scale(1.02);
			}

			.main-amount {
				font-weight: 800;
			}

			.sub-period {
				font-size: 0.8rem;
				font-weight: 600;
				margin-top: 2px;

				&.text-dim {
					opacity: 0.5;
				}
			}
		}
	}

	@media (max-width: 1100px) {
		.pricing-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 20px;
		}
	}

	@media (max-width: 600px) {
		.pricing-grid {
			grid-template-columns: 1fr;
		}
	}
}

/* --- FAQ ANIMATION (SMOOTH GRID TRICK) --- */
.faq {
	padding: 60px 0;

	.faq-container {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 40px;
	}

	.faq-header {
		flex: 1;

		h2 {
			font-size: 2.5rem;
			line-height: 1.2;
			margin-bottom: 16px;
		}

		p {
			color: var(--Neutral-700);
		}
	}

	.faq-list {
		flex: 1.5;
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 100%;
	}

	.faq-item {
		border: 1px solid var(--Neutral-100);
		border-radius: 12px;
		background: var(--White);
		transition: border-color 0.3s ease, box-shadow 0.3s ease;

		// Saat aktif (dibuka), border jadi biru agar fokus
		&.active {
			border-color: var(--Secondary-500);
			box-shadow: 0 4px 12px rgba(0, 139, 216, 0.1);

			.chevron {
				transform: rotate(180deg);
			}
		}

		.faq-question {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20px;
			background: none;
			border: none;
			font-size: 1rem;
			font-weight: 600;
			color: var(--Secondary-900);
			cursor: pointer;
			text-align: left;

			.chevron {
				transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); // Putaran halus
				display: flex;
				align-items: center;
			}
		}

		// --- LOGIKA ANIMASI SMOOTH ---
		// Menggunakan CSS Grid 0fr -> 1fr untuk transisi height "auto"
		.faq-answer-wrapper {
			display: grid;
			grid-template-rows: 0fr; // Default tertutup
			transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1); // Timing function smooth

			&.is-open {
				grid-template-rows: 1fr; // Keadaan terbuka
			}

			.faq-answer-inner {
				overflow: hidden; // Wajib ada agar konten tersembunyi saat height 0
				min-height: 0;
			}
		}

		.faq-answer-inner p {
			padding: 0 20px 24px; // Padding dipindah ke paragraf agar animasi rapi
			color: var(--Neutral-700);
			line-height: 1.6;
			font-weight: 500;
			font-size: 0.95rem;
			opacity: 0;
			transform: translateY(-10px);
			transition: opacity 0.3s ease, transform 0.3s ease;
		}

		// Efek Fade-in text saat dibuka
		&.active .faq-answer-inner p {
			opacity: 1;
			transform: translateY(0);
			transition-delay: 0.1s; // Teks muncul sedikit setelah box terbuka
		}
	}

	@media (max-width: 768px) {
		.faq-container {
			flex-direction: column;
			gap: 20px;
		}

		.faq-header h2 {
			font-size: 2rem;
		}
	}
}

/* --- FOOTER RESPONSIVE --- */
footer {
	margin-top: 60px;
	padding: 60px 0 40px;
	border-top: 1px solid var(--Neutral-100);

	.footer-content {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 40px;
	}

	.logo {
		display: flex;
		justify-content: center;
		align-items: start;
		flex-direction: column;
	}

	img {
		width: 150px;
	}

	.brand-desc {
		font-size: 1.25rem;
		line-height: 1.6;
	}

	.brand-socials {
		display: flex;
		justify-content: start;
		align-items: center;
		gap: 30px;
		margin-top: 30px;

		svg {
			width: 30px;
		}

		a {
			color: var(--Secondary-900);
			text-decoration: none;
		}
	}

	.footer-links {
		h4 {
			font-size: 1.25rem;
			color: var(--Secondary-900);
			font-weight: 700;
			margin-bottom: 20px;
		}

		display: flex;
		flex-direction: column;
		gap: 12px;

		a {
			text-decoration: none;
			font-size: 1.25rem;
			font-weight: 500;
			color: black;

			&:hover {
				color: var(--Primary-900);
			}
		}
	}

	@media (max-width: 768px) {
		.footer-content {
			grid-template-columns: 1fr;
			text-align: center;
			gap: 30px;
		}

		.logo {
			justify-content: center;
			align-items: center;
		}

		// Logo center
		.brand-desc {
			margin: 16px auto 0;
		}

		.brand-socials {
			display: flex;
			justify-content: center;
			align-items: center;
		}

		// Text center
	}
}

.copyright {
	text-align: center;
	padding: 30px 0;
	font-weight: bold;
	color: var(--Secondary-900);
}
</style>