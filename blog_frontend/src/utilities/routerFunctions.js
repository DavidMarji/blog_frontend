import { useRouter } from 'vue-router';
const router = useRouter();

export const navigateToHome = function navigateToHome() {
    router.push('/home');
}
export const navigateToLogin = function navigateToLogin() {
    router.push('/login');
}
export const navigateToSignup = function navigateToSignup() {
    router.push('/signUp');
}
export const navigateToResult = function navigateToResult(title) {
    router.push(`/result/:${title}`);
}
export const navigateToUserProfile = function navigateToUserProfile(username) {
    router.push(`/users/${username}`);
}
export const navigateToBlog = function navigateToBlog(blogId, pageNumber) {
    router.push(`/blogs/${blogId}/${pageNumber}`);
}