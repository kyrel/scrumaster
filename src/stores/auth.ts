import { ref } from 'vue'
import { defineStore } from 'pinia'
import firebase from '@/firebaseGateway'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null as null | User);
    const gotInitialAuthState = ref(false);

    firebase.onAuthStateChanged((newUser) => {
        user.value = newUser;
        if (!gotInitialAuthState.value) gotInitialAuthState.value = true;
    });

    async function sendAuthLink(email: string) {
        await firebase.sendAuthLink(email);
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);        
    }

    function isAuthLink(link: string) {
        return firebase.isAuthLink(link)
    }

    async function signIn(email: string, link: string) {
        try {
            const result = await firebase.signIn(email, link)
            window.localStorage.removeItem('emailForSignIn');// Clear email from storage.            
            return result;
        }
        catch (error) {
            // Some error occurred, you can inspect the code: error.code
            // Common errors could be invalid email and invalid or expired OTPs.            
        }
    }

    function signOut() {
        return firebase.signOut();
    }

    return { user, gotInitialAuthState, sendAuthLink, isAuthLink, signIn, signOut }
})
