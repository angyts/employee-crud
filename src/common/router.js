import VueRouter from 'vue-router';
import store from './store';

// Define all the routes of our application
const routes = [
    {
        path: '/',
        // Rather than having to have separate import statements at the top of this page for each component
        // Here's a simple way we can directly make our components available
        component: () => import('@/AppCopy.vue'),
        name: 'home'
    },
/*
// Won't be using this
    {
        path: '/admin',
        component: () => import('@/components/pages/auth/AdminPage.vue'),
        name: 'admin',
        // Note the addition of meta information
        meta: {
            requiresAdmin: true
        },
    },
*/
/*
// Just throw them out
    {
        // This is a route we can direct the user to if they try to access a part of the site they don't have privileges for
        path: '/denied',
        component: () => import('@/components/pages/auth/AccessDenied.vue'),
        name: 'denied'
    },
*/

    /*

// Just Register on the Firebase page
    {
        path: '/register',
        component: () => import('@/components/pages/auth/RegisterPage.vue'),
        name: 'register'
    },

*/
    {
        path: '/l',
        component: () => import('@/components/pages/auth/LoginPage.vue'),
        name: 'login'
    },
    {
        path: '/diary',
        component: () => import('@/components/pages/DiaryPage.vue'),
        name: 'diary',
        meta: {
            requiresAdmin: true,
            title: 'You Have Found the Secret Diary',
        }
    },
];

// Initialize our router
const router = new VueRouter({
    routes: routes,
    mode: 'history'
})

// beforeEach provides a way to execute some code before a route is resolved
router.beforeEach(async (to, from, next) => {

    // Exact the meta information from our routes
    // Ref: https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    // check if it is admin
    let isAdmin = store.state.isAdmin;

    // First we want to restrict any `requiresAdmin` routes so that only admin users can visit those routes
    // I'm specifying admin users by hard-coding an array of emails - this is a very ”quick and dirty” way to do this
    // To improve, we should have a `users` collection where we can store additional information
    // such as a boolean `admin` field, or a `roles` field
    // However, for the purposes of this prototype, it provides a way to demonstrate admin functionality
    if (requiresAdmin && (!isAdmin)) {
        // If they're trying to access a requiresAdmin route and they're not an admin, they get sent to the "Access Denied" page
        next({ name: 'home' });
    }

    else {
        // In all other circumstances, send them to the route they requested
        next();
    }
});

/*
// Original Code

// beforeEach provides a way to execute some code before a route is resolved
router.beforeEach(async (to, from, next) => {

    // Exact the meta information from our routes
    // Ref: https://router.vuejs.org/guide/advanced/meta.html#route-meta-fields
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    // Load our user
    let user = await app.api.getUser();

    // Commit our user information to the Vuex store
    store.commit('setUser', user);

    // First we want to restrict any `requiresAdmin` routes so that only admin users can visit those routes
    // I'm specifying admin users by hard-coding an array of emails - this is a very ”quick and dirty” way to do this
    // To improve, we should have a `users` collection where we can store additional information
    // such as a boolean `admin` field, or a `roles` field
    // However, for the purposes of this prototype, it provides a way to demonstrate admin functionality
    let admins = ['susanbuck@fas.harvard.edu'];
    if (requiresAdmin && (!user || !admins.includes(user.email))) {
        // If they're trying to access a requiresAdmin route and they're not an admin, they get sent to the "Access Denied" page
        next({ name: 'denied' });
    }
    else if (requiresAuth && !user) {
        // If they’re trying to access a requiresAuth route and they're not logged in, they get sent to the login page
        next({ name: 'login' });
    }
    else if (user && ['login', 'register'].includes(to.name)) {
        // If they're trying to access login or register page and they're already logged in, redirect them home
        next({ name: 'home' });
    }
    else {
        // In all other circumstances, send them to the route they requested
        next();
    }
});
*/

export default router;