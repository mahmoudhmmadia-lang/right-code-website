import axios from "axios"

const defaultApiUrl = import.meta.env.DEV ? "http://localhost:5000/api" : "/api"

export const myAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? defaultApiUrl,
  timeout: 15_000,
})
