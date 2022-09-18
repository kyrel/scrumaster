import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import type { Category } from '@/types'
import firebase from '@/firebaseGateway'

export const useBoardStore = defineStore('board', () => {

    const categories = ref([] as Category[])

    firebase.onBoardChange(() => { return useAuthStore().userUid; }, newCategories => categories.value = newCategories)

    function addCategory(name: string) {
        firebase.addCategory(name);        
    }

    function renameCategory(id: string, name: string) {
        firebase.renameCategory(id, name);
    }

    function addTicket(categoryId: string, text: string) {
        firebase.addTicket(categoryId, text);        
    }

    function removeTicket(categoryId: string, ticketId: string) {
        firebase.removeTicket(categoryId, ticketId);                
    }

    function addCurrentUserVote(categoryId: string, ticketId: string) {
        const authStore = useAuthStore()
        firebase.addUserVote(categoryId, ticketId, authStore.userUid!)        
    }

    function removeCurrentUserVote(categoryId: string, ticketId: string) {
        const authStore = useAuthStore()
        firebase.removeUserVote(categoryId, ticketId, authStore.userUid!)        
    }

    return { categories, addCategory, renameCategory, addTicket, removeTicket, addCurrentUserVote, removeCurrentUserVote }
})