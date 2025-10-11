import { authStore } from "@/stores/AuthStore";

export default function middleware(to, from, next) {
    if (!authStore.isLogin) {
        next({ name: 'login' })
    } else {
        next()
    }
}