<script setup lang="ts">

import { computed } from 'vue';

const props = defineProps<{
    modelValue?: boolean,
    onTitle: string,
    offTitle: string
}>();
const emit = defineEmits({ 'update:modelValue': null });
const isOn = computed(()=>!!props.modelValue);
function toggleIsOn() {
    emit('update:modelValue', !isOn.value);
}
</script>

<template>
    <button class="toggler" :class="{ 'toggler--on': isOn }" :title="isOn ? onTitle : offTitle" @click="toggleIsOn">
        <span class="toggler__btn">
            <slot v-if="isOn" name="on" />
            <slot v-if="!isOn" name="off" />
        </span>
    </button>
</template>

<style scoped>
/* @define toggler */
.toggler {
    display: flex;
    padding: 3px;
    box-sizing: border-box;
    align-items: center;
    width: 40px;
    height: 22px;
    background: var(--surface-accent);
    color: var(--text1);
    border: none;
    border-radius: 50px;
    transition: 0.4s linear;
    cursor: pointer;
}

.toggler[disabled] {
    opacity: 0.5;
    cursor: default;
}

.toggler__btn {
    width: 16px;
    height: 16px;
    margin-left: 0;
    border-radius: 50%;
    background-color: var(--surface-main);
    box-shadow: 0 0 2px rgba(0 0 0 / 25%);
    transition: 0.4s linear;
    display: grid;
    place-items: center;
}

.toggler--on .toggler__btn {
    margin-left: 18px;
}
</style>