import { useRouter } from 'vue-router';
const router = useRouter();

export default {
    navigateToHome : function navigateToHome() {
        router.push('/home');
    },
    navigateToLogin : function navigateToLogin() {
        router.push('/login');
    },
    navigateToSignup : function navigateToSignup() {
        router.push('/signUp');
    },
    navigateToResult : function navigateToResult(title) {
        router.push(`/result/:${title}`);
    },
    navigateToUserProfile : function navigateToUserProfile(username) {
        router.push(`/users/${username}`);
    },
    navigateToBlog : function navigateToBlog(blogId, pageNumber) {
        router.push(`/blogs/${blogId}/${pageNumber}`);
    }
  }