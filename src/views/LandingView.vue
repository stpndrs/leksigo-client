<script setup>
import BookmarkIcon from '@/components/shape/BookmarkIcon.vue';
import EnvelopeIcon from '@/components/shape/EnvelopeIcon.vue';
import InstagramIcon from '@/components/shape/InstagramIcon.vue';
import KanbanIcon from '@/components/shape/KanbanIcon.vue';
import ShopiIcon from '@/components/shape/ShopiIcon.vue';
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
	{
		title: "Wadah Jualan Vokasi",
		desc: "Marketplace karya otentik siswa SLB.",
		icon: "store"
	}
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
						<a href="#contact">Hubungi Kami</a>
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
						<a href="#">
							<InstagramIcon />
						</a>
						<a href="#">
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
		grid-template-columns: repeat(3, 1fr);
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
		grid-template-columns: repeat(3, 1fr);
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