import { defineStore } from 'pinia';
import { readonly, ref } from 'vue';
import { useAuthStore } from './auth';
import type { Category } from '@/types';
import firebase from '@/firebaseGateway';

export const useBoardStore = defineStore('board', () => {

    const categories = ref([] as Category[]);
    const awaitingCategoryToEditId = ref(null as null | string);

    firebase.onBoardChange(() => { return useAuthStore().user?.uid ?? null; }, newCategories => categories.value = newCategories)

    function addCategory() {        
        awaitingCategoryToEditId.value = firebase.addCategory("New category");
    }

    function stopWaitingForCategoryToEdit(/*id: string*/) {
        /*if (awaitingCategoryToEditId.value == id) */awaitingCategoryToEditId.value = null;
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
        const authStore = useAuthStore();
        firebase.addUserVote(categoryId, ticketId, authStore.user!.uid);
    }

    function removeCurrentUserVote(categoryId: string, ticketId: string) {
        const authStore = useAuthStore();
        firebase.removeUserVote(categoryId, ticketId, authStore.user!.uid);
    }

    return { categories, awaitingCategoryToEditId: readonly(awaitingCategoryToEditId), addCategory, stopWaitingForCategoryToEdit, renameCategory, addTicket, removeTicket, addCurrentUserVote, removeCurrentUserVote };
})