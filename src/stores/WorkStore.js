import { reactive } from "vue";

const loadInitialState = () => {
    const storedValue = sessionStorage.getItem('isWorkMode');

    if (storedValue === null) {
        return false;
    }

    return JSON.parse(storedValue);
};

export const workStore = reactive({
    isWorkMode: loadInitialState(),

    enterWorkMode() {
        this.isWorkMode = true;
        sessionStorage.setItem('isWorkMode', JSON.stringify(true));
    },

    exitWorkMode() {
        this.isWorkMode = false;
        sessionStorage.setItem('isWorkMode', JSON.stringify(false));
    },
});