<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const latestEmail = ref("");
const invalidEmail = ref(false);
const invalidLink = ref(false);
const email = ref("");
const emailHasError = ref(false);
const requestEmailAddress = ref(false);
const actionInProgress = ref(false);

watch(email, () => { emailHasError.value = false })

async function doSignIn(email: string) {
    actionInProgress.value = true;
    const result = await authStore.signIn(email, window.location.href)
    actionInProgress.value = false;
    if (typeof result == 'string') {
        if (result == "auth/invalid-email") invalidEmail.value = true;
        else /*if (result == "auth/invalid-action-code")*/ invalidLink.value = true;
    }
    else router.replace("/")    
}

if (!authStore.isAuthLink(window.location.href)) router.replace("/")
const storedEmail = window.localStorage.getItem('emailForSignIn')

if (storedEmail) doSignIn(storedEmail); //awaiting leads to error
else requestEmailAddress.value = true;

function signUpConfirm() {
    if (!email.value || !email.value.includes("@")) {
        emailHasError.value = true;
        return;
    }
    invalidEmail.value = false;
    latestEmail.value = email.value;
    doSignIn(email.value);
}

//if (authStore.user) router.replace("/")
</script>

<template>
    <div class="error-notification" v-if="invalidLink">
        <h2 class="error-notification__header">Something went wrong!</h2>
        <p>
            Did you try to use the same link to sign in again?<br>
            Unfortunately those are one-timers, and also exprire with time. 
            Please <router-link to="/signup">request another one</router-link>.
        </p>
    </div>
    <form @submit.prevent="signUpConfirm" class="sign-up-confirm" v-else-if="requestEmailAddress">
        <h2 class="sign-up-confirm__prompt">Please enter your email address again to start using the board!</h2>
        <input class="sign-up-confirm__email" :class="{'sign-up-confirm__email--error': emailHasError}" type="email"
            v-model.trim="email" placeholder="you@example.com" />
        <button class="btn" :disabled="actionInProgress">Confirm</button>
        <div class="sign-up-confirm__fail" v-if="invalidEmail">
            <span class="sign-up-confirm__emoji">&#128575;</span>
            Looks like <strong>{{ latestEmail }}</strong> is not the one who has been invited. Did you enter the correct email address?
        </div>
    </form>
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

/* @define sign-up-confirm */
.sign-up-confirm {
    @include shadows.scru-shadow;

    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    padding: 12px 18px;
    border: 1px solid var(--surface3);
}

.sign-up-confirm__prompt {
    margin-bottom: 1rem;
}

.sign-up-confirm__email {
    margin-bottom: 0.5rem;
}

.sign-up-confirm__email--error {
    border: 1px solid var(--color-border-error);
}

.sign-up-confirm__fail {
    border-radius: 4px;
    background-color: var(--surface-error);
    padding: 8px 12px;
    font-size: 0.8em;
    margin-top: 0.5rem;
}

.sign-up-confirm__emoji {
    font-size: 1.4em;
}
</style>