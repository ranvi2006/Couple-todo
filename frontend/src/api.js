import axios from "axios";

const API = axios.create({
  baseURL: "https://couple-todo-psa2.onrender.com/api", // backend URL
});

export default API;