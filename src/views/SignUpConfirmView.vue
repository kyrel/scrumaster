<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

async function doSignIn(email: string) {
    const result = await authStore.signIn(email, window.location.href)
    if (result) router.replace("/")
}

if (!authStore.isAuthLink(window.location.href)) router.replace("/")
const storedEmail = window.localStorage.getItem('emailForSignIn')

if (storedEmail) doSignIn(storedEmail); //awaiting leads to error

//if (authStore.user) router.replace("/")
</script>

<template>    
</template>