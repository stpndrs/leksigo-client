import { authStore } from '@/stores/AuthStore';
import { createRouter, createWebHistory, useRouter } from 'vue-router'
import middleware from './middleware';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			redirect: '/login'
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('../views/auth/RegisterView.vue'),
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/auth/LoginView.vue'),
		},
		{
			path: '/dashboard',
			component: () => import('../layouts/default.vue'),
			beforeEnter: middleware,
			children: [
				{
					path: '',
					name: 'dashboard',
					component: () => import('../views/DashboardView.vue'),
				},
				{
					path: '/childs',
					name: 'childs',
					children: [
						{
							path: '',
							name: 'childs.index',
							component: () => {
								const roleFolder = authStore.user.role === 1 ? 'teacher' : 'parent';
								return import(`../views/${roleFolder}/childs/ListView.vue`);
							}
						},
						{
							path: 'create',
							name: 'childs.create',
							component: () => {
								const roleFolder = authStore.user.role === 1 ? 'teacher' : 'parent';
								return import(`../views/${roleFolder}/childs/CreateView.vue`);
							}
						},
						{
							path: ':code',
							name: 'childs.detail',
							component: () => {
								const roleFolder = authStore.user.role === 1 ? 'teacher' : 'parent';
								return import(`../views/${roleFolder}/childs/DetailView.vue`);
							}
						},

					]
				},
				{
					path: '/exercise/:id',
					name: 'exercise',
					children: [
						{
							path: '',
							name: 'exercise.overview',
							component: () => import('../views/exercise/OverView.vue')
						},
						{
							path: 'quiz',
							name: 'exercise.quiz',
							component: () => import('../views/exercise/QuizView.vue')
						},
						{
							path: 'summary',
							name: 'exercise.summary',
							component: () => import('../views/exercise/SummaryView.vue')
						}
					]
				}
			]
		},
		{
			path: '/test-stt',
			name: 'test',
			component: () => import('../views/test.vue')
		},
		{
			path: '/test-tts',
			name: 'tesat',
			component: () => import('../views/test2.vue')
		},
	],
})

export default router
