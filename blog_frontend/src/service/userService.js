import apiClient from "../api";
import { setAuthHeader } from "../api"

export const login = async (username, password) => {
    // if(localStorage.getItem("userSession")) localStorage.removeItem("userSession");
    const response = await apiClient.post('/accounts/login/', {
        "username" : username, 
        "password" : password
    });
    localStorage.setItem('userSession', response.data);
    setAuthHeader();
    return response.data;
};

export const signUp = async function signUp (username, email, password) {
    // if(localStorage.getItem("userSession")) localStorage.removeItem("userSession");
    const response = await apiClient.post('/accounts/signup/', {
        "username" : username, 
        "email" : email, 
        "password" : password
    });
    localStorage.setItem('userSession', response.data);
    setAuthHeader();
    return response.data;
};  

export const getCurrentUserProfile = async () => {
    const response = await apiClient.get(`/accounts/session/me/`);
    return response.data;
}

export const getUserProfile = async (username) => {
    const response = await apiClient.get(`/accounts/${username}/`);
    return response.data;
};

export const getUsers = async (username) => {
    const response = await apiClient.get(`/accounts/users/${username}/`);
    return response.data;
}

export const deleteUser = async (username) => {
    const response = await apiClient.delete(`/accounts/${username}/`, {});
    return response.data;
}