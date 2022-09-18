<script setup lang="ts">
import { useBoardStore } from '@/stores/board';
import { useAuthStore } from '@/stores/auth';
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import CategoryPartialView from '../components/CategoryPartialView.vue';

const authStore = useAuthStore();
const boardStore = useBoardStore();
const router = useRouter();

watchEffect(() => {
    if (authStore.gotInitialAuthState && !authStore.user) router.replace("/signup")
})

</script>

<template>
    <ul class="category-list">
        <li v-for="category of boardStore.categories" :key="category.id" class="category-list__item">
            <CategoryPartialView :category="category" />
        </li>
        <li class="category-list__item">
            <button class="btn" @click="boardStore.addCategory()">Add category</button>
        </li>
    </ul>
</template>

<style scoped>
/* @define category-list */
.category-list {
    list-style: none;
    display: flex;
    gap: 12px;
    padding: 0;
    height: 100%;
    max-width: 100%;
    overflow-x: auto;
    scroll-snap-type: x proximity;
}

.category-list__item {
    scroll-snap-align: center;
}
</style>