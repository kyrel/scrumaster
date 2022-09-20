import { createRouter, createWebHistory } from 'vue-router';
import BoardView from '@/views/BoardView.vue';
import SignUpView from '@/views/SignUpView.vue';
import SignUpConfirmView from '@/views/SignUpConfirmView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: BoardView },
        { path: '/signup', name: 'signup', component: SignUpView },
        { path: '/signupconfirm', name: 'signupconfirm', component: SignUpConfirmView }        
    ]
});

export default router;