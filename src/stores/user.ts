import { ref } from 'vue'
import { defineStore } from 'pinia'
import firebase from '@/firebaseGateway'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    const userUid = ref(null as null | string)
    const userEmail = ref(null as null | string)
    const gotInitialAuthState = ref(false)

    function setUser(user: User | null) {
        if (user) {
            //console.log("user logged in")
            userUid.value = user.uid
            userEmail.value = user.email
        } else {
            //console.log("user not logged in")
            userUid.value = null
            userEmail.value = null
        }
    }

    firebase.onAuthStateChanged((user) => {
        setUser(user);
        if (!gotInitialAuthState.value) gotInitialAuthState.value = true
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
            console.log("signing in", email)
            const result = await firebase.signIn(email, link)
            console.log("signed in", email)
            window.localStorage.removeItem('emailForSignIn');// Clear email from storage.
            // You can access the new user via result.user
            // Additional user info profile not available via:
            // result.additionalUserInfo.profile == null
            // You can check if the user is new or existing:
            // result.additionalUserInfo.isNewUser
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

    return { userUid, userEmail, gotInitialAuthState, sendAuthLink, isAuthLink, signIn, signOut }
})
