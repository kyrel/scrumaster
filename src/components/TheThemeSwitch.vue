<script setup lang="ts">
import AppSwitch from '@/components/AppSwitch.vue';
import IconMoon from '@/components/icons/IconMoon.vue';
import IconSun from '@/components/icons/IconSun.vue';

import { onMounted, ref, watch } from 'vue';

function getPrefersDark() {
    if (localStorage.getItem("prefers-dark")) return localStorage.getItem("prefers-dark") === "true";
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const isDarkTheme = ref(getPrefersDark());

if (localStorage.getItem("prefers-dark"))
    document.firstElementChild!.setAttribute('color-scheme', localStorage.getItem("prefers-dark") === "true" ? "dark" : "light")

watch(isDarkTheme, (isDark) => {
    localStorage.setItem("prefers-dark", isDark.toString())
    document.firstElementChild!.setAttribute('color-scheme', isDark ? "dark" : "light")
})

onMounted(() => {
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', ({ matches: isDark }) => {
            isDarkTheme.value = isDark
        })
})

</script>

<template>
    <AppSwitch v-model="isDarkTheme" on-title="Switch to Light theme" off-title="Switch to Dark theme">
        <template #on>
            <IconMoon class="theme-switch__icon" />
        </template>
        <template #off>
            <IconSun class="theme-switch__icon" />
        </template>
    </AppSwitch>
</template>

<style scoped>
/* @define theme-switch */
.theme-switch__icon {
    width: 12px;
    height: 12px;
}
</style>