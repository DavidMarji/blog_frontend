import apiClient from "../api";

export const getAllPublishedBlogs = async () => {
    const response = await apiClient.get('/blogs/all/', {});
    return response.data;
};

export const getBlogByTitle = async (title) => {
    const response = await apiClient.get(`/blogs/titles/`, {
        'title' : title
    });
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
    const response = await apiClient.put(`/blogs/${id}/publish/`, {});
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
    const response = await apiClient.get(`/accounts/${username}/blogs/all/`);
    return response.data;
};

export const getAllUserUnpublishedBlogs = async (username) => {
    const response = await apiClient.get(`/accounts/${username}/blogs/unpublished/all/`, {});
    return response.data;
};

// user profile
export const getAllUserPublishedBlogs = async (username) => {
    const response = await apiClient.get(`/accounts/${username}/blogs/published/all/`, {});
    return response.data;
};