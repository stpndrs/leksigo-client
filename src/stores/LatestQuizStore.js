import { reactive } from "vue"

export const latestQuizStore = reactive({
    data: null,

    setData(data) {
        this.data = data
        sessionStorage.setItem('latestQuiz', JSON.stringify(data))
    },

    clearData() {
        this.data = null
        sessionStorage.removeItem('latestQuiz')
    },

    loadData() {
        this.data = JSON.parse(sessionStorage.getItem('latestQuiz'))
    },

    get getLevel() {
        this.loadData()
        return this.data.level
    },
})