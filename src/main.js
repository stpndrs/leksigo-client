import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { authStore } from './stores/AuthStore'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(createPinia()) // Gunakan Pinia

app.use(router)
authStore.loadToken()

app.mount('#app')
