import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import SignUp from '@/components/SignUp.vue';
// import Home from '@/components/Home.vue';
// import User from '@/components/User.vue';
// import Blog from '@/components/Blog.vue';

const routes = [
    {
        path: '/',
        component: Login
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/signUp',
        component: SignUp
    },
    // {
    //     path: '/home',
    //     component: Home
    // },
    // {
    //     path: '/users/:username',
    //     component: User
    // },
    // {
    //     path: '/blogs/:id',
    //     component: Blog
    // }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;