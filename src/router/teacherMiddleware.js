import { authStore } from "@/stores/AuthStore";

export default function teacherMiddleware(to, from, next) {
    if (!authStore.isLogin || authStore.user.role != 1) {
        next({ name: 'login' })
    } else {
        next()
    }
}