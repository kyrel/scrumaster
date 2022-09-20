<script setup lang="ts">
import IconCross from "./icons/IconCross.vue";
defineEmits({ "close": null });
</script>
<template>
    <div class="modal-backdrop">
        <div class="modal">
            <span class="modal__close" @click="$emit('close')">
                <IconCross />
            </span>
            <slot />
        </div>
    </div>
</template>
<style scoped lang="scss">
/* @define modal-backdrop */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: auto;
    background-color: rgba(0 0 0 / 70%);
    z-index: 999;
}

/* @define modal */
.modal {
    position: relative;
    background-color: var(--surface-main);
    margin: 3rem auto;
    padding: 20px;
    width: 400px;
    max-width: 90%;
}

.modal__close {
    position: absolute;
    top: -24px;
    right: 0;
    color: var(--over-backdrop1);
    width: 16px;
    display: inline-block;

    &:hover,
    &:focus {
        color: var(--over-backdrop2);
        cursor: pointer;
    }
}
</style>