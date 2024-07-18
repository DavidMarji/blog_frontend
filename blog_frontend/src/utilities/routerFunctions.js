import router from '@/router';
import { restVue } from './resetVue';

export const navigateToHome = function navigateToHome() {
    restVue();
    router.push('/home');
}
export const navigateToLogin = function navigateToLogin() {
    restVue();
    router.push('/login');
}
export const navigateToSignup = function navigateToSignup() {
    restVue();
    router.push('/signUp');
}
export const navigateToResult = function navigateToResult(title) {
    restVue();
    router.push(`/result/${title}`);
}
export const navigateToUserProfile = function navigateToUserProfile(username) {
    restVue();
    router.push(`/users/${username}`);
}
export const navigateToBlog = function navigateToBlog(blogId, pageNumber) {
    restVue();
    router.push(`/blogs/${blogId}/${pageNumber}`);
}