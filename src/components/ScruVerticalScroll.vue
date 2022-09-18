<script setup lang="ts">

import SimpleBar from 'simplebar';
import 'simplebar/dist/simplebar.min.css';

const vSimpleBar = { mounted: (el: HTMLElement) => new SimpleBar(el) }

</script>
<template>
    <div class="scru-vertical-scroller" v-simple-bar>
        <slot></slot>
    </div>
</template>
<style scoped>
/* @define scru-vertical-scroller */
.scru-vertical-scroller {
    height: 100%;
}
</style>