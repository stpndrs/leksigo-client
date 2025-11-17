import { reactive } from "vue"

export const latestQuizStore = reactive({
    data: [],

    setData(data) {
        console.log(data);
        
        this.data = data
        sessionStorage.setItem('latestQuiz', JSON.stringify(data))
    },

    clearData() {
        this.data = []
        sessionStorage.removeItem('latestQuiz')
    },

    loadData() {
        console.log(sessionStorage);
        // this.setData([])
        
        this.data = JSON.parse(sessionStorage.getItem('latestQuiz'))
    },

    get getLevel() {
        this.loadData()
        return this.data.level
    },
})