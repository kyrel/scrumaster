<script setup lang="ts">
import { useConfirmation } from '@/stores/confirmation';
import AppModalLayout from './AppModalLayout.vue';
const confirmation = useConfirmation();
</script>
<template>
    <AppModalLayout class="confirm-modal" @close="confirmation.opened = false" v-if="confirmation.opened">
        <h3 class="confirm-modal__header">            
            {{ confirmation.message }}            
        </h3>
        <div class="confirm-modal__controls">
            <button class="btn" @click="confirmation.confirmClicked">
                {{ confirmation.confirmButtonText }}
            </button>
            <button class="btn" @click="confirmation.cancelClicked">
                {{ confirmation.cancelButtonText }}
            </button>
        </div>
    </AppModalLayout>
</template>
<style scoped>
/* @define confirm-modal */
.confirm-modal__header {
    margin-top: 0;
    margin-bottom: 10px;
    text-align: center;
}

.confirm-modal__controls {
    display: flex;
    justify-content: center;
    gap: 10px;
}
</style>