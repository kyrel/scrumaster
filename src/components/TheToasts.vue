<script setup lang="ts">
import { useToasts } from '@/stores/toasts';
import IconCross from './icons/IconCross.vue';

const toasts = useToasts();
</script>
<template>
    <div class="toasts">
        <TransitionGroup name="toasts-transition-">
            <div v-for="toast in toasts.items" :key="toast.id" class="toast" :class="'alert'+toast.style">
                <div>{{ toast.message }}</div>
                <!-- <button class="btn toast__dismiss-btn" @click="toasts.remove(toast)"><div class="toast__dismiss"><IconCross /></div></button> -->
            </div>
        </TransitionGroup>
    </div>
</template>
<style scoped>
/* @define toasts */
.toasts {
    position: fixed;
    left: 50%;
    align-items: center;
    transform: translateX(-50%);
    bottom: 10px;
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    width: 90%;
    min-width: 200px;
    max-width: 480px;
}

/* @define toast */
.toast {
    border-radius: 4px;
    background-color: var(--surface1);
    padding: 12px 16px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
}

.toast__dismiss-btn {
    padding: 2px 6px;
}

.toast__dismiss {
    width: 10px;
    cursor: pointer;
}

/* @define toasts-transition */
.toasts-transition--enter-active,
.toasts-transition--leave-active {
    transition: all 0.5s ease;
}

.toasts-transition--enter-from,
.toasts-transition--leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
