import { authStore } from '@/stores/AuthStore';
import { createRouter, createWebHistory, useRouter } from 'vue-router'
import middleware from './middleware';
import teacherMiddleware from './teacherMiddleware';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			redirect: '/login',
			beforeEnter: (to, from, next) => {
				if (authStore.isLogin) next({ name: 'dashboard' })
				else next()
			}
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('../views/auth/RegisterView.vue'),
			beforeEnter: (to, from, next) => {
				if (authStore.isLogin) next({ name: 'dashboard' })
				else next()
			}
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/auth/LoginView.vue'),
			beforeEnter: (to, from, next) => {
				if (authStore.isLogin) next({ name: 'dashboard' })
				else next()
			}
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
							component: () => import(`../views/childs/ListView.vue`)
						},
						{
							path: '/dashboard/childs/create',
							name: 'childs.create',
							component: () => import(`../views/childs/CreateView.vue`)
						},
						{
							path: '/dashboard/childs/:id',
							name: 'childs.detail',
							component: () => import(`../views/childs/DetailView.vue`)
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
							component: () => import('../views/exercise/CreateExerciseView.vue'),
							beforeEnter: teacherMiddleware
						},
						{
							path: '/exercise/edit/:id',
							name: 'exercise.edit',
							component: () => import('../views/exercise/EditExerciseView.vue'),
							beforeEnter: teacherMiddleware
						},
						{
							path: '/exercise/work/:id',
							name: 'exercise.work',
							children: [
								{
									path: '/exercise/quiz/list/:id',
									name: 'exercise.quiz.list',
									component: () => import('../views/exercise/QuizListView.vue'),
								},
								{
									path: '/exercise/quiz/create/:id',
									name: 'exercise.quiz.create',
									component: () => import('../views/exercise/CreateQuizView.vue'),
									beforeEnter: teacherMiddleware
								},
								{
									path: '/exercise/quiz/edit/:id/:quizId',
									name: 'exercise.quiz.edit',
									component: () => import('../views/exercise/EditQuizView.vue'),
									beforeEnter: teacherMiddleware
								},
								{
									path: '/exercise/quiz/detail/:id/:quizId',
									name: 'exercise.quiz.detail',
									component: () => import('../views/exercise/DetailQuizView.vue'),
								},
								{
									path: '/exercise/quiz/overview/:id/:quizId',
									name: 'exercise.quiz.overview',
									component: () => import('../views/exercise/OverView.vue'),
								},
								{
									path: '/exercise/quiz/work/:id/:quizId',
									name: 'exercise.quiz.work',
									component: () => import('../views/exercise/QuizzView.vue'),
									beforeEnter: teacherMiddleware
								},
								{
									path: '/exercise/quiz/summary/:id/:quizId',
									name: 'exercise.quiz.summary',
									component: () => import('../views/exercise/SummaryView.vue'),
									beforeEnter: teacherMiddleware
								},
								{
									path: '/exercise/quiz/review/:id/:quizId',
									name: 'exercise.quiz.review',
									component: () => import('../views/exercise/ReviewView.vue'),
								},
								{
									path: '/exercise/attitude/:id/:quizId',
									name: 'exercise.attitude',
									component: () => import('../views/exercise/AttitudeView.vue'),
									beforeEnter: teacherMiddleware
								},
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
							component: () => import('../views/material/CreateView.vue'),
							beforeEnter: teacherMiddleware
						},
						{
							path: '/material/:id/edit/:materialId',
							name: 'material.edit',
							component: () => import('../views/material/EditView.vue'),
							beforeEnter: teacherMiddleware
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
	],
})

export default router
