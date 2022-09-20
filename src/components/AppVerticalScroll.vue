<script setup lang="ts">

import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.min.css';

const vSimpleBar = { mounted: (el: HTMLElement) => new SimpleBar(el) };

</script>
<template>
    <div v-simple-bar class="scru-vertical-scroller">
        <slot />
    </div>
</template>
<style scoped>
/* @define scru-vertical-scroller */
.scru-vertical-scroller {
    height: 100%;
}
</style>