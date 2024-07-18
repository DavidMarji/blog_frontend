import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import SignUp from '@/components/SignUp.vue';
import Home from '@/components/Home.vue';
import User from '@/components/User.vue';
import Blog from '@/components/Blog.vue';
import SearchResult from '@/components/SearchResult.vue';
import apiClient from './api';

const routes = [
    {
        path: '/',
        component: Login,
        name: 'LoginDefault'
    },
    {
        path: '/login',
        component: Login,
        name: 'Login'
    },
    {
        path: '/signUp',
        component: SignUp,
        name: 'SignUp'
    },
    {
        path: '/home',
        component: Home,
        name: 'Home',
    },
    {
        path: '/users/:username',
        component: User,
        name: 'User',
    },
    {
        path: '/blogs/:id/:pageNumber',
        component: Blog,
        name: 'Blog',
    },
    {
        path: '/result/:title',
        component: SearchResult,
        name: 'SearchResult',
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;