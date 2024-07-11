import apiClient from "../api";

export const login = async (username, password) => {
    const response = await apiClient.post('/accounts/login/', {
        "username" : username, 
        "password" : password
    });
    return localStorage.setItem('userSession', response.data);
};

export const signUp = async function signUp (username, email, password) {
    const response = await apiClient.post('/accounts/signup/', {
        "username" : username, 
        "email" : email, 
        "password" : password
    });
    return localStorage.setItem('userSession', response.data);
};  

export const getUserProfile = async (username) => {
    const response = await apiClient.get(`/accounts/${username}/` , {});
    return response.data;
};

export const deleteUser = async (username) => {
    const response = await apiClient.delete(`/accounts/${username}/`, {});
    return response.data;
}