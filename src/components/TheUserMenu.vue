<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import IconUser from './icons/IconUser.vue';
import { onClickOutside } from '@/composables/clickOutside';

const authStore = useAuthStore();

function signOut() {
    authStore.signOut();
}

const popupVisible = ref(false);
const el = ref(null as null | HTMLElement);

onClickOutside(el, () => { popupVisible.value = false; }, { precondition: () => popupVisible.value });

</script>

<template>
    <div ref="el" class="user-menu">
        <div class="user-menu__avatar" @click="popupVisible = !popupVisible">
            <IconUser />
        </div>
        <div v-if="popupVisible" class="user-menu__dropdown">
            <h3 class="user-menu__dropdown-email">
                {{ authStore.user?.email }}
            </h3>
            <button class="btn user-menu__sign-out-button" @click="signOut">
                Sign out
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "@/assets/shadows";

/* @define user-menu */
.user-menu {
    position: relative;
}

.user-menu__avatar {
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: grid;
    place-content: center;

    // border: 2px solid var(--text1);
    // border-radius: 12px;
}

.user-menu__dropdown {
    @include shadows.scru-shadow;

    position: absolute;
    right: 0;
    top: calc(100% + 8px);
    z-index: 99999;
    max-width: 325px;
    padding: 15px 10px;
    border: 1px solid var(--surface-accent);
    background-color: var(--surface-main);
}

.user-menu__dropdown-email {
    white-space: nowrap;
}

.user-menu__sign-out-button {
    white-space: nowrap;
    width: 100%;
}
</style>