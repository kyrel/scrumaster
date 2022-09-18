<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const hasError = ref(false);

async function doSignIn(email: string) {
    const result = await authStore.signIn(email, window.location.href)
    if (result) router.replace("/")
    else hasError.value = true
}

if (!authStore.isAuthLink(window.location.href)) router.replace("/")
const storedEmail = window.localStorage.getItem('emailForSignIn')

if (storedEmail) doSignIn(storedEmail); //awaiting leads to error

//if (authStore.user) router.replace("/")
</script>

<template>
    <div class="error-notification" v-if="hasError">
        <h2 class="error-notification__header">Something went wrong!</h2>
        <p>
            Did you try to use the same link to sign in again?<br>
            Unfortunately those are one-timers. Please <router-link to="/signup">request another one</router-link>.
        </p>
    </div>
</template>

<style scoped lang="scss">
@use "@/assets/shadows";

/* @define error-notification  */
.error-notification {
    @include shadows.scru-shadow;

    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    padding: 12px 18px;
    border: 1px solid var(--surface3);
}

.error-notification__header {
    margin-bottom: 1rem;
}
</style>