<script setup lang="ts">import { ref } from 'vue';

const props = defineProps<{
    modelValue?: boolean,
    onTitle: string,
    offTitle: string
}>()
const emit = defineEmits({ 'update:modelValue': null });
const isOn = ref(!!props.modelValue)
function toggleIsOn() {
    isOn.value = !isOn.value;
    emit('update:modelValue', isOn.value);
}
//TODO: also define a CampaignToggler on top of that?
</script>

<template>
    <button class="toggler" :class="{ 'toggler--on': isOn }" :title="isOn ? onTitle : offTitle" @click="toggleIsOn">
        <span class="toggler__btn">
            <slot name="on" v-if="isOn"></slot>
            <slot name="off" v-if="!isOn"></slot>
        </span>
    </button>
</template>

<style scoped >
/* @define toggler */
.toggler {
    display: flex;
    padding: 3px;
    box-sizing: border-box;
    align-items: center;
    width: 40px;
    height: 22px;
    background: var(--surface3);
    color: var(--text1);
    border: none;
    border-radius: 50px;
    transition: 0.4s linear;
    cursor: pointer;
}

.toggler--on {
    /*background-color: #28b440;*/
}

.toggler[disabled] {
    /*background: var(--border);*/
    opacity: 0.5;
    cursor: default;
}

.toggler__btn {
    width: 16px;
    height: 16px;
    margin-left: 0;
    border-radius: 50%;
    background-color: var(--surface2);
    box-shadow: 0 0 2px rgba(0 0 0 / 25%);
    transition: 0.4s linear;
    display: grid;
    place-items: center;
}

.toggler--on .toggler__btn {
    margin-left: 18px;
}
</style>