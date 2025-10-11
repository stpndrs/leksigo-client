import { jwtDecode } from "jwt-decode"
import { reactive } from "vue"

export const authStore = reactive({
    token: null,

    setToken(token) {
        this.token = token
        localStorage.setItem('token', JSON.stringify(this.token))
    },

    clearToken() {
        this.token = null
        localStorage.setItem('token', JSON.stringify(null))
    },

    loadToken() {
        this.token = JSON.parse(localStorage.getItem('token'))
    },

    get isLogin() {
        return !!(this.token)
    },

    get user() {
        return jwtDecode(this.token)
    }
})