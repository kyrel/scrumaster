<template>
    <button type="button" class="btn outline-icon-button">
        <div class="icon-button__icon-wrapper">
            <slot></slot>
        </div>
    </button>
</template>
<style scoped lang="scss">
.outline-icon-button {
    padding: 8px;
}
.icon-button__icon-wrapper {
    width: 16px;
}
</style>