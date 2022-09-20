import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useConfirmation = defineStore('confirmation', () => {
    const opened = ref(false);
    const message = ref("");
    const confirmButtonText = ref("");
    const cancelButtonText = ref("");

    let callback = null as (() => void) | null;
    let cancelCallback = null as (() => void) | null | undefined;
    

    function open(msg: string, cb: () => void, options?: { cancelCallback?: () => void, confirmButtonText?: string, cancelButtonText?: string }) {
        message.value = msg;
        opened.value = true;
        callback = cb;
        cancelCallback = options?.cancelCallback;
        confirmButtonText.value = options?.confirmButtonText || "Yes";
        cancelButtonText.value = options?.cancelButtonText || "No";
    }

    function confirmClicked() {
        if (callback) callback();
        opened.value = false;
    }

    function cancelClicked() {
        if (cancelCallback) cancelCallback();
        opened.value = false;
    }

    return { opened, message, confirmButtonText, cancelButtonText, open, confirmClicked, cancelClicked };
});