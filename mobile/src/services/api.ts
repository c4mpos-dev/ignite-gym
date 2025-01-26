import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.18.61:3333",
});