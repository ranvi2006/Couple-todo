import axios from "axios";

const API = axios.create({
  baseURL: "https://couple-todo-psa2.onrender.com", // backend URL
});

export default API;