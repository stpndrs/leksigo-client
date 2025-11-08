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
					path: '/dashboard/childs',
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
							path: '/dashboard/childs/create',
							name: 'childs.create',
							component: () => {
								const roleFolder = authStore.user.role === 1 ? 'teacher' : 'parent';
								return import(`../views/${roleFolder}/childs/CreateView.vue`);
							}
						},
						{
							path: '/dashboard/childs/:id',
							name: 'childs.detail',
							component: () => {
								const roleFolder = authStore.user.role === 1 ? 'teacher' : 'parent';
								return import(`../views/${roleFolder}/childs/DetailView.vue`);
							}
						},

					]
				},
				{
					path: '/exercise',
					name: 'exercise',
					children: [
						{
							path: '/exercise/create/:id',
							name: 'exercise.create',
							component: () => import('../views/exercise/CreateExerciseView.vue')
						},
						{
							path: '/exercise/work/:id',
							name: 'exercise.work',
							children: [
								{
									path: '/exercise/quiz/list/:id',
									name: 'exercise.quiz.list',
									component: () => import('../views/exercise/QuizListView.vue')
								},
								{
									path: '/exercise/quiz/create/:id',
									name: 'exercise.quiz.create',
									component: () => import('../views/exercise/CreateQuizView.vue')
								},
								{
									path: '/exercise/quiz/overview/:id/:quizId',
									name: 'exercise.quiz.overview',
									component: () => import('../views/exercise/OverView.vue')
								},
								{
									path: '/exercise/quiz/work/:id/:quizId',
									name: 'exercise.quiz.work',
									component: () => import('../views/exercise/QuizzView.vue')
								},
								{
									path: '/exercise/summary/:id/:quizId',
									name: 'exercise.quiz.summary',
									component: () => import('../views/exercise/SummaryView.vue')
								},
								{
									path: '/exercise/attitude/:id/:quizId',
									name: 'exercise.attitude',
									component: () => import('../views/exercise/AttitudeView.vue')
								}
							]
						}
					]
				},
				{
					path: '/material/:id/',
					name: 'material',
					children: [
						{
							path: '/material/:id/create',
							name: 'material.create',
							component: () => import('../views/material/CreateView.vue')
						},
						{
							path: '/material/:id/edit/:materialId',
							name: 'material.edit',
							component: () => import('../views/material/EditView.vue')
						},
						{
							path: '/material/:id/overview/:materialId',
							name: 'material.overview',
							component: () => import('../views/material/OverView.vue')
						},
					]
				},

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
