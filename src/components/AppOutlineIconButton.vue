<template>
    <button type="button" class="btn outline-icon-button">
        <div class="outline-icon-button__icon-wrapper">
            <slot />
        </div>
    </button>
</template>
<style scoped lang="scss">
/* @define outline-icon-button */
.outline-icon-button {
    padding: 8px;
}

.outline-icon-button__icon-wrapper {
    width: 16px;
}
</style>