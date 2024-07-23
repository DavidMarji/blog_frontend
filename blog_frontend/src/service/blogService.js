import apiClient from "../api";

export const getAllPublishedBlogs = async () => {
    const response = await apiClient.get('/blogs/', {});
    return response.data;
};

export const getBlogByTitle = async (title) => {
    const url = `/blogs/titles/${title}/`;
    const encoded = encodeURI(url);
    const response = await apiClient.get(encoded);
    return response.data;
};

export const getBlogById = async (id) => {
    const response = await apiClient.get(`/blogs/${id}/`, {});
    return response.data;
};

export const createBlog = async (title) => {
    const response = await apiClient.post(`/blogs/`, {
        'title' : title
    });

    return response.data;
};

export const publishBlog = async (id) => {
    const response = await apiClient.put(`/blogs/${id}/publish/`, {});
    return response.data;
};

export const unpublishBlog = async (id) => {
    const response = await apiClient.put(`/blogs/${id}/unpublish/`, {});
    return response.data;
};

export const updateBlogTitle = async (id, title) => {
    const response = await apiClient.put(`/blogs/${id}/`, {
        'title' : title
    });
    return response.data;
};

export const deleteBlog = async (id) => {
    const response = await apiClient.delete(`/blogs/${id}/`, {});
    return response.data;
};

export const getAllUserBlogs = async (username) => {
    const response = await apiClient.get(`/accounts/${username}/blogs/`);
    return response.data;
};

export const getAllUserUnpublishedBlogs = async (username) => {
    const response = await apiClient.get(`/accounts/${username}/blogs/unpublished/`, {});
    return response.data;
};

// user profile
export const getAllUserPublishedBlogs = async (username) => {
    const response = await apiClient.get(`/accounts/${username}/blogs/published/`, {});
    return response.data;
};