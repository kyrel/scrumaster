<script setup lang="ts">
import { useBoardStore } from '@/stores/board';
import { useAuthStore } from '@/stores/auth';
import { watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import CategoryPartialView from '../components/CategoryPartialView.vue';
import ScruOutlineIconButton from '../components/ScruOutlineIconButton.vue';

const authStore = useAuthStore();
const boardStore = useBoardStore();
const router = useRouter();

watchEffect(() => {
    if (authStore.gotInitialAuthState && !authStore.user) router.replace("/signup")
})

</script>

<template>
    <ul class="category-list" v-if="boardStore.gotInitialState">
        <TransitionGroup name="category-transition-">
            <li v-for="category of boardStore.categories" :key="category.id" class="category-list__item">
                <CategoryPartialView :category="category" />
            </li>
        </TransitionGroup>
        <li class="category-list__item" :key="''">
            <button v-if="boardStore.categories.length == 0" class="btn" @click="boardStore.addCategory()"
                title="Add your first category">
                <strong>Add your team's first category to start the fun!</strong>
            </button>
            <button v-else-if="boardStore.categories.length == 1" class="btn" @click="boardStore.addCategory()"
                title="Add another category">
                <strong>Add another category here</strong>
            </button>
            <ScruOutlineIconButton v-else @click="boardStore.addCategory()" title="Add another category">
                <strong>+</strong>
            </ScruOutlineIconButton>
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
    /*margin-left: auto;
    margin-right: auto;*/
}

.category-list__item {
    scroll-snap-align: center;

    &:last-child {
        scroll-snap-align: end;
    }
}
</style>