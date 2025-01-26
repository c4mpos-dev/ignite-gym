import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.18.61:3333",
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
})

export { api };