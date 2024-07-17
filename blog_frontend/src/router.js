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
        meta: { requiresAuth : true }
    },
    {
        path: '/users/:username',
        component: User,
        name: 'User',
        meta: { requiresAuth : true }
    },
    {
        path: '/blogs/:id/:pageNumber',
        component: Blog,
        name: 'Blog',
        meta: { requiresAuth : true }
    },
    {
        path: '/result/:title',
        component: SearchResult,
        name: 'SearchResult',
        meta: { requiresAuth : true }
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

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        try {
            const response = await apiClient.get('/authenticate'); 
            if (response.status === 200) {
                next();
            } 
            else {
                console.log(response.status);
                next('/login');
                window.location.href = "/login";
            }
        } 
        catch (error) {
            console.log(error);
            next('/login');
            window.location.href = "/login";
        }
    } 
    else {
        next();
    }
});

export default router;