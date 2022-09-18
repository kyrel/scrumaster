<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheConfirmationModal from '@/components/TheConfirmationModal.vue'
import TheToasts from '@/components/TheToasts.vue'
import IconScrew from '@/components/icons/IconScrew.vue';
import TheUserMenu from '@/components/TheUserMenu.vue';
import TheThemeSwitch from '@/components/TheThemeSwitch.vue';

import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

</script>

<template>
    <main v-if="authStore.gotInitialAuthState" class="page">
        <header class="page__header">
            <h1>
                ScruMaster
                <IconScrew class="page__header-icon" />
            </h1>
            <TheThemeSwitch class="page__theme-switch" />
            <TheUserMenu class="page__user" v-if="authStore.user" />
        </header>
        <RouterView />
    </main>
    <TheConfirmationModal />
    <TheToasts />
</template>

<style scoped>
/* @define page */
.page {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.page__header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
}

.page__header-icon {
    width: 30px;
}

.page__theme-switch {
    margin-left: auto;
}
</style>