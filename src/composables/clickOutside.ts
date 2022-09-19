import { onMounted, onUnmounted, ref, type Ref } from "vue";

export function useClickOutside(el: Ref<HTMLElement | null> | HTMLElement | null, callback: () => void, options: {
    stopPropagation?: boolean,
    precondition?: () => boolean
} | null) {
    const {
        stopPropagation = true,
        precondition
    } = options ?? {};
    const elRef = ref(el);

    function clickOutside(ev: MouseEvent) {
        if (precondition) {
            if (!precondition()) return;            
        }
        if (elRef.value && !(elRef.value === ev.target || elRef.value.contains(ev.target as HTMLElement))) {
            if (stopPropagation) ev.stopPropagation();
            callback();
        }
    }

    onMounted(() => { document.body.addEventListener("click", clickOutside, { capture: true }); });

    onUnmounted(() => { document.body.removeEventListener("click", clickOutside) });
}