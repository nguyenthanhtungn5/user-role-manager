import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta?.env?.VITE_API_BASE ||
    process.env.VUE_APP_API_BASE ||
    "http://localhost:8888",
});
