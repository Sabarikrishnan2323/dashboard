import axios from "axios";

const API = axios.create({
  baseURL: "https://dashboard-backend-pv96.onrender.com/api/",
});

export default API;

