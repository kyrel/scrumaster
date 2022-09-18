<script setup lang="ts">
import { useScruConfirmation } from '@/stores/scruConfirmation';
import BaseModal from './BaseModal.vue';
const scruConfirmation = useScruConfirmation();
</script>
<template>
    <BaseModal class="confirm-modal" @close="scruConfirmation.opened = false" v-if="scruConfirmation.opened">
        <h3 class="confirm-modal__header">            
            {{ scruConfirmation.message }}            
        </h3>
        <div class="confirm-modal__controls">
            <button class="btn" @click="scruConfirmation.confirmClicked">
                {{ scruConfirmation.confirmButtonText }}
            </button>
            <button class="btn" @click="scruConfirmation.cancelClicked">
                {{ scruConfirmation.cancelButtonText }}
            </button>
        </div>
    </BaseModal>
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