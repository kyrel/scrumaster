import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUpView from '../views/SignUpView.vue'
import SignUpConfirmView from '../views/SignUpConfirmView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/signup', name: 'signup', component: SignUpView },
        { path: '/signupconfirm', name: 'signupconfirm', component: SignUpConfirmView }
        // { path: '/about', name: 'about', component: () => import('../views/AboutView.vue')}
    ]
})

export default router