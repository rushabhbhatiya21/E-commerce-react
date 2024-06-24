import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseurl = "http://localhost:8081";

const api = axios.create({
    withCredentials: true,
    baseURL: baseurl,
    
})

api.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401 && error.response.data['message'] == "Not authorized") {
        console.log(error)
        localStorage.setItem('Failed', true)
        window.location.href = '/signin';
      }
    });

export const getItems = () => {
    return api.get('items');
} 

export const login = (username, password) => {
    return api.post('login', {username, password})
}

// export


export default api;