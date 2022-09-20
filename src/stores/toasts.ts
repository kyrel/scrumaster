import { acceptHMRUpdate, defineStore } from "pinia";

export type ToastStyle = "error" | "success" | "warning" | "info" | "none";

let nextId = 1;

export interface Toast {
    id: string;
    message: string;
    style: ToastStyle;
}

export const useToasts = defineStore("toasts", {
    state: () => ({
        items: [] as Toast[]
    }),

    actions: {
        notify(message: string, style: ToastStyle) {
            //const id = uuid();
            const toast = { message, style, id: nextId.toString() };
            nextId++;
            this.items.push(toast);
            setTimeout(() => { this.remove(toast); }, 3000);
        },

        show(message: string) {
            this.notify(message, "none");
        },

        // Maybe we'll need that later
        /*success(message: string) {
            this.notify(message, "success");
        },

        error(message: string) {
            this.notify(message, "error");
        },

        warning(message: string) {
            this.notify(message, "warning");
        },

        info(message: string) {
            this.notify(message, "info");
        },*/

        remove(toast: Toast) {
            const index = this.items.indexOf(toast);
            if (index > -1) {
                this.items.splice(index, 1);
            }
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useToasts, import.meta.hot));
}