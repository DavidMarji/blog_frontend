import router from '@/router';

export const navigateToHome = function navigateToHome() {
    router.replace('/home');
};

export const navigateToLogin = function navigateToLogin() {
    router.replace('/login');
};

export const navigateToSignup = function navigateToSignup() {
    router.replace('/signUp');
};

export const navigateToResult = function navigateToResult(title) {
    router.replace(`/result/${title}`);
};

export const navigateToUserProfile = function navigateToUserProfile(username) {
    router.replace(`/users/${username}`);
};

export const navigateToBlog = function navigateToBlog(blogId, pageNumber) {
    router.replace(`/blogs/${blogId}/${pageNumber}`);
};

export const reloadPage = function reloadPage() {
    router.go(0);
};