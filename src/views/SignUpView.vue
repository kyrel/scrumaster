<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const emailHasError = ref(false);
const latestEmail = ref("");
const latestResult = ref(null as null | boolean);
const actionInProgress = ref(false);

watchEffect(() => {
    if (authStore.gotInitialAuthState && authStore.user) router.replace("/");
})

watch(email, () => { emailHasError.value = false })

async function signUp() {
    if (!email.value || !email.value.includes("@")) {
        emailHasError.value = true;
        return;
    }
    emailHasError.value = false;
    console.log("sending signin link");
    try {
        actionInProgress.value = true;
        await authStore.sendAuthLink(email.value);
        actionInProgress.value = false;
        console.log("sent signin link");
        latestEmail.value = email.value;
        latestResult.value = true;
    }
    catch (error: any) {
        const errorCode = error.code; //TODO: proper notification or view
        const errorMessage = error.message;
        console.log("error sending signin link", errorCode, errorMessage);
        latestEmail.value = email.value;
        latestResult.value = false;
    }
}

</script>

<template>
    <form @submit.prevent="signUp" class="sign-up">
        <h2 class="sign-up__prompt">Let us send you (or your friend) an email invitation to join this board!</h2>
        <input class="sign-up__email" :class="{'sign-up__email--error': emailHasError}" type="email"
            v-model.trim="email" placeholder="you@example.com" />
        <button class="btn" :disabled="actionInProgress">Request access</button>
        <div class="sign-up__success" v-if="latestResult === true">
            <span class="sign-up__emoji">&#129395;</span>
            Please check the inbox (or spam folder!) of <strong>{{ latestEmail }}</strong> for the invitation.<br />
            Feel free to use the form again with another email address!
        </div>
        <div class="sign-up__fail" v-if="latestResult === false">
            <span class="sign-up__emoji">&#128575;</span>
            Unfortunately we couldn't invite <strong>{{ latestEmail }}</strong>. Please try another email address or
            contact us for support
        </div>
    </form>
</template>

<style scoped lang="scss">
@use "@/assets/shadows";

/* @define sign-up */
.sign-up {
    @include shadows.scru-shadow;

    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    padding: 12px 18px;
    border: 1px solid var(--surface3);
}

.sign-up__prompt {
    margin-bottom: 1rem;
}

.sign-up__email {
    margin-bottom: 0.5rem;
}

.sign-up__email--error {
    border: 1px solid var(--color-border-error);
}

.sign-up__success {
    border-radius: 4px;
    background-color: var(--surface-success);
    padding: 8px 12px;
    font-size: 0.8em;
    margin-top: 0.5rem;
}

.sign-up__fail {
    border-radius: 4px;
    background-color: var(--surface-error);
    padding: 8px 12px;
    font-size: 0.8em;
    margin-top: 0.5rem;
}

.sign-up__emoji {
    font-size: 1.4em;
}
</style>
