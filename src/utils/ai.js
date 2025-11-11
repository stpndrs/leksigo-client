import axios from "axios";

const ai = axios.create({
    baseURL: import.meta.env.VITE_APP_AI_URL + '',
    withCredentials: true
});

export default ai