import VueRouter from 'vue-router';

// Define all the routes of our application
const routes = [
    {
        path: '/',
        // Rather than having to have separate import statements at the top of this page for each component
        // Here's a simple way we can directly make our components available
        component: () => import('@/AppCopy.vue'),
        name: 'home'
    },
    {
        path: '/admin',
        component: () => import('@/components/pages/auth/AdminPage.vue'),
        name: 'admin',
        // Note the addition of meta information
        meta: {
            requiresAdmin: true
        },
    },
    {
        // This is a route we can direct the user to if they try to access a part of the site they don't have privileges for
        path: '/denied',
        component: () => import('@/components/pages/auth/AccessDenied.vue'),
        name: 'denied'
    },
    {
        path: '/register',
        component: () => import('@/components/pages/auth/RegisterPage.vue'),
        name: 'register'
    },
    {
        path: '/login',
        component: () => import('@/components/pages/auth/LoginPage.vue'),
        name: 'login'
    },
    {
        path: '/diary',
        component: () => import('@/components/pages/DiaryPage.vue'),
        name: 'diary',
        meta: {
            requiresAuth: true
        }
    },
];

// Initialize our router
const router = new VueRouter({
    routes: routes,
    mode: 'history'
})

export default router;