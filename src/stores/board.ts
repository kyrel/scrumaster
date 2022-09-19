import { defineStore } from 'pinia';
import { readonly, ref } from 'vue';
import { useAuthStore } from './auth';
import type { Category } from '@/types';
import firebase from '@/firebaseGateway';

export const useBoardStore = defineStore('board', () => {

    const categories = ref([] as Category[]);
    const gotInitialState = ref(false);
    const awaitingCategoryToEditId = ref(null as null | string);

    firebase.onBoardChange(() => { return useAuthStore().user?.uid ?? null; }, newCategories => {
        categories.value = newCategories;
        if (!gotInitialState.value) gotInitialState.value = true;
    })

    function addCategory() {
        awaitingCategoryToEditId.value = firebase.addCategory("New category");
    }

    function stopWaitingForCategoryToEdit(/*id: string*/) {
        /*if (awaitingCategoryToEditId.value == id) */awaitingCategoryToEditId.value = null;
    }

    function renameCategory(id: string, name: string) {
        firebase.renameCategory(id, name);
    }

    function removeCategory(id: string) {
        firebase.removeCategory(id);
    }

    function addTicket(categoryId: string, text: string) {
        firebase.addTicket(categoryId, text);
    }

    function editTicket(categoryId: string, ticketId: string, text: string) {
        firebase.editTicket(categoryId, ticketId, text);
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

    return {
        categories, gotInitialState, 
        awaitingCategoryToEditId: readonly(awaitingCategoryToEditId), addCategory, stopWaitingForCategoryToEdit, 
        renameCategory, removeCategory, addTicket, editTicket, removeTicket, addCurrentUserVote, removeCurrentUserVote
    };
})