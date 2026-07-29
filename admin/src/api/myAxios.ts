import axios from "axios";

export const myAxios = axios.create({
  baseURL:
    import.meta.env.VITE_MODE === "DEV"
      ? import.meta.env.VITE_DEV_URL
      : import.meta.env.VITE_PROD_URL,
});
