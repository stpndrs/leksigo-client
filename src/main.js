import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { authStore } from './stores/AuthStore'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'

const app = createApp(App)
const head = createHead()

app.use(createPinia()) // Gunakan Pinia
app.use(router)
app.use(head)
authStore.loadToken()

app.mount('#app')
