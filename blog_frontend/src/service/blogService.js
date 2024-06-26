import apiClient from "../api";

export const getAllPublishedBlogs = async () => {
    return await apiClient.get('/blogs/all/', {});
};

export const getBlogByTitle = async (title) => {
    return await apiClient.get(`/blogs/titles/${title}/`, {});
};

export const getBlogById = async (id) => {
    return await apiClient.get(`/blogs/${id}/`, {});
};

export const createBlog = async (title) => {
    return await apiClient.post(`/blogs/`, {
        'title' : title
    });
};

export const publishBlog = async (id) => {
    return await apiClient.put(`/blogs/${id}/publish/`, {});
};

export const unpublishBlog = async (id) => {
    return await apiClient.put(`/blogs/${id}/publish/`, {});
};

export const updateBlogTitle = async (id, title) => {
    return await apiClient.put(`/blogs/${id}/${title}/`, {});
};

export const deleteBlog = async (id) => {
    return await apiClient.delete(`/blogs/${id}/`, {});
};

export const getAllCurrentUserBlogs = async () => {
    return await apiClient.get('/accounts/current/blogs/all/', {});
};

export const getAllCurrentUserUnpublishedBlogs = async () => {
    return await apiClient.get('/accounts/current/blogs/unpublished/all/', {});
};

// user profile
export const getAllUserPublishedBlogs = async (username) => {
    return await apiClient.get(`/accounts/${username}/blogs/published/all/`, {});
};