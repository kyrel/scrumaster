import { computed, shallowRef } from "vue";

export function useAutoResetRef<T>(defaultValue: T, resetMs: number) {
    const internalRef = shallowRef(defaultValue);
    let timer = null as null | ReturnType<typeof setTimeout>
    return computed({
        get() { return internalRef.value },

        set(newValue: T) {
            if (!timer) {
                internalRef.value = newValue;
                timer = setTimeout(() => {
                    internalRef.value = defaultValue;
                    timer = null;
                }, resetMs);
            }
        }
    })
}