import apiClient from "../api";

export const saveImage = async (blogId, pageNumber, formData) => {
    const response = await apiClient.post(`/blogs/${blogId}/pages/${pageNumber}/images/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
}

export const deleteImage = async (blogId, pageNumber, imageId) => {
    const response = await apiClient.delete(`/blogs/${blogId}/pages/${pageNumber}/images/${imageId}`, {});
    return response.data;
}

export const getPageImages = async (blogId, pageNumber) => {
    const response = await apiClient.get(`/blogs/${blogId}/pages/${pageNumber}/images/`)
}