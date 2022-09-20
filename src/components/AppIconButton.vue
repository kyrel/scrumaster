<script setup lang="ts">
    withDefaults(defineProps<{size?: "normal" | "small"}>(), {size: "normal"});
</script>
<template>
    <button type="button" class="icon-button">
        <div :class="{'icon-button__icon-wrapper': size == 'normal', 'icon-button__icon-wrapper--small': size == 'small'}">
            <slot />
        </div>
    </button>
</template>
<style scoped lang="scss">
/* @define icon-button */
.icon-button {
    display: inline-block;
    border: none;
    background-color: transparent;
    color: var(--text1);
    opacity: 0.5;
    cursor: pointer;
    padding: 0;

    &:hover {
        opacity: 1;
    }

    &:active {
        color: var(--text2);
        /*transform: translate(1px, 1px);*/
    }
}

.icon-button__icon-wrapper {
    width: 16px;
}

.icon-button__icon-wrapper--small {
    width: 12px;
}
</style>