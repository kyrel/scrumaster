<script setup lang="ts">import { ref, watch } from 'vue';

const emit = defineEmits({ "add": null });

const text = ref("");
const textHasError = ref(false);

watch(text, () => { textHasError.value = false; });

function tryAdd() {
    if (!text.value) {
        textHasError.value = true;
        return;
    }
    textHasError.value = false;
    emit("add", text.value);
    text.value = "";
}
</script>
<template>
    <form class="add-ticket" @submit.prevent="tryAdd">
        <textarea
            v-model.trim="text" class="add-ticket__input" :class="{'add-ticket__input--error': textHasError}" 
            placeholder="Type text for the new ticket here..." rows="4"
        />        
        <button class="btn add-ticket__button">
            Add ticket
        </button>
    </form>
</template>
<style scoped>
/* @define add-ticket */
.add-ticket__input {
    width: 100%;
    resize: none;
}

.add-ticket__input--error {
    border: 1px solid var(--color-border-error);
}
</style>