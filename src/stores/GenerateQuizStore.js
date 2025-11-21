import { defineStore } from "pinia";
import { ref } from "vue";

export const useGenerateQuizStore = defineStore('quiz', () => {
    // State
    const isLoading = ref(false)
    const savedQuiz = ref({
        level: 0,
        questions: []
    })

    // Action: Reset State (Penting untuk membersihkan data lama)
    const resetQuiz = () => {
        savedQuiz.value = { level: 0, questions: [] }
    }

    // Action: Save Quiz
    const saveGeneratedQuiz = async (payload) => {
        // 1. Validasi Payload
        if (!Array.isArray(payload) || payload.length === 0) {
            console.warn('Payload kosong atau bukan array')
            return { success: false, message: 'Tidak ada soal untuk disimpan.' }
        }

        isLoading.value = true

        try {
            // Simulasi API Delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            const batchLevel = payload[0].level

            const newQuestions = payload.map(element => ({
                question: element.question,
                key: element.key,
                method: element.method,
            }))

            // 4. Update State Sekaligus (Batch Update)
            // Update level global
            savedQuiz.value.level = batchLevel

            // Append (Menambahkan ke data yang sudah ada)
            // savedQuiz.value.questions.push(...newQuestions)

            // ATAU gunakan ini jika ingin REPLACE (Menimpa data lama):
            savedQuiz.value.questions = newQuestions

            return { success: true, message: 'Quiz berhasil disimpan ke Library!' }

        } catch (error) {
            console.error('Gagal menyimpan quiz:', error)
            return { success: false, message: 'Terjadi kesalahan sistem saat menyimpan.' }
        } finally {
            isLoading.value = false
        }
    }

    return {
        isLoading,
        savedQuiz,
        saveGeneratedQuiz,
        resetQuiz
    }
})