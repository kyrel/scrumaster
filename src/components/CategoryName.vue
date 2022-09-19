<script setup lang="ts">
import { useBoardStore } from '@/stores/board';
import type { Category } from "../types";
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import IconPencil from './icons/IconPencil.vue';
import ScruIconButton from './ScruIconButton.vue';

const props = defineProps<{
    category: Category
}>()

const boardStore = useBoardStore();

const isEditingCategoryName = ref(false);
const editedCategoryName = ref(props.category.name);
const categoryNameInput = ref(null as null | HTMLInputElement)

function startCategoryNameEdit() {
    editedCategoryName.value = props.category.name;
    isEditingCategoryName.value = true;
    nextTick(() => { categoryNameInput.value!.focus(); });
}

function cancelCategoryNameEdit() {
    editedCategoryName.value = props.category.name;
    isEditingCategoryName.value = false;
}

function finishCategoryNameEdit() {
    if (editedCategoryName.value) boardStore.renameCategory(props.category.id, editedCategoryName.value);
    else editedCategoryName.value = props.category.name;
    isEditingCategoryName.value = false;
}

function clickOutside(ev: MouseEvent) {
    if (!isEditingCategoryName.value) return;
    if (categoryNameInput.value && !(categoryNameInput.value === ev.target || categoryNameInput.value.contains(ev.target as HTMLElement))) {
        finishCategoryNameEdit();
    }
}

onMounted(async () => {
    document.body.addEventListener("click", clickOutside);
    if (props.category.id == boardStore.awaitingCategoryToEditId) {
        setTimeout(() => {
            startCategoryNameEdit();
            boardStore.stopWaitingForCategoryToEdit();
        }, 0);
    }
})

onUnmounted(() => { document.body.removeEventListener("click", clickOutside) })

</script>

<template>
    <div class="category-name">
        <div class="category-name__display" v-if="!isEditingCategoryName" :title="category.name">{{ category.name }}</div>
        <ScruIconButton @click.stop="startCategoryNameEdit" v-if="!isEditingCategoryName"
            class="category-name__edit-button">
            <IconPencil />
        </ScruIconButton>
        <input class="category-name__input" type="text" v-model="editedCategoryName" v-show="isEditingCategoryName" maxlength="32"
            ref="categoryNameInput" @keyup.enter="finishCategoryNameEdit" @keyup.escape="cancelCategoryNameEdit">
    </div>
</template>

<style scoped lang="scss">
/* @define category-name */
.category-name {
    display: flex;
    flex-direction: row;
}

.category-name__display {
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.category-name__input {
    padding: 4px 8px;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
}

.category-name__edit-button {
    margin-left: 6px;
    display: none;

    .category-name:hover & {
        display: inline-block;
    }

    @media (hover: none) {
        display: inline-block;
    }

    @media (pointer: coarse) {
        display: inline-block;
    }
}
</style>