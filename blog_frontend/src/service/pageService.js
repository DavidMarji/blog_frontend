import apiClient from "../api";

export const getSpecificPage = async (blogId, pageNumber) => {
    const response = await apiClient.get(`/blogs/${blogId}/pages/${pageNumber}/`, {});
    return response.data;
};

export const createNewPage = async (blogId) => {
    const response = await apiClient.post(`/blogs/${blogId}/pages/`);
    return response.data;
};

export const updatePage = async (blogId, pageNumber, newPageContent) => {
    const response = await apiClient.put(`/blogs/${blogId}/pages/${pageNumber}/`, {
        "newPageContent" : newPageContent
    });
    return response.data;
};

export const deletePage = async (blogId, pageNumber) => {
    const response = await apiClient.delete(`/blogs/${blogId}/pages/${pageNumber}/`, {});
    return response.data;
}