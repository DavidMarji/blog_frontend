import router from '@/router';

export const navigateToHome = function navigateToHome() {
    router.push('/home');
};

export const navigateToLogin = function navigateToLogin() {
    router.push('/login');
};

export const navigateToSignup = function navigateToSignup() {
    router.push('/signUp');
};

export const navigateToResult = function navigateToResult(title) {
    router.push(`/result/${title}`);
};

export const navigateToUserProfile = function navigateToUserProfile(username) {
    router.push(`/users/${username}`);
};

export const navigateToBlog = async function navigateToBlog(blogId, pageNumber) {
    await router.push(`/blogs/${blogId}/${pageNumber}`);
    router.go(0);
};

export const reloadPage = function reloadPage() {
    router.go(0);
};