<script setup lang="ts">
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useBoardStore } from '@/stores/board';
import { useAuthStore } from '@/stores/auth';
import BoardViewCategory from '@/components/BoardViewCategory.vue';
import AppOutlineIconButton from '@/components/AppOutlineIconButton.vue';

const authStore = useAuthStore();
const boardStore = useBoardStore();
const router = useRouter();

watchEffect(() => {
    if (authStore.gotInitialAuthState && !authStore.user) router.replace("/signup");
});

</script>

<template>
    <ul v-if="boardStore.gotInitialState" class="category-list">
        <TransitionGroup name="category-transition-">
            <li v-for="category of boardStore.categories" :key="category.id" class="category-list__item">
                <BoardViewCategory :category="category" />
            </li>
        </TransitionGroup>
        <li :key="''" class="category-list__item">
            <button
                v-if="boardStore.categories.length == 0" class="btn" title="Add your first category"
                @click="boardStore.addCategory()"
            >
                <strong>Add your team's first category to start the fun!</strong>
            </button>
            <button
                v-else-if="boardStore.categories.length == 1" class="btn" title="Add another category"
                @click="boardStore.addCategory()"                
            >
                <strong>Add another category here</strong>
            </button>
            <AppOutlineIconButton v-else title="Add another category" @click="boardStore.addCategory()">
                <strong>+</strong>
            </AppOutlineIconButton>
        </li>
    </ul>
</template>

<style scoped lang="scss">
/* @define category-transition */
.category-transition--enter-active,
.category-transition--leave-active {
    transition: all 0.25s ease;
}

.category-transition--enter-from,
.category-transition--leave-to {
    opacity: 0;
    transform: translateY(-60px);
}

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

    &:last-child {
        scroll-snap-align: end;
    }
}
</style>